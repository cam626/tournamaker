
from lib.auth_lib import authenticate_token
from lib import tournament_lib, user_lib
from google.appengine.ext import ndb
from datetime import datetime, timedelta

from flask import jsonify, request
import logging as logger

tournament_structures = ["round_robin", "n_elimination", "swiss", "custom"]

def tournament_endpoints(app):
	@app.route('/tournament', methods=['POST'])
	def create_tournament():
		'''
			This endpoint is meant for creating a tournament entity in the datastore.

			Required fields
			name: Any non-empty string that does not have leading or trailing whitespace.

			game_type: Any non-empty string. If this value falls in a set of predefined values, 
			frontend will give the option to prefill all other fields accordingly.

			tournament_structure: This may only fall in a predefined set of values and will 
			indicate how the tournament is arranged. Example values are round_robin, swiss, 
			n_elimination, etc. Based on the option chosen here, other fields must also be defined. 
			For example, if n_elimination is chosen, the elimination_number field must also be provided.

			start_date_time: The date that the tournament is set to begin. Single day tournaments will just 
			set this to be the date that the tournament is being held on.
			
			Autofilled Fields:
			last_modified
			created_date

			Optional fields:
			elimination_number
			end_date_time
			registration_open_date - automatically set to now if not supplied
			registration_close_date - automatically set to tournament start if not supplied
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Contains the parameters to create the tournament with
		json_body = request.get_json()

		# Check if there is already a tournament with this name
		name = json_body.get("name")
		if not name or name == "":
			return jsonify({"error": "The field 'name' must be provided"}), 400
		
		entity = tournament_lib.read_tournament(user_cred, name)
		if entity is not None:
			return jsonify({"error": "Tournament name already taken"}), 400

		# Prevent the user from setting protected fields
		not_allowed = ["created_date", "last_modified", "teams"]
		for key in not_allowed:
			json_body.pop(key, None)

		# Determine the create date for the object (now)
		time_stamp = datetime.now()
		json_body["created_date"] = time_stamp

		# Validate each field
		if json_body.get("game_type", "") == "":
			return jsonify({"error": "The field 'game_type' must be provided"}), 400

		structure = json_body.get("tournament_structure")
		if not structure:
			return jsonify({"error": "The field 'tournament_structure' must be provided"}), 400
		
		if structure not in tournament_structures:
			return jsonify({"error": "The tournament structure {} is not allowed".format(structure)}), 400

		if "start_date_time" not in json_body:
			json_body["start_date_time"] = time_stamp + timedelta(minutes = 30)
		else:
			try:
				json_body["start_date_time"] = datetime.strptime(json_body["start_date_time"], "%m/%d/%Y %H:%M:%S")
			except:
				json_body["start_date_time"] = time_stamp + timedelta(minutes = 30)

		if json_body["start_date_time"] < time_stamp:
			return jsonify({"error": "The tournament start date cannot be before the current datetime"}), 400

		if "end_date_time" in json_body:
			try:
				json_body["end_date_time"] = datetime.strptime(json_body["end_date_time"], "%m/%d/%Y %H:%M:%S")
			except:
				json_body["end_date_time"] = None

			if json_body["end_date_time"] < json_body["start_date_time"]:
				return jsonify({"error": "The end date of the tournament can not be before the start date"}), 400

		if "registration_open_date_time" in json_body:
			try:
				json_body["registration_open_date_time"] = datetime.strptime(json_body["registration_open_date_time"], "%m/%d/%Y %H:%M:%S")
			except:
				json_body["registration_open_date_time"] = time_stamp
		else:
			json_body["registration_open_date_time"] = time_stamp

		if "registration_close_date_time" in json_body:
			try:
				json_body["registration_close_date_time"] = datetime.strptime(json_body["registration_close_date_time"], "%m/%d/%Y %H:%M:%S")
			except:
				json_body["registration_close_date_time"] = None

		if structure == "n_elimination":
			if "elimination_number" not in json_body:
				return jsonify({"error": "The field 'elimination_number' is required with the 'n_elimination' tournament structure"}), 400

		# Create a tournament from the request body
		tournament_key = tournament_lib.create_tournament(user_cred, **json_body)

		# Now we need to add the tournament key to the list of tournaments on the user
		user_entity = user_lib.read_user(user_cred)
		user_entity.tournaments.append(tournament_key.urlsafe())
		user_entity.put()

		return jsonify({"tournament_key": tournament_key.urlsafe()}), 200

	@app.route('/tournament/<display_name>/<tournament_name>', methods=['GET'])
	def search_for_tournament(display_name, tournament_name):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		tournament_entity = tournament_lib.read_tournament_from_display_name(display_name, tournament_name)

		if not tournament_entity:
			return jsonify({"error": "Tournament not found"}), 404
		return jsonify(tournament_entity.to_dict()), 200

	@app.route('/tournament/<tournament_key>', methods=['GET'])
	def read_tournament(tournament_key):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"})

		tournament_entity = tournament_key.get()
		if not tournament_entity:
			return jsonify({"error": "Invalid tournament key"})

		user_entity = user_lib.read_user(user_cred)
		if user_entity.key.urlsafe() == tournament_entity.owner:
			return jsonify(tournament_entity.to_dict()), 200

		team_keys = user_entity.teams
		for team_key in team_keys:
			if team_key in tournament_entity.teams:
				return jsonify(tournament_entity.to_dict()), 200

		return jsonify({"error": "You do not have access to this tournament"}), 401


	@app.route('/tournament/<tournament_key>/signup/<team_key>', methods=['POST'])
	def signup_team_for_tournament(tournament_key, team_key):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"}), 404

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 404

		tournament_entity = tournament_key.get()
		team_entity = team_key.get()

		tournament_entity.teams.append(team_key.urlsafe())
		team_entity.events.append(tournament_key.urlsafe())

		tournament_entity.put()
		team_entity.put()

		return "Success", 200

	@app.route('/tournament/<tournament_key>/leave/<team_key>', methods=['POST'])
	def remove_team_from_tournament(tournament_key, team_key):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"}), 404

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 404

		tournament_entity = tournament_key.get()
		team_entity = team_key.get()

		if team_key.urlsafe() in tournament_entity.teams:
			tournament_entity.teams.remove(team_key.urlsafe())
		else:
			return jsonify({"error": "Team not in tournament"}), 400
			
		if tournament_key.urlsafe() in team_entity.events:
			team_entity.events.remove(tournament_key.urlsafe())
		else:
			return jsonify({"error": "Tournament not in team events list"}), 400

		tournament_entity.put()
		team_entity.put()

		return "Success", 200
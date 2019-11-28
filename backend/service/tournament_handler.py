
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

		if "start_date_time" in json_body:
			try:
				json_body["start_date_time"] = datetime.strptime(json_body["start_date_time"], "%m/%d/%Y %H:%M:%S")
				
				if json_body["start_date_time"] < time_stamp:
					json_body.pop("start_date_time", None)
			except:
				json_body.pop("start_date_time", None)

		if "end_date_time" in json_body:
			try:
				json_body["end_date_time"] = datetime.strptime(json_body["end_date_time"], "%m/%d/%Y %H:%M:%S")
			
				if json_body["end_date_time"] < json_body["start_date_time"]:
					json_body.pop("end_date_time", None)
			except:
				json_body.pop("end_date_time", None)

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
				json_body.pop("registration_close_date_time", None)

		if structure == "n_elimination":
			if "elimination_number" not in json_body or not isinstance(json_body['elimination_number'], int):
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
		'''
			Find a tournament based on the display name of the owner and
			the name of the tournament.
		'''
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		tournament_entity = tournament_lib.read_tournament_from_display_name(display_name, tournament_name)

		if not tournament_entity:
			return jsonify({"error": "Tournament not found"}), 404

		user_entity = user_lib.get_user_by_display_name(display_name)

		if user_entity is None:
			return jsonify({"error": "User not found"}), 404

		result = {
			"tournament": tournament_entity.to_dict(),
			"user_key": user_entity.key.urlsafe(),
			"tournament_key": tournament_entity.key.urlsafe()
		}

		return jsonify(result), 200

	@app.route('/tournament/<tournament_key>', methods=['GET'])
	def read_tournament(tournament_key):
		'''
			Read a tournament entity given the tournament key.

			The user sending the request must be logged in, but does
			not need to be a member of the tournament.
		'''
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Get the key object from the urlsafe key
		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"}), 400

		# Get the tournament entity from the key
		tournament_entity = tournament_key.get()
		if not tournament_entity:
			return jsonify({"error": "Tournament not found"}), 404

		return jsonify(tournament_entity.to_dict()), 200

	@app.route('/tournament/<tournament_key>/signup/<team_key>', methods=['POST'])
	def signup_team_for_tournament(tournament_key, team_key):
		'''
			Sign a team up for a tournament.

			The user sending the request must be a member of the team.

			The team must not already be in the tournament.
		'''
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"}), 400

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 400

		tournament_entity = tournament_key.get()
		team_entity = team_key.get()

		# Check that the user sending the request is on the team
		user_entity = user_lib.read_user(user_cred)
		if user_entity.key.urlsafe() not in team_entity.members:
			return jsonify({"error": "You do not have access to this team"}), 401

		# Check that the team is not already in the tournament
		if team_key.urlsafe() in tournament_entity.teams:
			return jsonify({"error": "Team already in tournament"}), 400

		tournament_entity.teams.append(team_key.urlsafe())
		tournament_entity.put()

		# Check that the tournament is not in the team's events
		if tournament_key.urlsafe() in team_entity.events:
			return jsonify({"error": "Tournament already in team's events"}), 400

		team_entity.events.append(tournament_key.urlsafe())
		team_entity.put()

		return "Success", 200

	@app.route('/tournament/<tournament_key>/leave/<team_key>', methods=['DELETE'])
	def remove_team_from_tournament(tournament_key, team_key):
		'''
			Remove a team from a tournament. 

			The user sending the request must be a member of the team.

			The team must be in the tournament.
		'''
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return jsonify({"error": "Invalid tournament key"}), 400

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 400

		tournament_entity = tournament_key.get()
		team_entity = team_key.get()

		# Check that the user sending the request is on the team
		user_entity = user_lib.read_user(user_cred)
		if user_entity.key.urlsafe() not in team_entity.members:
			return jsonify({"error": "You do not have access to this team"}), 401

		# Remove the team if it is on the tournament
		if team_key.urlsafe() in tournament_entity.teams:
			tournament_entity.teams.remove(team_key.urlsafe())
			tournament_entity.put()
		else:
			return jsonify({"error": "Team not in tournament"}), 400
		
		# Remove the tournament if it is in the team's events
		if tournament_key.urlsafe() in team_entity.events:
			team_entity.events.remove(tournament_key.urlsafe())
			team_entity.put()
		else:
			return jsonify({"error": "Tournament not in team events list"}), 400

		return "Success", 200

	@app.route('/tournament/<tournament_key>/match', methods=['POST'])
	def add_match(tournament_key):
		match_parameters = {
			"team1": "This would be a teamkey",
			"team2": "This would be another teamkey",
			"num_games": 2
		}
		tournament_key = ndb.Key(urlsafe=tournament_key)
		match_key = tournament_lib.add_match(tournament_key, **match_parameters)

		return jsonify({"match_key": match_key.urlsafe()}), 200

	@app.route('/tournament/keys/convert', methods=['POST'])
	def convert_tournament_keys_to_names():
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		json_body = request.get_json()

		if "keys" not in json_body:
			return jsonify({"error": "The field 'keys' must be provided"}), 400

		tournament_keys = json_body['keys']

		result = {}
		for key in tournament_keys:
			try:
				key_obj = ndb.Key(urlsafe=key)
			except:
				continue

			tournament_entity = key_obj.get()

			if not tournament_entity:
				continue

			result[key] = tournament_entity.name

		return jsonify(result), 200
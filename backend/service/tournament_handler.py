
from lib.auth_lib import authenticate_token
from lib import tournament_lib, user_lib
from google.appengine.ext import ndb
from datetime import datetime

from flask import jsonify, request
import logging as logger

def tournament_endpoints(app):
	@app.route('/tournament', methods=['POST'])
	def create_tournament():
		'''
			This endpoint is meant for creating a tournament entity in the datastore.

			This data entity represents a single tournament. The tournament can be a 
			separate entity or it can be part of a league. If a tournament is in a league, 
			the user must register for the league before signing up for the tournament. 
			A tournament belongs to the user that created it and can be public or private. 
			Public tournaments can be searched, but private tournaments can only be signed 
			up for by invite link or by inputting the ID of the tournament.

			Required fields
			name: Any non-empty string that does not have leading or trailing whitespace.

			game_type: Any non-empty string. If this value falls in a set of predefined values, 
			frontend will give the option to prefill all other fields accordingly.

			tournament_structure: This may only fall in a predefined set of values and will 
			indicate how the tournament is arranged. Example values are round_robin, swiss, 
			n_elimination, etc. Based on the option chosen here, other fields must also be defined. 
			For example, if n_elimination is chosen, the elimination_number field must also be provided.

			start_date: The date that the tournament is set to begin. Single day tournaments will just set this to be the date that the tournament is being held on.
			
			Autofilled Fields:
			created_date

			Optional fields
			elimination_number
			start_time
			end_time
			end_date
			registration_open_date
			registration_close_date
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)
		json_body = request.get_json()

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		# Check if there is already a tournament with this name
		name = json_body.get("name")
		if not name:
			return "The field 'name' must be provided", 400
		
		entity = tournament_lib.read_tournament(user_cred, name)
		if entity is not None:
			return "Tournament name in use", 400

		# Create a tournament from the request body
		time_stamp = datetime.now()
		json_body["created_date"] = time_stamp
		tournament_key = tournament_lib.create_tournament(user_cred, **json_body)

		# Now we need to add the tournament key to the list of tournaments on the user
		user_entity = user_lib.read_user(user_cred)
		user_entity.tournaments.append(tournament_key.urlsafe())
		user_entity.put()

		return jsonify({"tournament_key": tournament_key.urlsafe()})

	@app.route('/tournament/<display_name>/<tournament_name>', methods=['GET'])
	def get_tournament(display_name, tournament_name):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		tournament_entity = tournament_lib.read_tournament_from_display_name(display_name, tournament_name)

		if not tournament_entity:
			return "Tournament not found", 404
		return jsonify(tournament_entity.to_dict()), 200

	@app.route('/tournament/<tournament_key>/signup/<team_key>', methods=['POST'])
	def signup_team_for_tournament(tournament_key, team_key):
		user_cred = authenticate_token(request)
		
		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return "Invalid tournament key", 404

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Invalid team key", 404

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
			return "Unauthorized", 401

		try:
			tournament_key = ndb.Key(urlsafe=tournament_key)
		except:
			return "Invalid tournament key", 404

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Invalid team key", 404

		tournament_entity = tournament_key.get()
		team_entity = team_key.get()

		if team_key.urlsafe() in tournament_entity.teams:
			tournament_entity.teams.remove(team_key.urlsafe())
		else:
			return "Team not in tournament", 400
			
		if tournament_key.urlsafe() in team_entity.events:
			team_entity.events.remove(tournament_key.urlsafe())
		else:
			return "Tournament not in team events list", 400

		tournament_entity.put()
		team_entity.put()

		return "Success", 200
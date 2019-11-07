
from lib.auth_lib import authenticate_token
from lib import tournament_lib, user_lib, team_lib
from datetime import datetime

from flask import jsonify, request
import logging as logger

def team_endpoints(app):
	@app.route('/team', methods=['POST'])
	def create_team():
		'''
			This endpoint is meant for creating a team entity in the datastore.
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)
		json_body = request.get_json()

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		# Check if there is already a team with this name for this user
		name = json_body.get("name")
		
		entity = team_lib.read_team(name)
		if entity is not None:
			return "Team name in use", 400

		# Create a team from the request body
		team_key = team_lib.create_tournament(**json_body)

		return jsonify({"team_key": team_key.urlsafe()})

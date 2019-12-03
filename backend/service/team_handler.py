
from lib.auth_lib import authenticate_token
from lib import tournament_lib, user_lib, team_lib
from google.appengine.ext import ndb
from datetime import datetime

from flask import jsonify, request
import logging as logger

def team_endpoints(app):
	@app.route('/team', methods=['POST'])
	def create_team():
		'''
			This endpoint is meant for creating a team entity in the datastore.

			The only field required in the body of this request is 'name'.
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Check if there is already a team with this name
		json_body = request.get_json()
		name = json_body.get("name")
		if not name:
			return jsonify({"error": "The field 'name' must be provided"}), 400
		
		entity = team_lib.read_team(name)
		if entity is not None:
			return jsonify({"error": "Team name in use"}), 400

		# Make sure the caller didn't try to add protected fields
		not_allowed = ["members", "events"]
		for key in not_allowed:
			json_body.pop(key, None)

		member_entities = []

		# Get the entities of the invited users
		invited_members_display_names = set(json_body.pop("invited_members", []))
		json_body["invited_members"] = []
		for display_name in invited_members_display_names:
			member = user_lib.get_user_by_display_name(display_name)
			if member:
				member_entities.append(member)
			
				# Add the invited user keys to the list of invited members
				json_body["invited_members"].append(member.key.urlsafe())

		# The user that created the team should automatically be a member
		user_entity = user_lib.read_user(user_cred)
		json_body["members"] = [user_entity.key.urlsafe()]

		# Create a team from the request body
		team_key = team_lib.create_team(**json_body)

		# Add each invite to the invited users' entities
		for member in member_entities:
			member.team_invites.append(team_key.urlsafe())
			member.put()

		# Add this team to the list of teams for the creator
		user_entity.teams.append(team_key.urlsafe())
		user_entity.put()

		return jsonify({"team_key": team_key.urlsafe()})

	@app.route('/team/<team_key>', methods=['GET'])
	def read_team(team_key):
		'''
			Read a team object for a given team key.

			Must have a valid auth token for a user that is
			a member or invited member of the team.
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Create the key object
		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 404

		# Get the team entity
		team_entity = team_key.get()
		if not team_entity:
			return jsonify({"error": "Team not found"}), 404

		# Get the user entity
		user_entity = user_lib.read_user(user_cred)

		# Check that the user has access to the team
		if user_entity.key.urlsafe() not in team_entity.members and user_entity.key.urlsafe() not in team_entity.invited_members:
			return jsonify({"error": "You do not have access to this team"}), 401

		return jsonify(team_entity.to_dict()), 200

	@app.route('/team/<team_key>/invite/<user_key>', methods=['POST'])
	def invite_user_to_team(team_key, user_key):
		'''
			Invite a user to join a team.

			The user sending the request must be a member of the team
			to invite a new member.

			The user being invited must not be a member or already
			have an invite.
		'''

		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Create the team key object
		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Invalid team key"}), 400

		# Create the user key object
		try:
			user_key = ndb.Key(urlsafe=user_key)
		except:
			return jsonify({"error": "Invalid user key"}), 400

		team_entity = team_key.get()
		user_entity = user_key.get()

		if not team_entity:
			return jsonify({"error": "Team not found"}), 404

		if not user_entity:
			return jsonify({"error": "User not found"}), 404
		
		# Validate that the user inviting has access
		inviting_user_entity = user_lib.read_user(user_cred)
		if inviting_user_entity.key.urlsafe() not in team_entity.members:
			return jsonify({"error": "You do not have access to this team"}), 401

		# Validate that the user being invited is not already invited or on the team
		if user_entity.key.urlsafe() in team_entity.members or user_entity.key.urlsafe() in team_entity.invited_members:
			return jsonify({"error": "User already has invite or is a member of this team"}), 400

		team_entity.invited_members.append(user_key.urlsafe())
		user_entity.team_invites.append(team_key.urlsafe())

		team_entity.put()
		user_entity.put()

		return "Success", 200
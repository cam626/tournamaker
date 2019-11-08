
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
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)
		json_body = request.get_json()

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		# Check if there is already a team with this name for this user
		name = json_body.get("name")
		if not name:
			return "The field 'name' must be provided", 400
		
		entity = team_lib.read_team(name)
		if entity is not None:
			return "Team name in use", 400

		# Make sure the caller didn't try to add members or events
		json_body.pop("members", None)
		json_body.pop("events", None)

		member_entities = []

		invited_members_display_names = set(json_body.pop("invited_members", []))
		json_body["invited_members"] = []
		for display_name in invited_members_display_names:
			member = user_lib.get_user_by_display_name(display_name)
			member_entities.append(member)
			json_body["invited_members"].append(member.key.urlsafe())

		user_entity = user_lib.read_user(user_cred)
		json_body["members"] = [user_entity.key.urlsafe()]

		# Create a team from the request body
		team_key = team_lib.create_team(**json_body)

		for member in member_entities:
			member.team_invites.append(team_key.urlsafe())
			member.put()

		user_entity.teams.append(team_key.urlsafe())
		user_entity.put()

		return jsonify({"team_key": team_key.urlsafe()})

	@app.route('/team/<team_key>')
	def read_team(team_key):
		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Team not found", 404

		team_entity = team_key.get()
		if not team_entity:
			return "Team not found", 404

		return jsonify(team_entity.to_dict())

	@app.route('/team/<team_key>/invite/<user_key>', methods=['POST'])
	def invite_user_to_team(team_key, user_key):
		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Team not found", 404

		try:
			user_key = ndb.Key(urlsafe=user_key)
		except:
			return "User not found", 404


		team_entity = team_key.get()
		user_entity = user_key.get()
		
		team_entity.invited_members.append(user_key.urlsafe())
		user_entity.team_invites.append(team_key.urlsafe())

		team_entity.put()
		user_entity.put()

		return "Success", 200

	@app.route('/team/invite/accept/<team_key>', methods=['POST'])
	def accept_team_invite(team_key):
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401
		user_entity = user_lib.read_user(user_cred)

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Team not found", 404

		team_entity = team_key.get()

		if user_entity.key.urlsafe() not in team_entity.invited_members:
			return "No invite to given team", 400

		# Move user from invited to member
		team_entity.invited_members.remove(user_entity.key.urlsafe())
		team_entity.members.append(user_entity.key.urlsafe())
		team_entity.put()

		# Move team from team invites to teams
		user_entity.team_invites.remove(team_entity.key.urlsafe())
		user_entity.teams.append(team_entity.key.urlsafe())
		user_entity.put()

		return "Success", 200

	@app.route('/team/invite/decline/<team_key>', methods=['POST'])
	def decline_team_invite(team_key):
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401
		user_entity = user_lib.read_user(user_cred)

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return "Team not found", 404

		team_entity = team_key.get()

		if user_entity.key.urlsafe() not in team_entity.invited_members:
			return "No invite to given team", 400

		# Move user from invited to member
		team_entity.invited_members.remove(user_entity.key.urlsafe())
		team_entity.put()

		# Move team from team invites to teams
		user_entity.team_invites.remove(team_entity.key.urlsafe())
		user_entity.put()

		return "Success", 200
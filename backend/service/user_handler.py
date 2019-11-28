
from lib.auth_lib import authenticate_token
from lib import user_lib
from lib.models.models import User
from google.appengine.ext import ndb

from flask import jsonify, request
import logging as logger

def user_endpoints(app):
	@app.route('/user', methods=['GET'])
	def read_user():
		'''
			Endpoint to access the User Model associated with the user that
			is logged in. If a user entity does not exist, one is created.
		'''
		user_cred = authenticate_token(request)
		
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Get a user object for the credentials given. This call will create the entity
		# if needed
		user_entity = user_lib.read_user(user_cred)

		# This shouldn't happen
		if user_entity is None:
			return jsonify({"error": "Error reading user"}), 500

		# Return all fields
		return jsonify(user_entity.to_dict()), 200

	@app.route('/user', methods=['PATCH'])
	def update_user():
		'''
			Endpoint to update an existing user. If the request includes 
			fields that are not updatable, they will be removed from the
			updates.

			Currently the only updatable property is display_name. (All
			other fields are protected)
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401

		# Get the object attached to the user
		user_entity = user_lib.read_user(user_cred)

		# Get the updates that the user wants to do from the request
		updates = request.get_json()
		if not updates:
			return jsonify({"error": "No update fields"}), 400

		# Make sure the user doesn't try to update anything that
		# they're not allowed to
		not_allowed = ["last_modified", "email", "tournaments", "team_invites", "teams"]
		for key in not_allowed:
			updates.pop(key, None)

		# If the user is updating display_name, make sure it is not in use
		if "display_name" in updates and user_lib.get_user_by_display_name(updates["display_name"]) != None:
			return jsonify({"error": "Display name already in use"}), 400

		# Remove updates that dont match the Model
		keys = updates.keys()
		for update_key in keys:
			if update_key not in User._properties:
				updates.pop(update_key, None)

		# Apply the updates
		user_entity.populate(**updates)

		# Store the changes
		user_entity.put()

		return "Success", 200

	@app.route('/user/<team_key>/accept', methods=['PATCH'])
	def accept_team_invite(team_key):
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401
		user_entity = user_lib.read_user(user_cred, use_cache=False, use_memcache=False)

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Team not found"}), 404

		team_entity = team_key.get(use_cache=False, use_memcache=False)

		if user_entity.key.urlsafe() not in team_entity.invited_members:
			return jsonify({"error": "No active invite to given team"}), 400

		if user_entity.key.urlsafe() in team_entity.members:
			team_entity.invited_members.remove(user_entity.key.urlsafe())
			team_entity.put()

			user_entity.team_invites.remove(team_entity.key.urlsafe())
			user_entity.put()

			return jsonify({"error": "User already on team"}), 400

		# Move user from invited to member
		team_entity.invited_members.remove(user_entity.key.urlsafe())
		team_entity.members.append(user_entity.key.urlsafe())
		team_entity.put()

		# Move team from team invites to teams
		user_entity.team_invites.remove(team_entity.key.urlsafe())
		user_entity.teams.append(team_entity.key.urlsafe())
		user_entity.put()

		return "Success", 200

	@app.route('/user/<team_key>/decline', methods=['DELETE'])
	def decline_team_invite(team_key):
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return jsonify({"error": "Unauthorized"}), 401
		user_entity = user_lib.read_user(user_cred, use_cache=False, use_memcache=False)

		try:
			team_key = ndb.Key(urlsafe=team_key)
		except:
			return jsonify({"error": "Team not found"}), 404

		team_entity = team_key.get(use_cache=False, use_memcache=False)

		if user_entity.key.urlsafe() not in team_entity.invited_members:
			return jsonify({"error": "No active invite to given team"}), 400

		# Move user from invited to member
		team_entity.invited_members.remove(user_entity.key.urlsafe())
		team_entity.put()

		# Move team from team invites to teams
		user_entity.team_invites.remove(team_entity.key.urlsafe())
		user_entity.put()

		return "Success", 200
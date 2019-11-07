
from lib.auth_lib import authenticate_token
from lib import user_lib
from lib.models.error_models import UnauthorizedResponse

from flask import jsonify, request
import logging as logger

def user_endpoints(app):
	@app.route('/user', methods=['GET'])
	def read_user():
		'''
			Endpoint to access the User Model associated with the user that
			is logged in.
		'''
		user_cred = authenticate_token(request)
		
		if user_cred == None:
			response = jsonify(UnauthorizedResponse().to_dict())
			return response, response.status

		# Get a user object for the credentials
		user_entity = user_lib.read_user(user_cred)
		logger.info("Read User: {}".format(user_entity.display_name))

		return jsonify(user_entity.to_dict())

	@app.route('/user', methods=['PATCH'])
	def update_user():
		'''
			Endpoint to update an existing user. This endpoint
			will reject a request if it does not include a valid 
			auth token. If the request includes fields that are not
			updatable, the remaining fields will be updated and the
			incorrect fields will be returned in the response.

			Request body:
			{
				"display_name": ""
			}

			Returns:
			{
				"invalid_fields": [""]
			}
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		# Get the object attached to the user
		user_entity = user_lib.read_user(user_cred)

		# Get the updates that the user wants to do from the request
		updates = request.get_json()
		if not updates:
			return "No update fields", 400

		# Check special case updates (display_name must be unique)
		if "display_name" in updates and user_lib.get_user_by_display_name(updates["display_name"]) != None:
			return "Display Name already in use", 400

		# Apply each update
		user_entity.populate(**updates)

		# Store the changes
		user_entity.put()

		return jsonify({"invalid_fields": []})

from lib.auth_lib import authenticate_token
from lib import user_lib

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
			return "Unauthorized", 401

		# Get a user object for the credentials
		user_entity = user_lib.read_user(user_cred)
		logger.info("Read User: {}".format(user_entity.name))

		return jsonify(user_entity.to_dict())
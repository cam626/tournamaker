import flask_cors
from auth_lib import authenticate_token

from flask import Flask, jsonify, request
import google.oauth2.id_token
import requests
import requests_toolbelt.adapters.appengine
import user_lib
import logging as logger
import json

app = Flask(__name__)

flask_cors.CORS(app)

requests_toolbelt.adapters.appengine.monkeypatch()

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
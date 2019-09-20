import flask_cors

from flask import Flask, jsonify, request
import google.oauth2.id_token
import requests
import requests_toolbelt.adapters.appengine
import user_lib
import logging as logger
import json

__FIREBASE_USER_VERIFY_SERVICE = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword"

app = Flask(__name__)

flask_cors.CORS(app)

requests_toolbelt.adapters.appengine.monkeypatch()

CONSTANTS = json.load(open("constants.json", "r"))

@app.route('/login', methods=['POST'])
def login():
	'''
		Retrieve an authentication token.

		Request:
		{
			"email": "",
			"password": ""
		}

		Return:
		{
			"token": ""
		}
	'''
	body = request.get_json()
	email = body.get("email")
	password = body.get("password")
	
	if not email or not password:
		return "Bad Request", 400

	# Set up request to send to firebase
	url = "{}?key={}".format(__FIREBASE_USER_VERIFY_SERVICE, CONSTANTS["API_KEY"])

	request_body = {
		"email": email,
		"password": password,
		"returnSecureToken": True
	}

	# Send the actual request
	result = requests.post(url, json=request_body)

	json_result = result.json()

	if "error" in json_result:
		return jsonify({"error": "Invalid Login"}), 401

	return jsonify(json_result)
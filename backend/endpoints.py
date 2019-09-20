import flask_cors

from flask import Flask, jsonify, request
import google.auth.transport.requests as google_request
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
HTTP_REQUEST = google_request.Request()

CONSTANTS = json.load(open("constants.json", "r"))

def authenticate_token(request):
	'''
		Use basic authentication with firebase to determine if the given request has
		a valid firebase auth token.

		Parameters:
			- request: A flask request object.

		Returns: The corresponding user credentials of the given auth token or
			None if the token is not valid.
	'''
	logger.info("Authenticating User...")
	id_token = request.headers.get('Authorization', "").split(' ').pop()
	
	# Handle case with no authorization
	user_cred = google.oauth2.id_token.verify_firebase_token(
		id_token, HTTP_REQUEST)
	
	if not user_cred:
		logger.warn("User Authentication Failed")

	return user_cred

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

if __name__ == "__main__":
	app.run(debug=True, host='127.0.0.1', port=int(os.environ.get('PORT', 8081)))
import flask_cors

from flask import Flask, jsonify, request
import google.auth.transport.requests
import requests_toolbelt.adapters.appengine
import user_lib

app = Flask(__name__)

flask_cors.CORS(app)

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

def authenticate_token(request):
	'''
		Use basic authentication with firebase to determine if the given request has
		a valid firebase auth token.

		Parameters:
			- request: A flask request object.

		Returns: The corresponding user credentials of the given auth token or
			None if the token is not valid.
	'''
    id_token = request.headers['Authorization'].split(' ').pop()
    user_cred = google.oauth2.id_token.verify_firebase_token(
        id_token, HTTP_REQUEST)
    
	return user_cred

@app.route('/user/<user_id>', methods=['GET'])
def read_user(user_id):
	user_cred = authenticate_token(request)

	if user_cred == None:
		return "Unauthorized", 401

	# Get a user object for the credentials
	user_key = user_lib.read_user(user_cred)

	

if __name__ == "__main__":
	app.run(debug=True, host='127.0.0.1', port=int(os.environ.get('PORT', 8081)))
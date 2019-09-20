import google.auth.transport.requests as google_request

HTTP_REQUEST = google_request.Request()

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
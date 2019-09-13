from models import UserModel

def create_user(user_cred):
	'''
		Create a new User object in the datastore.

		Parameters:
			- user_cred: A set of firebase user credentials.

		Returns: A key object for a UserModel in the datastore.
	'''

def read_user(user_cred):
	'''
		Attempt to read a user attached to a set of user credentials. If the user credentials are
		not associated with a user object, a new object will be created and returned.

		Parameters:
			- user_cred: A set of firebase user credentials.

		Returns: A Key object for a UserModel in the datastore.
	'''
	# Instantiate the model in memory
	# Setting up the key this way will ensure that this object belongs to this user ('sub' is unique)
	user = UserModel(key=ndb.Key(UserModel, user_cred['sub']), name=user_cred.get('name'), email=user_cred.get('email'))

	# Add the model to the datastore
	user_key = user.put()

	return user_key
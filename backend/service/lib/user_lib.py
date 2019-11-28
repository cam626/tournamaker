from google.appengine.ext import ndb
from models.models import User
import logging as logger

def create_user(user_cred):
	'''
		Create a new User object in the datastore.

		Parameters:
			- user_cred: A set of firebase user credentials.

		Returns: A key object for a User in the datastore.
	'''
	# Instantiate the model in memory
	# Setting up the key this way will ensure that this object belongs to this user ('sub' is unique)
	user = User(key=ndb.Key(User, user_cred['sub']), email=user_cred.get('email'))

	# Add the model to the datastore
	user_key = user.put()

	return user_key

def read_user(user_cred, **kwargs):
	'''
		Attempt to read a user attached to a set of user credentials. If the user credentials are
		not associated with a user object, a new object will be created and returned.

		Parameters:
			- user_cred: A set of firebase user credentials.

		Returns: A User entity.
	'''
	# Firebase will make sure that 'sub' is unique
	user_key = ndb.Key(User, user_cred['sub'])
	user_entity = user_key.get(**kwargs)

	if not user_entity:
		user_key = create_user(user_cred)
		user_entity = user_key.get(**kwargs)

	return user_entity

def get_user_by_display_name(display_name):
	'''
		Seach for a user based on their display_name.

		If a user is found, the user entity is returned. Otherwise
		None is returned.
	'''
	results = User.query(User.display_name == display_name)
	results = results.fetch()

	if len(results) == 0:
		return None

	if len(results) > 1:
		logger.warn("More than one user with display name: {}".format(display_name))

	return results[0]
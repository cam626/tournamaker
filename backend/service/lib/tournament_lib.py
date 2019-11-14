from google.appengine.ext import ndb
from models.models import Tournament, User
from . import user_lib

def key_from_name(user_cred, name):
	return ndb.Key(Tournament, name, parent=ndb.Key(User, user_cred['sub']))

def create_tournament(user_cred, **kwargs):
	'''
		Create a new Tournament object in the datastore.

		Parameters:
			- user_cred: A set of firebase user credentials. The tournament will belong
							to this user.
			- **kwargs: A Flask request object with the information that the tournament
						should be created from.

		Returns: A key object for a Tournament in the datastore.
	'''
	# Instantiate the model in memory
	# Setting up the key this way will ensure that this object belongs to this user ('sub' is unique)
	
	user_entity = user_lib.read_user(user_cred)
	kwargs["owner"] = user_entity.key.urlsafe()

	tournament_key = key_from_name(user_cred, kwargs["name"])
	tournament = Tournament(key=tournament_key, **kwargs)

	# Add the model to the datastore
	tournament_key = tournament.put()

	return tournament_key

def read_tournament(user_cred, tournament_name):
	'''
		Attempt to read a tournament from a user based on the user credentials
		and the name of the tournament.

		Returns: A tournament entity or None if the tournament does not exist.
	'''
	tournament_key = key_from_name(user_cred, tournament_name)
	entity = tournament_key.get()

	return entity

def read_tournament_from_display_name(display_name, tournament_name):
	try:
		user_key = user_lib.get_user_by_display_name(display_name).key
	except:
		return None

	try:
		tournament_key = ndb.Key(Tournament, tournament_name, parent=user_key)
	except:
		return None

	return tournament_key.get()
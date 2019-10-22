from google.appengine.ext import ndb
from models.models import Tournament, User

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
	tournament_key = ndb.Key(Tournament, kwargs['name'], parent=ndb.Key(User, user_cred['sub']))
	tournament = Tournament(key=tournament_key, **kwargs)

	# Add the model to the datastore
	tournament_key = tournament.put()

	return tournament_key

# def read_tournament(user_cred):
# 	'''
# 		Attempt to read a user attached to a set of user credentials. If the user credentials are
# 		not associated with a user object, a new object will be created and returned.

# 		Parameters:
# 			- user_cred: A set of firebase user credentials.

# 		Returns: A User entity.
# 	'''
# 	user_key = ndb.Key(User, user_cred['sub'])
# 	user_entity = user_key.get()

# 	if not user_entity:
# 		user_key = create_user(user_cred)
# 		user_entity = user_key.get()

# 	return user_entity
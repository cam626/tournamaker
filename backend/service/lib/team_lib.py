from google.appengine.ext import ndb
from models.models import Tournament, User, Team

def key_from_name(name):
	return ndb.Key(Team, name)

def create_team(**kwargs):
	'''
		Create a new Team object in the datastore.

		Parameters:
			- **kwargs: A Flask request object with the information that the team
						should be created from.

		Returns: A key object for a Team in the datastore.
	'''
	# Instantiate the model in memory
	# Setting up the key this way will ensure that this object belongs to this user ('sub' is unique)
	team_key = key_from_name(kwargs["name"])
	team = Team(key=team_key, **kwargs)

	# Add the model to the datastore
	team_key = team.put()

	return team_key

def read_team(name):
	'''
		Attempt to read a team from a user based on the user credentials
		and the name of the team.

		Returns: A team entity or None if the team does not exist.
	'''
	team_key = key_from_name(name)
	entity = team_key.get()

	return entity
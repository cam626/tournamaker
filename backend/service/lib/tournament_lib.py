from google.appengine.ext import ndb
from models.models import Tournament, User
import user_lib
import match_lib

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
	'''
		Read a tournament given the display name of the owner and the
		name of the tournament. 

		This works because display names are unique and tournament names
		are unique for each user.

		Returns a tournament entity or None.
	'''
	# Get the user key
	try:
		user_key = user_lib.get_user_by_display_name(display_name).key
	except:
		return None

	# Create the tournament key with the user key as a parent and tournament name
	try:
		tournament_key = ndb.Key(Tournament, tournament_name, parent=user_key)
	except:
		return None

	# Return the entity
	return tournament_key.get()

def create_balanced_round_robin(players):
	"""
		Create a schedule for the players in the list and return it.

		This algorithm was taken from https://gist.github.com/ih84ds/be485a92f334c293ce4f1c84bfba54c9
		and credit goes to github user ih84ds.
	"""
	s = []
	if len(players) % 2 == 1: players = players + [None]
	# manipulate map (array of indexes for list) instead of list itself
	# this takes advantage of even/odd indexes to determine home vs. away
	n = len(players)
	map = list(range(n))
	mid = n // 2
	for i in range(n-1):
		l1 = map[:mid]
		l2 = map[mid:]
		l2.reverse()
		round = []
		for j in range(mid):
			t1 = players[l1[j]]
			t2 = players[l2[j]]
			if j == 0 and i % 2 == 1:
				# flip the first match only, every other round
				# (this is because the first match always involves the last player in the list)
				round.append((t2, t1))
			else:
				round.append((t1, t2))
		s.append(round)
		# rotate list by n/2, leaving last element at the end
		map = map[mid:-1] + map[:mid] + map[-1:]
	return s
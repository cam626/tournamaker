from google.appengine.ext import ndb
from models.models import Game, Match

def create_game(match_key):
	'''
		Creates a game that belongs to a match.

		Returns the NDB key to the new game.
	'''
	new_id = ndb.Model.allocate_ids(size=1, parent=match_key)[0]

	game_key = ndb.Key(Game, new_id)
	game = Game(key=game_key)
	game_key = game.put()

	return game_key
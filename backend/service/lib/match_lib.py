from google.appengine.ext import ndb
from models.models import Game, Match
import game_lib

def create_match(event_key, **kwargs):
	'''
		Creates a match that belongs to an event (tournament, season, exhibition).

		Returns the NDB key to the new match.
	'''
	# Create the match with the static info first
	new_id = ndb.Model.allocate_ids(size=1, parent=event_key)[0]
	match_key = ndb.Key(Match, new_id)
	
	if "num_games" not in kwargs:
		kwargs["num_games"] = Match.num_games._default

	kwargs["event"] = event_key.urlsafe()
	
	if kwargs["home"] == None:
		kwargs["home"] = "None"
	
	if kwargs["away"] == None:
		kwargs["away"] = "None"

	# Create the number of games that should be in this match
	kwargs["games"] = []
	num_games = int(kwargs["num_games"])
	for game_index in range(num_games):
		temp_game_key = game_lib.create_game(match_key)
		kwargs["games"].append(temp_game_key.urlsafe())

	match = Match(key=match_key, **kwargs)
	match_key = match.put()

	return match_key
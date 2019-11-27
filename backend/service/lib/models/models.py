from google.appengine.ext import ndb

class User(ndb.Model):
	# Unique globally
	display_name = ndb.StringProperty(required=True, default="")
	email = ndb.StringProperty(required=True)

	# Useful for sorting
	last_modified = ndb.DateTimeProperty(auto_now_add=True)

	# Tournaments owned by this user
	tournaments = ndb.StringProperty(repeated=True)

	# Invites not accepted or declined
	team_invites = ndb.StringProperty(repeated=True)

	# Teams created or in (No difference)
	teams = ndb.StringProperty(repeated=True)

class Tournament(ndb.Model):
	# Unique under creator
	name = ndb.StringProperty(required=True)

	# Can be anything except empty string
	game_type = ndb.StringProperty(required=True)

	# Must be one of the predefined structures
	tournament_structure = ndb.StringProperty(required=True)

	# Useful for sorting
	created_date = ndb.DateTimeProperty()
	last_modified = ndb.DateTimeProperty(auto_now_add=True)

	# Starts empty
	teams = ndb.StringProperty(repeated=True)

	description = ndb.TextProperty()

	# If the user doesn't set this, the tournament will start whenever the user says
	start_date_time = ndb.DateTimeProperty()
	
	# Tournaments can go for unlimited time
	end_date_time = ndb.DateTimeProperty()

	# Tournament can open registration at creation if not specified
	# Must be before registration close
	registration_open_date_time = ndb.DateTimeProperty()

	# Registration must close before tournament start
	registration_close_date_time = ndb.DateTimeProperty()

	# For n-elimination
	elimination_number = ndb.IntegerProperty()

	matches = ndb.StringProperty(repeated=True)
	num_matches = ndb.ComputedProperty(lambda self: len(self.matches))

class Team(ndb.Model):
	# Unique globally
	name = ndb.StringProperty(required=True)

	# Team creater should always be a member
	members = ndb.StringProperty(repeated=True)

	# Can be tournaments or seasons
	events = ndb.StringProperty(repeated=True)

	# Member who have not yet accepted or declined
	invited_members = ndb.StringProperty(repeated=True)

class Match(ndb.Model):
	'''
		A match is the basic object of competition and is comprised of games.
	'''

	# Only 2 teams can compete in a match
	team1 = ndb.StringProperty(required=True)
	team2 = ndb.StringProperty(required=True)
	
	winner = ndb.StringProperty()
	loser = ndb.StringProperty()

	# The games that make up the match
	games = ndb.StringProperty(repeated=True)

	num_games = ndb.IntegerProperty(default=3)
	games_played = ndb.IntegerProperty(default=0)

	# A match can only lie in a single event (tournament or season)
	event = ndb.StringProperty(required=True)

class Game(ndb.Model):
	team1_score = ndb.IntegerProperty(default=0)
	team2_score = ndb.IntegerProperty(default=0)

	winner = ndb.StringProperty()
	loser = ndb.StringProperty()

	
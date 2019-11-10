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
	owner = ndb.StringProperty(required=True)

	# Unique under creator
	name = ndb.StringProperty(required=True)

	# Can be anything except empty string
	game_type = ndb.StringProperty(required=True)

	# Must be one of the predefined structures
	tournament_structure = ndb.StringProperty(required=True)

	# If the user doesn't set this, it should be generated
	start_date_time = ndb.DateTimeProperty(required=True)
	
	# Useful for sorting
	created_date = ndb.DateTimeProperty()
	last_modified = ndb.DateTimeProperty(auto_now_add=True)

	# Starts empty
	teams = ndb.StringProperty(repeated=True)

	description = ndb.TextProperty()

	# Tournaments can go for unlimited time
	end_date_time = ndb.DateTimeProperty()

	# Tournament can open registration at creation if not specified
	# Must be before registration close
	registration_open_date_time = ndb.DateTimeProperty()

	# Registration must close before tournament start
	registration_close_date_time = ndb.DateTimeProperty()

	# For n-elimination
	elimination_number = ndb.IntegerProperty()

class Team(ndb.Model):
	# Unique globally
	name = ndb.StringProperty(required=True)

	# Team creater should always be a member
	members = ndb.StringProperty(repeated=True)

	# Can be tournaments or seasons
	events = ndb.StringProperty(repeated=True)

	# Member who have not yet accepted or declined
	invited_members = ndb.StringProperty(repeated=True)
	
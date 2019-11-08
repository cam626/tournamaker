from google.appengine.ext import ndb

class User(ndb.Model):
	display_name = ndb.StringProperty(required=True, default="")
	email = ndb.StringProperty(required=True)
	last_modified = ndb.DateTimeProperty(auto_now_add=True)

	tournaments = ndb.StringProperty(repeated=True)
	team_invites = ndb.StringProperty(repeated=True)
	teams = ndb.StringProperty(repeated=True)

class Tournament(ndb.Model):
	name = ndb.StringProperty(required=True)
	game_type = ndb.StringProperty(required=True)
	tournament_structure = ndb.StringProperty(required=True)

	created_date = ndb.DateTimeProperty()
	last_modified = ndb.DateTimeProperty(auto_now_add=True)

	teams = ndb.StringProperty(repeated=True)
	description = ndb.TextProperty()
	elimination_number = ndb.IntegerProperty()
	start_date_time = ndb.DateTimeProperty()
	end_date_time = ndb.DateTimeProperty()
	registration_open_date_time = ndb.DateTimeProperty()
	registration_close_date_time = ndb.DateTimeProperty()

class Team(ndb.Model):
	name = ndb.StringProperty(required=True)
	members = ndb.StringProperty(repeated=True)
	events = ndb.StringProperty(repeated=True)

	invited_members = ndb.StringProperty(repeated=True)
	
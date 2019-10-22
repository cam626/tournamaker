from google.appengine.ext import ndb

class User(ndb.Model):
	display_name = ndb.StringProperty(required=True, default="")
	email = ndb.StringProperty(required=True)
	join_date = ndb.DateProperty(auto_now_add=True)

class Tournament(ndb.Model):
	name = ndb.StringProperty(required=True)
	game_type = ndb.StringProperty(required=True)
	tournament_structure = ndb.StringProperty(required=True)
	# start_date = ndb.DateProperty(required=True)

	created_date = ndb.DateProperty(auto_now_add=True)

	elimination_number = ndb.IntegerProperty()
	start_date_time = ndb.DateTimeProperty()
	end_date_time = ndb.DateTimeProperty()
	registration_open_date_time = ndb.DateTimeProperty()
	registration_close_date_time = ndb.DateTimeProperty()
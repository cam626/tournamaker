from google.appengine.ext import ndb

class UserModel(ndb.Model):
	name = ndb.StringProperty(required=True)
	email = ndb.StringProperty(required=True)
	join_date = ndb.DateProperty(auto_now_add=True)
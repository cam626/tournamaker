
from lib.auth_lib import authenticate_token
from lib import league_lib

from flask import jsonify, request
import logging as logger

def league_endpoints(app):
	@app.route('/league', methods=['POST'])
	def create_league():
		'''
			This endpoint is meant to create a league and attach the league to the
			user that created it.

			The header of this request must contain the 'X-Authorization' header.

			The body of this request must be formatted as:

			{
				"name": "Name of the new league",
				"game_type": "Type of game being played",
				"
			}
		'''
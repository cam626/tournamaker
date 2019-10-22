
from lib.auth_lib import authenticate_token
from lib import tournament_lib

from flask import jsonify, request
import logging as logger

def tournament_endpoints(app):
	@app.route('/tournament', methods=['POST'])
	def create_tournament():
		'''
			This endpoint is meant for creating a tournament entity in the datastore.

			This data entity represents a single tournament. The tournament can be a 
			separate entity or it can be part of a league. If a tournament is in a league, 
			the user must register for the league before signing up for the tournament. 
			A tournament belongs to the user that created it and can be public or private. 
			Public tournaments can be searched, but private tournaments can only be signed 
			up for by invite link or by inputting the ID of the tournament.

			Required fields
			name: Any non-empty string that does not have leading or trailing whitespace.

			game_type: Any non-empty string. If this value falls in a set of predefined values, 
			frontend will give the option to prefill all other fields accordingly.

			tournament_structure: This may only fall in a predefined set of values and will 
			indicate how the tournament is arranged. Example values are round_robin, swiss, 
			n_elimination, etc. Based on the option chosen here, other fields must also be defined. 
			For example, if n_elimination is chosen, the elimination_number field must also be provided.

			start_date: The date that the tournament is set to begin. Single day tournaments will just set this to be the date that the tournament is being held on.
			
			Autofilled Fields:
			created_date

			Optional fields
			elimination_number
			start_time
			end_time
			end_date
			registration_open_date
			registration_close_date
		'''
		# Get the user credentials that correspond to the token
		user_cred = authenticate_token(request)

		# Reject the request if the token was invalid
		if user_cred == None:
			return "Unauthorized", 401

		# Create a tournament from the request body
		json_body = request.get_json()
		tournament_key = tournament_lib.create_tournament(user_cred, **json_body)

		return jsonify({"tournament_key": tournament_key.urlsafe()})

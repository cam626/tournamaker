class Error():
	error = ""
	status = 0
	def to_dict():
		return {
			"error": self.error,
			"status": self.status
		}

class UnauthorizedResponse(Error):
	error = "You are unauthorized to access this endpoint"
	status = 401
import flask_cors

from flask import Flask, jsonify, request
import google.auth.transport.requests
import requests_toolbelt.adapters.appengine


app = Flask(__name__)

flask_cors.CORS(app)

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

@app.route('/', methods=['GET'])
def test():
	return "Test"

if __name__ == "__main__":
	app.run(debug=True, host='127.0.0.1', port=int(os.environ.get('PORT', 8081)))
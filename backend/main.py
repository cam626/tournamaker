import flask_cors

from flask import Flask
import requests_toolbelt.adapters.appengine

from service.user_handler import user_endpoints
from service.general_handler import general_endpoints

app = Flask(__name__)

flask_cors.CORS(app)
requests_toolbelt.adapters.appengine.monkeypatch()

user_endpoints(app)
general_endpoints(app)

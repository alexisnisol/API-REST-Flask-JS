import os.path
def mkpath(p):
    return os.path.normpath(
        os.path.join(os.path.dirname(__file__), p))

from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = ('sqlite:///' + mkpath('../myapp.db'))
db = SQLAlchemy(app)
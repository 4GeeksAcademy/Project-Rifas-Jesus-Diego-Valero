"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.payments import payments_bp
from api.admin import setup_admin
from api.commands import setup_commands
from api.extensions import mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import stripe

# from models import Person
load_dotenv()
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')

# static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# ✅ Habilitar CORS para todas las rutas y orígenes
CORS(app)

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Email configuration
app.config['MAIL_SENDER'] = os.getenv("MAIL_SENDER") #hola4boleeks@outlook.com
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER") #"smtp.gmail.com"
app.config['MAIL_PORT'] = os.getenv("MAIL_PORT") # 587
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME") #"info4boleeks@gmail.com"
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS") #True
app.config['MAIL_USE_SSL'] = os.getenv("MAIL_USE_SSL ") #False
mail.init_app(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")  # ¡Cambia esta clave en producción!
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the commands
setup_commands(app)

# Add all endpoints from the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Add payments endpoints from the Payments API
app.register_blueprint(payments_bp, url_prefix='/api/payments')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    print("Requested path:", path)
    print(static_file_dir)
    print(os.path.join(static_file_dir, path))
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

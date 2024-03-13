from flask import Flask, jsonify, Response
import requests

from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from itsdangerous.url_safe import URLSafeTimedSerializer as Serializer
from sqlalchemy.pool import NullPool
import oracledb
from models import db

app = Flask(__name__)
# CORS(app, resources={r"*": {"origins": "https://aida_gomezbueno.storage.googleapis.com"}})
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})
# bcrypt = Bcrypt(app)
# db = SQLAlchemy(app)

# Database configuration
un = 'MYAIDA'
pw = 'AaZZ0r_cle#1'

# dsn = '(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g2525a9be826d67_capstone_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
# host = 'adb.eu-madrid-1.oraclecloud.com'
# service_name = 'g2525a9be826d67_capstone_high.adb.oraclecloud.com'
# port = '1522'

dsn = '(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g2525a9be826d67_capstone_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

pool = oracledb.create_pool(user=un, password=pw,
                            dsn=dsn)
app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+oracledb://{un}:{pw}@{dsn}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True  # cambiar en prod

db = SQLAlchemy()
# print(app.config)
db.init_app(app)

with app.app_context():
    db.create_all()

ALPHA_VANTAGE_API_KEY = 'E8LCWIHQ1EEYAU63'
STOCK_DATA_URL = 'https://www.alphavantage.co/query'

@app.route('/api/all-stocks')
def get_all_stocks():
    # Fetches a list of all stocks with their current listing status from Alpha Vantage API
    url = f"{STOCK_DATA_URL}?function=LISTING_STATUS&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        # Stream the response to handle large datasets efficiently
        def generate():
            with requests.get(url, stream=True) as r:
                r.raise_for_status()  # Will raise HTTPError for bad responses
                lines = r.iter_lines()
                for _ in range(1000):  # Limit to the first 1000 lines for demonstration
                    try:
                        yield next(lines) + b'\n'
                    except StopIteration:
                        break
        return Response(generate(), content_type='text/csv')
    except requests.exceptions.HTTPError as errh:
        # Handle specific exceptions separately for detailed error logging
        return jsonify(error=str(errh)), errh.response.status_code
    except requests.exceptions.ConnectionError as errc:
        return jsonify(error=str(errc)), 503
    except requests.exceptions.Timeout as errt:
        return jsonify(error=str(errt)), 504
    except requests.exceptions.RequestException as err:
        return jsonify(error=str(err)), 500

@app.route('/api/stock/<symbol>')
def get_stock_data(symbol):
    # Fetches weekly time series data for a specific stock symbol from Alpha Vantage API
    url = f"{STOCK_DATA_URL}?function=TIME_SERIES_WEEKLY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return jsonify(response.json())
    except requests.exceptions.HTTPError as errh:
        return jsonify(error=str(errh)), errh.response.status_code
    except requests.exceptions.ConnectionError as errc:
        return jsonify(error=str(errc)), 503
    except requests.exceptions.Timeout as errt:
        return jsonify(error=str(errt)), 504
    except requests.exceptions.RequestException as err:
        return jsonify(error=str(err)), 500

@app.route('/api/quote/<symbol>')
def get_latest_quote(symbol):
    # Fetches the latest stock quote for a specific symbol from Alpha Vantage API
    url = f"{STOCK_DATA_URL}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as errh:
        return jsonify(error=str(errh)), errh.response.status_code
    except requests.exceptions.ConnectionError as errc:
        return jsonify(error=str(errc)), 503
    except requests.exceptions.Timeout as errt:
        return jsonify(error=str(errt)), 504
    except requests.exceptions.RequestException as err:
        return jsonify(error=str(err)), 500
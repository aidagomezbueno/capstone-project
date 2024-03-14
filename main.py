from flask import Flask, jsonify, Response, request
import requests
from flask_bcrypt import check_password_hash, generate_password_hash
# from flask_bcrypt import Bcrypt
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
from itsdangerous.url_safe import URLSafeTimedSerializer as Serializer
from sqlalchemy.pool import NullPool
import oracledb
import csv
from io import StringIO
from models import db, User, Stock

app = Flask(__name__)
# CORS(app, resources={r"*": {"origins": "https://aida_gomezbueno.storage.googleapis.com"}})
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

un = 'MYAIDA'
pw = 'AaZZ0r_cle#1'
dsn = '(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-madrid-1.oraclecloud.com))(connect_data=(service_name=g2525a9be826d67_capstone_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'

pool = oracledb.create_pool(user=un, password=pw,
                            dsn=dsn)
app.config['SQLALCHEMY_DATABASE_URI'] = f'oracle+oracledb://{un}:{pw}@{dsn}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': pool.acquire,
    'poolclass': NullPool
}
app.config['SQLALCHEMY_ECHO'] = True 
db.init_app(app)

with app.app_context():
    db.create_all()

ALPHA_VANTAGE_API_KEY = 'E8LCWIHQ1EEYAU63'
STOCK_DATA_URL = 'https://www.alphavantage.co/query'

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(name=username).first()
        print(user)

        if user and user.check_password(password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        app.logger.error(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred'}), 500

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data.get('name')
        password = data.get('password')

        existing_user = User.query.filter_by(name=username).first()
        if existing_user:
            return jsonify({'message': 'User already exists'}), 409

        new_user = User(name=username)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        app.logger.error(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred'}), 500

# @app.route('/api/all-stocks')
# def get_all_stocks():
#     # Fetches a list of all stocks with their current listing status from Alpha Vantage API
#     url = f"{STOCK_DATA_URL}?function=LISTING_STATUS&apikey={ALPHA_VANTAGE_API_KEY}"
#     try:
#         # Stream the response to handle large datasets efficiently
#         def generate():
#             with requests.get(url, stream=True) as r:
#                 r.raise_for_status()  # Will raise HTTPError for bad responses
#                 lines = r.iter_lines()
#                 for _ in range(1000):  # Limit to the first 1000 lines for demonstration
#                     try:
#                         yield next(lines) + b'\n'
#                     except StopIteration:
#                         break
#         return Response(generate(), content_type='text/csv')
#     except requests.exceptions.HTTPError as errh:
#         # Handle specific exceptions separately for detailed error logging
#         return jsonify(error=str(errh)), errh.response.status_code
#     except requests.exceptions.ConnectionError as errc:
#         return jsonify(error=str(errc)), 503
#     except requests.exceptions.Timeout as errt:
#         return jsonify(error=str(errt)), 504
#     except requests.exceptions.RequestException as err:
#         return jsonify(error=str(err)), 500

@app.route('/api/all-stocks')
def get_all_stocks():
    # url = f"{STOCK_DATA_URL}?function=LISTING_STATUS&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        # response = requests.get(url)
        # response.raise_for_status()
        
        # # Parse CSV data
        # csv_data = StringIO(response.text)
        # csv_reader = csv.reader(csv_data, delimiter=',')
        
        # # Skip the header
        # next(csv_reader)
        
        # row_count = 0
        
        # for row in csv_reader:
        #     if row_count >= 1000:  # Stop after 1000 symbols
        #         break
        #     symbol, name = row[0], row[1].strip()
            
        #     if not name:
        #         name = symbol

        #     stock = Stock.query.filter_by(symbol=symbol).first()
        #     if not stock:
        #         # If not, add it to the database
        #         new_stock = Stock(symbol=symbol, name=name)
        #         db.session.add(new_stock)
        #     row_count += 1
        # db.session.commit()

        # Fetch all stocks from the database to serve to the frontend
        stocks = Stock.query.all()
        stocks_data = [{'symbol': stock.symbol, 'name': stock.name} for stock in stocks]

        return jsonify(stocks_data)
    except requests.exceptions.HTTPError as errh:
        return jsonify(error=str(errh)), 500
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
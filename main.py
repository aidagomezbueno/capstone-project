from flask import Flask, jsonify, Response, request
import requests
from flask_cors import CORS
from itsdangerous.url_safe import URLSafeTimedSerializer as Serializer
from sqlalchemy.pool import NullPool
import oracledb
import csv
from io import StringIO
from datetime import date
from models import db, Stock, Portfolio, PortfolioStock, User
from flask import session
import secrets

import logging
from logging.handlers import RotatingFileHandler


app = Flask(__name__)
# CORS(app, resources={r"*": {"origins": "https://aida_gomezbueno.storage.googleapis.com"}})
# CORS(app, supports_credentials=True, resources={r"*": {"origins": "https://aida_gomezbueno.storage.googleapis.com"}})
CORS(app, supports_credentials=True, resources={r"*": {"origins": "http://localhost:3000"}})

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

app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

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
            session.permanent = True
            session['user_id'] = user.user_id
            app.logger.info("User ID", session['user_id'])
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
        #     if row_count >= 500:  # Stop after 1000 symbols
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

@app.route('/api/quote/<symbol>')
def fetch_latest_quote_price(symbol):
    # Fetches the latest stock quote for a specific symbol from Alpha Vantage API
    url = f"{STOCK_DATA_URL}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        # Parse the price from the response
        last_price = float(response.json()["Global Quote"]["05. price"])
        return last_price
    except Exception as e:
        # Handle exceptions and return a meaningful error message
        return jsonify({'message': str(e)}), 500

@app.route('/api/portfolio/add', methods=['POST'])
def add_to_portfolio():
    data = request.json
    symbol = data.get('symbol')
    added_quantity = data.get('quantity')
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'message': 'User is not logged in.'}), 401

    latest_price = fetch_latest_quote_price(symbol)

    if isinstance(latest_price, (int, float)):
        stock = Stock.query.filter_by(symbol=symbol).first()
        if not stock:
            return jsonify({'message': 'Stock not found'}), 404

        portfolio = Portfolio.query.filter_by(user_id=user_id).first()
        if not portfolio:
            portfolio = Portfolio(user_id=user_id)
            db.session.add(portfolio)
            db.session.commit()

        # Check if the stock is already in the portfolio
        portfolio_stock = PortfolioStock.query.filter_by(
            portfolio_id=portfolio.portfolio_id,
            stock_id=stock.stock_id
        ).first()

        if portfolio_stock:
            # If it exists, update the quantity
            portfolio_stock.quantity += added_quantity
        else:
            # If not, create a new PortfolioStock entry
            portfolio_stock = PortfolioStock(
                portfolio_id=portfolio.portfolio_id,
                stock_id=stock.stock_id,
                quantity=added_quantity,
                acquisition_price=latest_price,
                acquisition_date=date.today()
            )
            db.session.add(portfolio_stock)

        db.session.commit()

        # You may return the updated quantity in the response if you wish
        return jsonify({
            'message': 'Stock quantity updated in portfolio',
            'updated_quantity': portfolio_stock.quantity
        }), 200

    else:
        return jsonify({'message': 'Failed to fetch the latest stock price'}), 500

@app.route('/api/user/portfolio', methods=['GET'])
def get_user_portfolio():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401
    
    user_portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    if not user_portfolio:
        return jsonify({'message': 'Portfolio not found'}), 404

    portfolio_stocks = PortfolioStock.query.filter_by(portfolio_id=user_portfolio.portfolio_id).all()
    
    portfolio_data = []
    for portfolio_stock in portfolio_stocks:
        stock = Stock.query.filter_by(stock_id=portfolio_stock.stock_id).first()
        if stock:
            portfolio_data.append({
                'symbol': stock.symbol,
                'name': stock.name,
                'quantity': portfolio_stock.quantity,
                'acquisition_price': portfolio_stock.acquisition_price
            })

    return jsonify(portfolio_data)


@app.route('/api/portfolio/remove', methods=['POST'])
def remove_from_portfolio():
    data = request.json
    symbol = data.get('symbol')
    user_id = session.get('user_id')
    # app.logger.info("User ID", user_id)

    if not user_id:
        return jsonify({'message': 'User is not logged in.'}), 401

    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    if not portfolio:
        return jsonify({'message': 'Portfolio not found'}), 404

    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        return jsonify({'message': 'Stock not found'}), 404

    portfolio_stock = PortfolioStock.query.filter_by(
        portfolio_id=portfolio.portfolio_id,
        stock_id=stock.stock_id
    ).first()

    if not portfolio_stock:
        return jsonify({'message': 'Stock not in portfolio'}), 404

    if portfolio_stock.quantity > 0:
        portfolio_stock.quantity -= 1
        message = 'Stock quantity decreased in portfolio'
    else:
        db.session.delete(portfolio_stock)
        message = 'Stock removed from portfolio'
        
    if portfolio_stock.quantity == 0:
        db.session.delete(portfolio_stock)
        message = 'Stock removed from portfolio'

    db.session.commit()

    return jsonify({
        'message': message,
        'updated_quantity': portfolio_stock.quantity if portfolio_stock.quantity > 0 else 0
    }), 200
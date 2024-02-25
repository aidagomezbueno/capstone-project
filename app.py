# Import necessary modules from Flask, Flask-CORS for handling cross-origin requests, and requests for making HTTP requests.
from flask import Flask, jsonify, Response
from flask_cors import CORS
import requests

# Initialize a Flask application. __name__ is a special variable that Flask uses to determine the root path of the app.
app = Flask(__name__)
# Apply CORS settings to the Flask app, allowing requests from the specified origin (in this case, a React app running on localhost:3000).
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Define the API key and the base URL for the Alpha Vantage API to fetch stock data.
ALPHA_VANTAGE_API_KEY = 'E8LCWIHQ1EEYAU63'
STOCK_DATA_URL = 'https://www.alphavantage.co/query'

# Define a route for fetching weekly time series stock data. <symbol> is a variable part of the URL.
@app.route('/api/stock/<symbol>')
def get_stock_data(symbol):
    # Construct the request URL using the stock symbol and API key.
    url = f"{STOCK_DATA_URL}?function=TIME_SERIES_WEEKLY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        # Make an HTTP GET request to the Alpha Vantage API.
        response = requests.get(url)
        # Raise an exception for HTTP error codes (4xx, 5xx).
        response.raise_for_status()
        # Return the JSON response from the API.
        return jsonify(response.json())
    # Catch and handle various requests exceptions.
    except requests.exceptions.HTTPError as errh:
        print("Http Error:", errh)
        return jsonify(error=str(errh)), errh.response.status_code
    except requests.exceptions.ConnectionError as errc:
        print("Error Connecting:", errc)
        return jsonify(error=str(errc)), 503
    except requests.exceptions.Timeout as errt:
        print("Timeout Error:", errt)
        return jsonify(error=str(errt)), 504
    except requests.exceptions.RequestException as err:
        print("Oops: Something Else", err)
        return jsonify(error=str(err)), 500
    
# Define a route for fetching the latest stock quote.
@app.route('/api/quote/<symbol>')
def get_latest_quote(symbol):
    # Construct the request URL for the global quote function.
    url = f"{STOCK_DATA_URL}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        # Similar to the get_stock_data function, make a GET request and return the JSON response.
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
    # Handle exceptions in the same manner as the get_stock_data function.
    except requests.exceptions.HTTPError as errh:
        print ("Http Error:",errh)
        return jsonify(error=str(errh)), errh.response.status_code
    except requests.exceptions.ConnectionError as errc:
        print ("Error Connecting:",errc)
        return jsonify(error=str(errc)), 503
    except requests.exceptions.Timeout as errt:
        print ("Timeout Error:",errt)
        return jsonify(error=str(errt)), 504
    except requests.exceptions.RequestException as err:
        print ("Oops: Something Else",err)
        return jsonify(error=str(err)), 500

# Check if the script is the main program and if so, run the Flask app in debug mode.
if __name__ == '__main__':
    app.run(debug=True)
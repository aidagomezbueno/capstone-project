from flask import Flask, jsonify, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

ALPHA_VANTAGE_API_KEY = 'E8LCWIHQ1EEYAU63'
STOCK_DATA_URL = 'https://www.alphavantage.co/query'

@app.route('/api/stock/<symbol>')
def get_stock_data(symbol):
    url = f"{STOCK_DATA_URL}?function=TIME_SERIES_WEEKLY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
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
    
@app.route('/api/quote/<symbol>')
def get_latest_quote(symbol):
    url = f"{STOCK_DATA_URL}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
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

if __name__ == '__main__':
    app.run(debug=True)
# Stock Visualization Tool

This is a web application that allows users to interact with stock market data, invest in stocks, and analyze their portfolio's total value, including historical and current stock information. The application is built with a Flask backend and a React frontend.

## Live Application

The application is live and can be accessed at the following URL: [WealthWise](https://aida_gomezbueno.storage.googleapis.com/index.html).

To start exploring the app:

1. Visit the URL.
2. Click the "Home" button to see the list of current available stocks.
3. Select the number of stocks you want to invest in for each symbol.
4. Access the portfolio to see your list of symbols, the number of stocks for each one, and the total value of your portfolio.
5. You have the option to analyze each symbol and visualize historical and current information available.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **API**: Alpha Vantage for real-time and historical stock data

## Project Structure

The project's main components are:

- **Flask Backend (`main.py`)**: Handles API requests to fetch stock data and quotes via the Alpha Vantage API.
- **React Frontend (`App.js`, `StockList.js` and `StockDetails.js`)**: Renders the application's UI and manages interactions with the backend.

## Features

- Real-time stock market data visualization
- Portfolio management
- Historical data charts for individual stocks
- Responsive design for desktop and mobile users

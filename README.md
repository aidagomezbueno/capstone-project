# Stock Visualization Tool

This web application, WealthWise, provides a comprehensive platform for users to interact with stock market data. It enables users to invest in stocks and analyze their portfolio's performance with historical insights and real-time stock information. The tool integrates a Flask backend with a React frontend for a seamless user experience.

---

## Live Application

Access WealthWise live at: [WealthWise](https://aida_gomezbueno.storage.googleapis.com/index.html).

### Getting Started:

To begin using WealthWise, follow these steps:

1. **Login/Signup**: Access the application at [WealthWise](https://aida_gomezbueno.storage.googleapis.com/index.html). If you're a new user, sign up for an account. Otherwise, log in with your credentials.
2. **Explore Stocks**: Once logged in, you'll be redirected to the "Home" page to view the list of available stocks and start exploring your options.
3. **Invest**: Choose the stocks you're interested in and specify the amount you want to invest to add them to your portfolio.
4. **Manage Portfolio**: Access the "My Portfolio" section to review your investments, see detailed information for each symbol, and track the total value of your holdings.
5. **Stock Analysis**: Click on any stock symbol to view detailed historical data and the latest stock quote for informed decision-making.
6. **Portfolio Adjustment**: Within your portfolio, you have the flexibility to remove stocks one by one, adjusting your investment as you see fit.
7. **Log Out and Switch Accounts**: Securely log out when you've finished your session.

Remember, WealthWise is designed to be intuitive and user-friendly, guiding you through the journey of stock market investing with ease and clarity.


## Technologies

- **Frontend**: Crafted with React.js, providing a dynamic and responsive user interface.
- **Backend**: Flask (Python) serves the backend, handling API requests and server-side logic.
- **Data**: Alpha Vantage API is used for fetching real-time and historical stock data.

## Project Structure Overview

The application is structured into main components for efficient navigation and modification:

- **Backend (`main.py`)**: Flask-based backend orchestrating API interactions and database transactions.
- **Frontend Components**: 
  - **`App.js`**: The core React component that encapsulates the entire application logic and routing.
  - **`StockList.js`**: Manages the display of available stocks and allows users to add them to their portfolio, as well as showing the user's portfolio list of stocks.
  - **`StockDetails.js`**: Provides a detailed view of each stock, including historical data visualization.
  - **`Login.js`**: Facilitates user authentication, allowing users to log in and sign up for the application.

## Key Features

- **Stock Data Visualization**: See real-time changes and historical trends.
- **Portfolio Management**: Easy addition and removal of stocks from your portfolio.
- **Responsive Design**: Full compatibility with desktop and mobile devices.

## Detailed Feature Walkthrough

- **User Authentication (`Login.js`)**:
  - Secure login and signup functionality.
  - Session management with cookies and server-side validation.

- **Data Handling (`main.py`)**:
  - Interaction with Alpha Vantage API for stock data.
  - Secure handling of user credentials and portfolio data using SQLAlchemy with an Oracle database backend.

- **React Components**:
  - `StockList.js`: Lets users interact with their current stocks and potential investments.
  - `StockDetails.js`: Displays intricate charts of stock performance over time.
  - `Login.js`: Entry point for authentication, providing a clean user interface for signing in and registering.

## Security Practices

- **Environment Variables**: Sensitive information like database credentials and API keys are securely stored in environment variables, not included in the codebase.
- **Database Encryption**: Passwords are hashed using robust algorithms before storage.
- **Session Management**: Sessions are securely handled to prevent unauthorized access to user data.

## Setup and Installation

Detailed steps for setting up the application locally:

1. Clone the repository.
2. Install dependencies using `npm install` for the frontend and `pip install -r requirements.txt` for the backend.
3. Set up environment variables for database connections and third-party APIs.
4. Run the Flask server and React development server.

## Contributing

Contributions to WealthWise are welcome. Please follow the established patterns, write tests for new functionalities, and document your changes thoroughly.
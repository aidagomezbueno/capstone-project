# Stock Visualization Tool

This project is designed to visualize stock data using a Flask backend and a React frontend.

## Project Structure

The project consists of three main files:
- `app.py`: This is the Flask server (backend) of the application. It handles requests to fetch stock data and quotes via the Alpha Vantage API.
- `App.js`: Located in the `client` folder, this is the main React component (frontend) that renders the application's UI and orchestrates the components.
- `StockDetails.js`: Also located in the `client` folder, this React component is responsible for displaying detailed stock information.

## Running the Application

To run the application, you need to start both the backend server and the frontend development server.

### Backend

1. Navigate to the main directory of the project where the `app.py` file is located.
2. Run the Flask server with the following command:

```bash
flask run
```

This will start the backend server, which listens for requests to fetch stock data.

### Frontend

1. Navigate to the `client` directory within the project:

```bash
cd client
```

2. Inside the `client` directory, install the necessary npm packages (only needed the first time):

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

This will run the frontend part of the application. By default, it will open in your web browser at `http://localhost:3000`.

## Usage

After both servers are running, you can use the application to visualize stock data. The Flask backend will serve API requests from the React frontend, which displays the data in a user-friendly format.

Make sure both the backend and the frontend are running simultaneously for the application to work correctly.
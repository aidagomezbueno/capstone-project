import React, { useState, useEffect } from "react"; // React core features
import axios from "axios"; // For making HTTP requests
import { Routes, Route, Link, useParams } from "react-router-dom"; // React Router components for routing
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material"; // Material-UI components for UI elements
import StockList from "./components/StockList"; // Custom component for displaying a list of stocks
import StockDetails from "./components/StockDetails"; // Custom component for displaying stock details
import parseCSV from "./utils/parseCSV"; // Utility function for parsing CSV data

const App = () => {

  const [allStocks, setAllStocks] = useState([]); // Stores the list of all stock data
  const [portfolioSymbols, setPortfolioSymbols] = useState([]); // Stores the symbols of stocks added to the portfolio

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("/api/all-stocks");
        const parsedData = parseCSV(response.data);
        setAllStocks(parsedData.slice(0, 1000)); 
        // setAllStocks(parsedData);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []); // Empty dependency array - this runs once on mount

  useEffect(() => {
    console.log("Current portfolioSymbols:", portfolioSymbols);
  }, [portfolioSymbols]); // Runs only when portfolioSymbols changes

  // Function to add a stock symbol to the portfolio if it's not already included
  const handleAddToPortfolio = (symbol) => {
    if (!portfolioSymbols.includes(symbol)) {
      setPortfolioSymbols([...portfolioSymbols, symbol]);
    }
  };

  // Component for rendering stock details, utilizing useParams to access the symbol from the URL
  // const StockPage = () => {
  //   let { symbol } = useParams(); // Extracts the symbol parameter from the URL
  //   return <StockDetails symbol={symbol} />; // Renders the StockDetails component with the symbol
  // };

  // Computes the list of stock objects in the portfolio by mapping over portfolioSymbols and finding each in allStocks
  const portfolioStocks = portfolioSymbols
    .map((symbol) => allStocks.find((stock) => stock.symbol === symbol))
    .filter((stock) => stock); // Filters out any undefined entries

  // JSX for rendering the app UI
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h4" style={{ color: "white" }}>
            WealthWise
          </Typography>
          <div>
            <Button
              color="inherit"
              component={Link}
              to="/"
              style={{ color: "white" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/portfolio"
              style={{ color: "white" }}
            >
              My Portfolio
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <StockList
                stocks={allStocks}
                onAddToPortfolio={handleAddToPortfolio}
                isPortfolioView = {false}
              />
            }
          />
          <Route
            path="/portfolio"
            element={
              <StockList
                stocks={portfolioStocks}
                onAddToPortfolio={handleAddToPortfolio}
                isPortfolioView = {true}
              />
            }
          />
          <Route path="/stock/:symbol" element={<StockDetails />} />
        </Routes>
      </Container>
    </>
  );
};

export default App; 

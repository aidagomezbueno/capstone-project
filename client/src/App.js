import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import StockList from "./components/StockList";
import StockDetails from "./components/StockDetails";
import Login from "./components/Login";
import { useAuth } from "./AuthContext";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import "./App.css";

// Main application component managing routes, stocks data, and portfolio functionality
const App = () => {
  const [allStocks, setAllStocks] = useState([]); // Holds all stock data
  const [portfolioSymbols, setPortfolioSymbols] = useState([]); // Tracks user's portfolio stocks
  const { isAuthenticated, logout: contextLogout } = useAuth();

  // Fetches all stocks data on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(`/api/all-stocks`);
        // const response = await axios.get(
        //   `https://aida-mcsbt-integration.lm.r.appspot.com/api/all-stocks`
        // );
        setAllStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };
    fetchStocks();
  }, []);

  // Logs current portfolio state on change
  useEffect(() => {
    console.log("Current portfolioSymbols:", portfolioSymbols);
  }, [portfolioSymbols]);

  // Handles adding or updating stocks in the portfolio
  const handleAddToPortfolio = async (symbol, newAmount) => {
    try {
      const response = await axios.get(`/api/quote/${symbol}`);
      // const response = await axios.get(
      //   `https://aida-mcsbt-integration.lm.r.appspot.com/api/quote/${symbol}`
      // );
      const lastPrice = parseFloat(response.data["Global Quote"]["05. price"]);
      console.log(`Last Price for ${symbol}:`, lastPrice);

      if (!isNaN(lastPrice)) {
        setPortfolioSymbols((currentSymbols) => {
          const existingSymbol = currentSymbols.find(
            (s) => s.symbol === symbol
          );
          if (existingSymbol) {
            return currentSymbols.map((s) =>
              s.symbol === symbol
                ? { ...s, amount: s.amount + newAmount, lastPrice }
                : s
            );
          } else {
            return [
              ...currentSymbols,
              { symbol, amount: newAmount, lastPrice },
            ];
          }
        });
      } else {
        console.error("Fetched last price is not a number.", response.data);
      }
    } catch (error) {
      console.error("Error fetching the latest price:", error);
    }
  };

  // Maps portfolio symbols to their corresponding stock details
  const portfolioStocks = portfolioSymbols.map((portfolioItem) => {
    const stock = allStocks.find((s) => s.symbol === portfolioItem.symbol);
    return {
      ...stock,
      amount: portfolioItem.amount,
      lastPrice: portfolioItem.lastPrice,
    };
  });

  const handleLogout = () => {
    contextLogout();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a19aa0",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#ebe1e9",
          },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" style={{ backgroundColor: "#a19aa0" }}>
          <Toolbar style={{ justifyContent: "space-between" }}>
            <Typography variant="h4" style={{ color: "white" }}>
              WealthWise
            </Typography>
            <div>
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/home"
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
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    style={{ color: "white" }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  style={{ color: "white" }}
                >
                  Login
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container
          className="myApp"
          maxWidth="md"
          style={{ marginTop: "20px" }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <StockList
                  stocks={allStocks}
                  onAddToPortfolio={handleAddToPortfolio}
                  isPortfolioView={false}
                />
              }
            />
            <Route
              path="/portfolio"
              element={
                <StockList
                  stocks={portfolioStocks}
                  onAddToPortfolio={handleAddToPortfolio}
                  isPortfolioView={true}
                />
              }
            />
            <Route path="/stock/:symbol" element={<StockDetails />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;

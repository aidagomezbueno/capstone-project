import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Displays a list of stocks, allowing users to view stock details or add them to their portfolio
const StockList = ({ stocks, onAddToPortfolio, isPortfolioView }) => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState({}); // Tracks user inputs for investment amounts

  // Calculates the total value of all stocks in the portfolio
  const totalValue = stocks.reduce((total, stock) => {
    const amount = Number(stock.amount) || 0;
    const lastPrice = Number(stock.lastPrice) || 0;
    return total + amount * lastPrice;
  }, 0);

  // Updates the investment amount for a specific stock
  const handleInvestmentChange = (symbol, event) => {
    const value = event.target.value;
    setInvestments({ ...investments, [symbol]: value });
  };

  // This function is now updated to make an API call
  const handleAddToPortfolioClick = async (symbol) => {
    const investmentAmount = Number(investments[symbol]);
    if (investmentAmount > 0) {
      try {
        // Call the backend endpoint to add the stock to the portfolio
        const response = await axios.post(
          "/api/portfolio/add",
          {
            symbol: symbol,
            quantity: investmentAmount,
          },
          {
            withCredentials: true, // Make sure to send the credentials to maintain the session
          }
        );

        if (response.status === 200) {
          console.log("Stock added to portfolio", response.data);
        }
      } catch (error) {
        console.error("Error adding stock to portfolio:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      }
    } else {
      alert("Please enter a valid investment amount.");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {stocks.map((stock, index) => (
            // Use a combination of the stock symbol and the index to ensure uniqueness
            <TableRow key={stock.symbol + index}>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell align="right">
                {isPortfolioView ? (
                  <>
                    <Button onClick={() => navigate(`/stock/${stock.symbol}`)}>
                      See Details
                    </Button>
                    <span>{stock.amount.toFixed(0)} stock(s)</span>
                    <span style={{ marginLeft: "10px" }}>
                      ${stock.lastPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    <TextField
                      size="small"
                      label="Input number of stocks you want to buy"
                      type="number"
                      inputProps={{ step: "1" }}
                      value={investments[stock.symbol] || ""}
                      onChange={(event) =>
                        handleInvestmentChange(stock.symbol, event)
                      }
                      variant="standard"
                    />
                    <Button
                      onClick={() => handleAddToPortfolioClick(stock.symbol)}
                    >
                      Add to Portfolio
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {isPortfolioView && (
            <TableRow>
              <TableCell colSpan={2} align="left">
                <b>Total Value:</b>
              </TableCell>
              <TableCell align="right">
                <b>${totalValue.toFixed(2)}</b>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockList;

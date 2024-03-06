// frontend - StockList.js
import React, { useState } from "react"; // Make sure to import useState
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField, // Import TextField for the input field
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StockList = ({ stocks, onAddToPortfolio, isPortfolioView }) => {
  const navigate = useNavigate();

  // This state will hold the investment amounts for each stock
  const [investments, setInvestments] = useState({});

  // Handler for when the investment input changes
  const handleInvestmentChange = (symbol, event) => {
    const value = event.target.value;
    setInvestments({ ...investments, [symbol]: value });
  };

  // Handler for when the "Add to Portfolio" button is clicked
  const handleAddToPortfolioClick = (symbol) => {
    const investmentAmount = Number(investments[symbol]);
    if (investmentAmount > 0) {
      onAddToPortfolio(symbol, investmentAmount);
      // Reset the investment input for the symbol
      setInvestments((prev) => ({ ...prev, [symbol]: "" }));
    } else {
      alert("Please enter a valid investment amount.");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>
                {isPortfolioView ? (
                  <>
                    <span>${stock.amount.toFixed(2)} invested</span>{" "}
                    {/* Make sure amount is displayed as a fixed decimal */}
                    <Button onClick={() => navigate(`/stock/${stock.symbol}`)}>
                      See Details
                    </Button>
                  </>
                ) : (
                  <>
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ step: "0.01" }} // Allows for decimal values
                      value={investments[stock.symbol] || ""}
                      onChange={(event) =>
                        handleInvestmentChange(stock.symbol, event)
                      }
                      variant="outlined"
                      placeholder="Amount"
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockList;

import React, { useState, useEffect } from "react";
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

const StockList = ({ stocks, onAddToPortfolio, isPortfolioView }) => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState({});

  // Calculate total value for the portfolio view
  const totalValue = stocks.reduce((total, stock) => {
    const amount = Number(stock.amount) || 0;
    const lastPrice = Number(stock.lastPrice) || 0;
    return total + amount * lastPrice;
  }, 0);

  const handleInvestmentChange = (symbol, event) => {
    const value = event.target.value;
    setInvestments({ ...investments, [symbol]: value });
  };

  const handleAddToPortfolioClick = (symbol) => {
    const investmentAmount = Number(investments[symbol]);
    if (investmentAmount > 0) {
      onAddToPortfolio(symbol, investmentAmount);
      setInvestments((prevInvestments) => ({
        ...prevInvestments,
        [symbol]: "",
      }));
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

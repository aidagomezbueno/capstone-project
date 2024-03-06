// frontend - StockList.js
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StockList = ({ stocks, onAddToPortfolio, isPortfolioView }) => {
  const navigate = useNavigate();

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
                  <Button onClick={() => navigate(`/stock/${stock.symbol}`)}>
                    See Details
                  </Button>
                ) : (
                  <Button onClick={() => onAddToPortfolio(stock.symbol)}>
                    Add to Portfolio
                  </Button>
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

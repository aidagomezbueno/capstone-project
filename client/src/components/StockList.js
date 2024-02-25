import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StockList = ({ stocks, onAddToPortfolio, isPortfolioView }) => {
  const navigate = useNavigate();

  const handleSeeDetails = async (symbol) => {
    try {
      const response = await axios.get(`/api/stock/${symbol}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock details:", error);
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

// Import necessary modules from React, React Router DOM, Material UI, and the StockDetails component.
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import StockDetails from "./components/StockDetails"; 

// CSV string containing stock information.
const csvData = `
symbol,name,exchange,assetType,ipoDate,delistingDate,status
A,Agilent Technologies Inc,NYSE,Stock,1999-11-18,null,Active
BAC-P-M,Bank Of America Corp,NYSE,Stock,2019-06-18,null,Active
CCRN,Cross Country Healthcares Inc,NASDAQ,Stock,2001-10-25,null,Active
DFIS,Dimensional International Small Cap ETF,BATS,ETF,2022-03-24,null,Active
ELVN,Enliven Therapeutics Inc,NASDAQ,Stock,2020-03-12,null,Active
FEIG,FlexShares ESG & Climate Investment Grade Corporate Core Index Fund,NYSE ARCA,ETF,2021-09-21,null,Active
GFF,Griffon Corp,NYSE,Stock,1973-05-03,null,Active
HLP,Hongli Group Inc,NASDAQ,Stock,2023-03-29,null,Active
IDA,Idacorp Inc,NYSE,Stock,1986-10-17,null,Active
JMIA,Jumia Technologies Ag,NYSE,Stock,2019-04-12,null,Active
KNF,Knife River Corp,NYSE,Stock,2023-06-01,null,Active
LKQ,LKQ Corp,NASDAQ,Stock,2003-10-03,null,Active
MBWM,Mercantile Bank Corp,NASDAQ,Stock,1999-07-20,null,Active
NEXI,Neximmune Inc,NASDAQ,Stock,2021-02-12,null,Active
ONL,Orion Office REIT Inc,NYSE,Stock,2021-11-15,null,Active
PFBC,Preferred Bank,NASDAQ,Stock,1999-08-19,null,Active
QQQI,NEOS Nasdaq 100 High Income ETF,NASDAQ,ETF,2024-01-30,null,Active
RDFN,Redfin Corp,NASDAQ,Stock,2017-07-28,null,Active
SB,Safe Bulkers Inc,NYSE,Stock,2008-05-30,null,Active
TBC,AT&T Inc,NYSE,Stock,2018-08-08,null,Active
UNM,Unum Group,NYSE,Stock,1986-11-06,null,Active
VGFC,The Very Good Food Company Inc,NASDAQ,Stock,2020-07-31,null,Active
WEST,Westrock Coffee Company,NASDAQ,Stock,2022-08-26,null,Active
XM,Qualtrics International Inc - Class A,NASDAQ,Stock,2021-01-28,null,Active
YTEN,Yield10 Bioscience Inc,NASDAQ,Stock,2006-11-10,null,Active
Z,Zillow Group Inc - Class C,NASDAQ,Stock,2015-08-03,null,Active
`;

// Function to parse the CSV data string into a JavaScript array of objects for easier manipulation.
const parseCSV = (data) => {
  const lines = data.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  });
};

// Parse the csvData to create a structured array of stock information.
const allStocks = parseCSV(csvData);

// The StockList component displays a list of stocks in a table. Each row has a "See Details" button to navigate to the stock's details.
const StockList = ({ stocks }) => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes.

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell>{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/stock/${stock.symbol}`)}>
                  See Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// The main App component that sets up the application's layout and routing.
const App = () => {
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h4" style={{ color: "white" }}>WealthWise</Typography>
          <div>
            <Button color="inherit" component={Link} to="/" style={{ color: "white" }}>Portfolio</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<StockList stocks={allStocks} />} />
          <Route path="/stock/:symbol" element={<StockDetails />} />
        </Routes>
      </Container>
    </>
  );
};

export default App; // Export the component for use in other parts of the app
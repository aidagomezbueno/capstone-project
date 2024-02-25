// import React, { useState, useEffect } from "react"; // React core features
// import axios from "axios"; // For making HTTP requests
// import { Routes, Route, Link } from "react-router-dom"; // React Router components for routing
import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material"; // Material-UI components for UI elements
import { AppBar, Toolbar, Typography, Button, Container, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
// import StockList from "./components/StockList"; // Custom component for displaying a list of stocks
import StockDetails from "./components/StockDetails"; // Custom component for displaying stock details

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

// Function to parse CSV data
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

const allStocks = parseCSV(csvData);

// StockList component
const StockList = ({ stocks }) => {
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

// App component
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

export default App;

// const App = () => {

//   const [allStocks, setAllStocks] = useState([]); // Stores the list of all stock data
//   const [portfolioSymbols, setPortfolioSymbols] = useState([]); // Stores the symbols of stocks added to the portfolio

  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     try {
  //       const response = await axios.get("/api/all-stocks");
  //       const parsedData = parseCSV(response.data);
  //       setAllStocks(parsedData.slice(0, 10000000000)); 
  //       // setAllStocks(parsedData);
  //     } catch (error) {
  //       console.error("Error fetching stocks:", error);
  //     }
  //   };

  //   fetchStocks();
  // }, []); // Empty dependency array - this runs once on mount

  // useEffect(() => {
  //   console.log("Current portfolioSymbols:", portfolioSymbols);
  // }, [portfolioSymbols]); // Runs only when portfolioSymbols changes

  // // Function to add a stock symbol to the portfolio if it's not already included
  // const handleAddToPortfolio = (symbol) => {
  //   if (!portfolioSymbols.includes(symbol)) {
  //     setPortfolioSymbols([...portfolioSymbols, symbol]);
  //   }
  // };

  // const parseCSV = (data) => {
  //   return data.split('\n')
  //     .slice(1)
  //     .map(line => {
  //       const [symbol, name] = line.split(',');
  //       return { symbol, name };
  //     })
  //     .filter(stock => stock.symbol && stock.name);
  // };

  // Computes the list of stock objects in the portfolio by mapping over portfolioSymbols and finding each in allStocks
//   const portfolioStocks = portfolioSymbols
//     .map((symbol) => allStocks.find((stock) => stock.symbol === symbol))
//     .filter((stock) => stock); // Filters out any undefined entries

//   // JSX for rendering the app UI
//   return (
//     <>
//       <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
//         <Toolbar style={{ justifyContent: "space-between" }}>
//           <Typography variant="h4" style={{ color: "white" }}>
//             WealthWise
//           </Typography>
//           <div>
//             <Button
//               color="inherit"
//               component={Link}
//               to="/"
//               style={{ color: "white" }}
//             >
//               Home
//             </Button>
//             <Button
//               color="inherit"
//               component={Link}
//               to="/portfolio"
//               style={{ color: "white" }}
//             >
//               My Portfolio
//             </Button>
//           </div>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="md" style={{ marginTop: "20px" }}>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <StockList
//                 stocks={allStocks}
//                 onAddToPortfolio={handleAddToPortfolio}
//                 isPortfolioView = {false}
//               />
//             }
//           />
//           <Route
//             path="/portfolio"
//             element={
//               <StockList
//                 stocks={portfolioStocks}
//                 onAddToPortfolio={handleAddToPortfolio}
//                 isPortfolioView = {true}
//               />
//             }
//           />
//           <Route path="/stock/:symbol" element={<StockDetails />} />
//         </Routes>
//       </Container>
//     </>
//   );
// };

// export default App; 
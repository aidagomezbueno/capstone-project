import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Component to display detailed stock information including historical data chart and latest quote
const StockDetails = () => {
  const [originalData, setOriginalData] = useState([]); // Stores original fetched stock data for chart
  const [details, setDetails] = useState([]); // Stores filtered or unfiltered stock data for chart rendering
  const [startDate, setStartDate] = useState(""); // User-selected start date for chart filtering
  const [endDate, setEndDate] = useState(""); // User-selected end date for chart filtering
  const [latestQuote, setLatestQuote] = useState(null); // Stores the latest quote information
  const { symbol } = useParams(); // Retrieves stock symbol from URL parameters

  // Fetches historical stock data on component mount or when the stock symbol changes
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // const response = await axios.get(`/api/stock/${symbol}`);
        const response = await axios.get(
          `https://aida-mcsbt-integration.lm.r.appspot.com/api/stock/${symbol}`
        );
        const weeklyTimeSeries = response.data["Weekly Time Series"];
        const chartData = Object.entries(weeklyTimeSeries).map(
          ([date, data]) => ({
            date,
            open: parseFloat(data["1. open"]),
            high: parseFloat(data["2. high"]),
            low: parseFloat(data["3. low"]),
            close: parseFloat(data["4. close"]),
            volume: parseFloat(data["5. volume"]),
          })
        );
        setOriginalData(chartData);
        setDetails(chartData);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [symbol]);

  // Fetches the latest stock quote on component mount or when the stock symbol changes
  useEffect(() => {
    const fetchLatestQuote = async () => {
      try {
        // const response = await axios.get(`/api/quote/${symbol}`);
        const response = await axios.get(
          `https://aida-mcsbt-integration.lm.r.appspot.com/api/quote/${symbol}`
        );
        setLatestQuote(response.data["Global Quote"]);
      } catch (error) {
        console.error("Error fetching latest quote:", error);
      }
    };

    fetchLatestQuote();
  }, [symbol]);

  // Handles change in start date for chart filtering
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (newStartDate && endDate && newStartDate > endDate) {
      setEndDate(""); // Resets the end date if it is before the new start date
    }
  };

  // Handles change in end date for chart filtering
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  // Filters chart data based on selected start and end dates and updates the chart
  const updateChart = () => {
    const filteredData = originalData.filter((data) => {
      const dataDate = new Date(data.date);
      const start = startDate ? new Date(startDate) : new Date("1970-01-01");
      const end = endDate ? new Date(endDate) : new Date();
      return dataDate >= start && dataDate <= end;
    });

    setDetails(filteredData);
  };

  return (
    <div>
      <h2>Stock Details for {symbol}</h2>
      {/* Input fields for date filtering and a button to update the chart based on the selected date range */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ width: "65%", paddingRight: "10px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
              />
            </label>
            <button onClick={updateChart} style={{ height: "fit-content" }}>
              Update Chart
            </button>
          </div>
          {/* Responsive container for rendering line chart of stock's historical data */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={details}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#8884d8" />
              <Line type="monotone" dataKey="close" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Display latest quote information if available */}
        {latestQuote && (
          <div
            style={{
              width: "35%",
              paddingLeft: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "5px",
              }}
            >
              <h3>Latest Quote</h3>
              {/* Latest quote details */}
              <div>
                <p>Price: {latestQuote["05. price"]}</p>
                <p>Open: {latestQuote["02. open"]}</p>
                <p>High: {latestQuote["03. high"]}</p>
                <p>Low: {latestQuote["04. low"]}</p>
                <p>Volume: {latestQuote["06. volume"].toLocaleString()}</p>
                <p>
                  Latest Trading Day: {latestQuote["07. latest trading day"]}
                </p>
                <p>Previous Close: {latestQuote["08. previous close"]}</p>
                <p>Change: {latestQuote["09. change"]}</p>
                <p>Change Percent: {latestQuote["10. change percent"]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetails;

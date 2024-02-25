// Import necessary hooks and components from React, React Router, Axios for HTTP requests, and Recharts for charting
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To access the URL parameters
import axios from "axios"; // For making HTTP requests
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, // Components from Recharts for rendering line charts
} from "recharts";

// Define the StockDetails component
const StockDetails = () => {
  // State hooks for managing component state
  const [originalData, setOriginalData] = useState([]); // Stores the original fetched data for the stock
  const [details, setDetails] = useState([]); // Processed data to be displayed in the chart
  const [startDate, setStartDate] = useState(""); // User-selected start date for filtering the chart data
  const [endDate, setEndDate] = useState(""); // User-selected end date for filtering the chart data
  const [latestQuote, setLatestQuote] = useState(null); // Stores the latest quote data for the stock
  const { symbol } = useParams(); // Extracts the stock symbol from the URL parameters

  // Effect hook to fetch stock details data from the server
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/stock/${symbol}`); // Fetch stock data
        const weeklyTimeSeries = response.data["Weekly Time Series"]; // Extract the relevant data
        // Transform the data into a format suitable for the chart
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
        setOriginalData(chartData); // Update the state with the fetched data
        setDetails(chartData); // Initially, display all fetched data in the chart
      } catch (error) {
        console.error("Error fetching details:", error); // Log any errors
      }
    };

    fetchDetails(); // Invoke the fetch operation
  }, [symbol]); // Re-run the effect if the symbol changes

  // Effect hook to fetch the latest quote for the stock
  useEffect(() => {
    const fetchLatestQuote = async () => {
      try {
        const response = await axios.get(`/api/quote/${symbol}`); // Fetch the latest quote data
        setLatestQuote(response.data["Global Quote"]); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching latest quote:", error); // Log any errors
      }
    };

    fetchLatestQuote(); // Invoke the fetch operation
  }, [symbol]); // Re-run the effect if the symbol changes

  // Handler for start date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    // If the new start date is after the current end date, reset the end date
    if (newStartDate && newStartDate > endDate) {
      setEndDate("");
    }
  };

  // Handler for end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  // Function to update the chart based on selected date range
  const updateChart = () => {
    const filteredData = originalData.filter((data) => {
      const dataDate = new Date(data.date);
      const start = startDate ? new Date(startDate) : new Date("1970-01-01");
      const end = endDate ? new Date(endDate) : new Date();
      return dataDate >= start && dataDate <= end; // Only include data within the selected range
    });

    setDetails(filteredData); // Update the chart data
  };

  // Render the component
  return (
    <div>
      <h2>Stock Details for {symbol}</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ width: "65%", paddingRight: "10px" }}>
          {" "}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {" "}
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
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={details}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
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
        <div
          style={{
            width: "35%",
            paddingLeft: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {latestQuote && (
            <div
              style={{
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "5px",
              }}
            >
              <h3
                style={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                Latest Quote
              </h3>
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                <span>Price: </span>
                <span
                  style={{
                    color: latestQuote["09. change"].startsWith("-")
                      ? "red"
                      : "green",
                  }}
                >
                  {latestQuote["05. price"]}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p>Open: {latestQuote["02. open"]}</p>
                  <p>High: {latestQuote["03. high"]}</p>
                  <p>Low: {latestQuote["04. low"]}</p>
                  <p>Volume: {latestQuote["06. volume"].toLocaleString()}</p>
                  <p>
                    Latest Trading Day: {latestQuote["07. latest trading day"]}
                  </p>
                  <p>Previous Close: {latestQuote["08. previous close"]}</p>
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  color: latestQuote["09. change"].startsWith("-")
                    ? "red"
                    : "green",
                }}
              >
                <p>Change: {latestQuote["09. change"]}</p>
                <p>Change Percent: {latestQuote["10. change percent"]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetails; // Export the component for use in other parts of the app
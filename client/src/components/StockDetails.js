// frontend - StockDetails.js
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

const StockDetails = () => {
  const [originalData, setOriginalData] = useState([]);
  const [details, setDetails] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [latestQuote, setLatestQuote] = useState(null);
  const { symbol } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
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

  useEffect(() => {
    const fetchLatestQuote = async () => {
      try {
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

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (newStartDate && newStartDate > endDate) {
      setEndDate(""); // Reset the end date if it's before the new start date
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

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

export default StockDetails;

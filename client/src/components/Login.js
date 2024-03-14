import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Snackbar, Button } from "@mui/material";

import { useAuth } from "../AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // To control Snackbar visibility
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      //   const response = await axios.post(
      //     "https://aida-mcsbt-integration.lm.r.appspot.com/login",
      //     {
      //       username,
      //       password,
      //     }
      //   );
      const response = await axios.post("/login", {
        username,
        password,
      });
      setLoading(false);
      setSnackbarOpen(true);
      login();
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("/signup", {
        name: username,
        password,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Sign up failed:",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>{" "}
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Login successful, accessing app..."
        action={
          <React.Fragment>
            <CircularProgress color="inherit" size={20} />
            <Button
              color="secondary"
              size="small"
              onClick={handleCloseSnackbar}
            >
              Close
            </Button>
          </React.Fragment>
        }
      />
    </div>
  );
};

export default Login;

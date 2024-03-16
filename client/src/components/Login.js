import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useAuth } from "../AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // const response = await axios.post(
      //   "https://aida-mcsbt-integration.lm.r.appspot.com/login",
      //   {
      //     username,
      //     password,
      //   }
      // );
      await axios.post("/login", {
        username,
        password,
      });
      setLoading(false);
      handleAlert("Login successful, accessing app...", "success");
      login();
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      setLoading(false);
      handleAlert(
        error.response?.data?.message || "An error occurred",
        "error"
      );
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("/signup", {
        name: username,
        password,
      });
      // const response = await axios.post(
      //   "https://aida-mcsbt-integration.lm.r.appspot.com/signup",
      //   {
      //     name: username,
      //     password,
      //   }
      // );
      if (response.status === 201) {
        setUsername("");
        setPassword("");
        handleAlert(
          "Sign up successful! Please, enter your credentials to log in.",
          "success"
        );
      }
    } catch (error) {
      handleAlert(
        error.response?.data?.message || "An error occurred",
        "error"
      );
    }
  };

  const handleAlert = (message, severity) => {
    setAlert({ show: true, message, severity });
    setTimeout(() => {
      setAlert({ show: false, message: "", severity: "info" });
    }, 6000);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a19aa0",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ fontWeight: "bold" }}
              >
                Welcome back!
              </Typography>
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} container spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={handleSignUp}
                        disabled={loading}
                      >
                        Sign Up
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        {alert.show && (
          <Alert
            onClose={() =>
              setAlert({ show: false, message: "", severity: "info" })
            }
            severity={alert.severity}
            sx={{ position: "fixed", bottom: 20, right: 20 }}
          >
            {alert.message}
          </Alert>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default Login;

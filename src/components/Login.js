import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Error from "./Error";
import "./Login.css";  // Per importare gli stili
import "../App.css"
import SuccessPopup from "./SuccessPopup";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    let authUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api/";
    try {
      const response = await axios.post(authUrl + "auth/login", {
        username,
        password,
      });
      // Memorizza il token in localStorage
      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/movies/watched"); // Redirect dopo login
      window.location.reload();
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    let authUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api/";
    try {
      const response = await axios.post(authUrl + "auth/request-reset", { username });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Accedi</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome utente"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="submit-button">Accedi</button>
          {error && <Error error={error} setError={setError}/>}
          {message && <SuccessPopup successMessage={message} setSuccessMessage={setMessage}/>}
          <p className="register-link" onClick={(e)=>{handlePasswordReset(e)}}>Reset password</p>
          <p className="register-link" onClick={()=>{navigate("/register")}}>Non hai ancora un account? clicca qui per registrarti</p>
        </form>
        
      </div>
    </div>
  );
}

export default Login;
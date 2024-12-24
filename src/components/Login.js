import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";  // Per importare gli stili

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      navigate("/"); // Redirect dopo login
    } catch (err) {
      setError(err.response.data.error);
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
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
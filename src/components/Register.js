import React, { useState } from "react";
import axios from "axios";
import './Login.css'
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    let apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api/"

    try {
      const response = await axios.post(`${apiUrl}auth/register`, {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      setError("");
      navigate("/login")
    } catch (err) {
      setError(err.response.data.error);
      setMessage("");
    }
  };

  return (
    <div className="login-container">
        <div className="login-card">
            <h1 className="login-title">Registrazione</h1>
            <form onSubmit={handleRegister}>
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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="submit-button">Registrati</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p>{message}</p>}
        
        </div>
    </div>
  );
}

export default Register;
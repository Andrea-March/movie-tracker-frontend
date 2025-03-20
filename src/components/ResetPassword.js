import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");
    const username = new URLSearchParams(location.search).get("username");
  
    const handleReset = async (e) => {
      e.preventDefault();
      let authUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api/";
      try {
        const response = await axios.post(authUrl + "auth/reset-password", { token, newPassword, username });
        setMessage(response.data.message);
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setMessage("Errore: " + err.response.data.message);
      }
    };
  
    return (
      <div>
        <h2>Reimposta Password</h2>
        <form onSubmit={handleReset}>
          <input type="password" placeholder="Nuova Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit">Reimposta</button>
        </form>
        <p>{message}</p>
      </div>
    );
  };

  export default ResetPassword;
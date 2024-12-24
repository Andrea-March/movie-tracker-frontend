import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response.data.error);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Registrazione</h1>
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="Nome utente"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrati</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/'; // Backend in esecuzione sulla porta 5000

// Funzione per cercare i film tramite il backend
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${API_URL}movies/search`, {
      params: { query },
    });
    return response.data; // Restituisce i film trovati
  } catch (error) {
    throw new Error('Errore durante la ricerca dei film');
  }
};

// Funzione per cercare i film tramite il backend
export const searchPopularMovies = async (query) => {
  try {
    const response = await axios.get(`${API_URL}movies/popular`, {
      params: { query },
    });
    return response.data; // Restituisce i film trovati
  } catch (error) {
    throw new Error('Errore durante la ricerca dei film');
  }
};

// Funzione per aggiungere un film alla lista dell'utente (visti o da vedere)
export const addMovieToList = async (movie, watched) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Devi essere loggato per aggiungere il film.");
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
  
    try {
      const response = await axios.post(
        `${API_URL}users/${userId}/movies`,
        {movie: movie, watched: watched},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.message || "Film aggiunto con successo!";
    } catch (err) {
      throw new Error("Errore durante l'aggiunta del film");
    }
  };

// Recupera i film dell'utente
export const fetchUserMovies = async (token) => {
    if (!token) {
        throw new Error("Devi essere loggato per aggiungere il film.");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
    try {
      const response = await axios.get(`${API_URL}users/${userId}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Errore nella chiamata API");
    }
  };
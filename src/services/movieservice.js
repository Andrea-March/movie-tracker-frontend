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
export const searchPopularMovies = async (page) => {
  try {
    const response = await axios.get(`${API_URL}movies/popular`, {
      params: { page },
    });
    return response.data; // Restituisce i film trovati
  } catch (error) {
    throw new Error('Errore durante la ricerca dei film');
  }
};

export const searchTopRatedMovies = async (page) => {
  try {
    const response = await axios.get(`${API_URL}movies/top_rated`, {
      params: { page },
    });
    return response.data; // Restituisce i film trovati
  } catch (error) {
    throw new Error('Errore durante la ricerca dei film');
  }
};

export const searchUpcomingMovies  = async (page) => {
  try {
    const response = await axios.get(`${API_URL}movies/upcoming`, {
      params: { page },
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
      throw new Error(err.response.data.error);
    }
  };

// Recupera i film dell'utente
export const fetchUserMovies = async (token, type) => {
  console.log("called with type " + {type})
    if (!token) {
        throw new Error("Devi essere loggato per aggiungere il film.");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
    try {
      const response = await axios.get(`${API_URL}users/${userId}/movies/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Errore nella chiamata API");
    }
  };

// Cambia stato del film
export const changeMovieStatus = async (token, movieId, status) => {
  if (!token) {
      throw new Error("Devi essere loggato per aggiungere il film.");
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
  try {
    const response = await axios.put(`${API_URL}users/${userId}/movies/${movieId}`, 
      { watched:status },
      {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Errore nella chiamata API");
  }
};

//Delete a movie from user's lists
export const deleteMovie = async (token, movieId) => {
  if (!token) {
      throw new Error("Devi essere loggato per eliminare il film.");
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
  try {
    const response = await axios.delete(`${API_URL}users/${userId}/movies/${movieId}`,
      {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Errore nella chiamata API");
  }
};


// Recupera i providers per un film
  export const getMovieProviders = async (token, movieId) => {
    if (!token) {
        throw new Error("Devi essere loggato per accedere ai provider del film.");
      }
    try {
      const response = await axios.get(`${API_URL}movies/providers/${movieId}`, 
        {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Errore nella chiamata API");
    }
  };

  // Funzione per cercare il trailer di un film tramite il backend
export const searchTrailerurl = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}movies/${movieId}/trailer`);
    return response.data.trailer_url; // Restituisce il link del trailer su youtube
  } catch (error) {
    throw new Error('Errore durante la ricerca del trailer');
  }
};
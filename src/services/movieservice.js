// services/moviesApi.js
import { jwtDecode } from "jwt-decode";
import { api } from "./httpClient"; 

// --- Helpers ---
function normalizeError(err, fallback) {
  return new Error(
    err?.response?.data?.error || err?.message || fallback || "Errore sconosciuto"
  );
}

function requireToken(explicitToken) {
  const t = explicitToken ?? localStorage.getItem("token");
  if (!t) throw new Error("Devi essere loggato.");
  return t;
}

function getUserIdFromToken(explicitToken) {
  const t = requireToken(explicitToken);
  const decoded = jwtDecode(t);
  const userId = decoded?.userId;
  if (!userId) throw new Error("Token non valido: userId mancante.");
  return { token: t, userId };
}

// =====================
//   SEARCH / DISCOVERY
// =====================

export const searchMovies = async (query) => {
  try {
    const res = await api.get(`/movies/search`, { params: { query } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca dei film");
  }
};

export const searchMulti = async (query) => {
  try {
    const res = await api.get(`/movies/search/multi`, { params: { query } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca");
  }
};

export const searchPopularMovies = async (page) => {
  try {
    const res = await api.get(`/movies/popular`, { params: { page } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca dei film popolari");
  }
};

export const searchTopRatedMovies = async (page) => {
  try {
    const res = await api.get(`/movies/top_rated`, { params: { page } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca dei film top rated");
  }
};

export const searchUpcomingMovies = async (page) => {
  try {
    const res = await api.get(`/movies/upcoming`, { params: { page } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca dei film in arrivo");
  }
};

// =====================
//     USER MOVIES
// =====================

export const addMovieToList = async (movie, watched) => {
  try {
    const { userId } = getUserIdFromToken();
    const res = await api.post(`/users/${userId}/movies`, { movie, watched });
    return res.data?.message || "Film aggiunto con successo!";
  } catch (err) {
    throw normalizeError(err, "Errore nell'aggiunta del film");
  }
};

export const fetchUserMovies = async (token, type, page = 1, countPages = false) => {
  try {
    const { userId } = getUserIdFromToken(token);
    const res = await api.get(`/users/${userId}/movies/${type}`, {
      params: { page, countPages },
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel recupero dei film utente");
  }
};

export const changeMovieStatus = async (token, movieId, status) => {
  try {
    const { userId } = getUserIdFromToken(token);
    const res = await api.put(`/users/${userId}/movies/${movieId}`, { watched: status });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nell'aggiornamento dello stato del film");
  }
};

export const deleteMovie = async (token, movieId) => {
  try {
    const { userId } = getUserIdFromToken(token);
    const res = await api.delete(`/users/${userId}/movies/${movieId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nell'eliminazione del film");
  }
};

// =====================
//       MOVIE EXTRAS
// =====================

export const getMovieProviders = async (token, movieId) => {
  try {
    requireToken(token);
    const res = await api.get(`/movies/providers/${movieId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel recupero dei provider del film");
  }
};

export const searchTrailerurl = async (movieId) => {
  try {
    const res = await api.get(`/movies/${movieId}/trailer`);
    return res.data?.trailer_url;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca del trailer");
  }
};

export const getGenresAndRuntime = async (movieId) => {
    try {
    const res = await api.get(`/movies/${movieId}/genres-runtime`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore durante la ricerca del trailer");
  }
}

export const getMoviesByDecade = async (decade, page) => {
  try {
    const res = await api.get(`/movies/movies-by-decade`, { params: { decade, page } });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel recupero dei film per decennio");
  }
};

export const getRelatedMovies = async (movieId) => {
  try {
    requireToken();
    const res = await api.get(`/movies/${movieId}/related`);
    return res.data?.movies;
  } catch (err) {
    throw normalizeError(err, "Errore durante il fetch dei film correlati");
  }
};
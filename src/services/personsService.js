import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/'; // Backend in esecuzione sulla porta 5000


const token = localStorage.getItem("token");

/* type = "Director" || "Crew" */
export const getPersonMovies = async (personId, type) => {
  try {
    const response = await axios.get(`${API_URL}person/movies/${personId}/${type}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { personDetail: {}, movies: [...] }
  } catch (error) {
    throw new Error("Errore durante il recupero dei film della persona");
  }
};
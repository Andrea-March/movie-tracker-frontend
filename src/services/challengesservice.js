import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/'; // Backend in esecuzione sulla porta 5000

const token = localStorage.getItem("token");

// Funzione per creare una nuova sfida
export const createChallenge = async (challengeData, decade) => {
    try {
      // decade viene passato come query, il resto è nel body
      const response = await axios.post(`${API_URL}challenges?decade=${decade}`, challengeData);
      return response.data; // Restituisce la risposta del server
    } catch (error) {
      console.error("Errore durante la creazione della sfida:", error);
      throw error; // Lancia un'eccezione per la gestione degli errori
    }
  };

// Funzione per ottenere tutte le sfide
export const getChallenges = async () => {
    try {
      const response = await axios.get(`${API_URL}challenges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Errore durante il recupero delle sfide", error);
      throw error;
    }
  };
  
// Funzione per ottenere i dettagli della sfida
export const getChallengeDetails = async (challengeId) => {
    try {
        const response = await axios.get(`${API_URL}challenges/${challengeId}/progress`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return response.data;
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli della sfida", error);
        throw error;
    }
};

export const getChallengeMovies = async (challengeId, page) => {
  try {
    const response = await axios.get(`${API_URL}challenges/${challengeId}/movies`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    params: {
      page
    }
    });
    return response.data;
} catch (error) {
    console.error("Errore durante il recupero dei dettagli della sfida", error);
    throw error;
}
}
  
// Funzione per segnare un film come visto
export const markMovieAsWatched = async (challengeId, movieId) => {
    try {
        await axios.patch(
        `${API_URL}/challenges/${challengeId}/progress`,
        { movieId },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
    } catch (error) {
        console.error("Errore durante l'aggiornamento del progresso del film", error);
        throw error;
    }
};
  
  // Funzione per ottenere i badge dell'utente
export const getUserBadges = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/badges`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return response.data.badges;
    } catch (error) {
        console.error("Errore durante il recupero dei badge", error);
        throw error;
    }
};

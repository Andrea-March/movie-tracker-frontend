import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getChallengeDetails, markMovieAsWatched } from "../services/challengesservice";
import '../App.css';
import Loader from "../components/Loader";

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const history = useHistory();

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const challengeData = await getChallengeDetails(challengeId); // Usa il service per ottenere i dettagli della sfida
        setChallenge(challengeData);
        setSelectedMovies(challengeData.selectedMovies);
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli della sfida", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [challengeId, token]);

  const markMovieAsWatched = async (movieId) => {
    try {
      await markMovieAsWatched(challengeId, movieId); // Usa il service per segnare il film come visto
      setSelectedMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.movieId === movieId ? { ...movie, watched: true } : movie
        )
      );
      alert("Film segnato come visto!");
    } catch (error) {
      console.error("Errore durante l'aggiornamento del progresso del film", error);
    }
  };

  return (
    <div className="content">
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <>
          <h1>{challenge.title}</h1>
          <p>{challenge.theme}</p>
          <p>Obiettivo: {challenge.goal}</p>
          <p>Data di fine: {new Date(challenge.endDate).toLocaleDateString()}</p>

          <h2>Film Selezionati</h2>
          <div className="ch-details-movie-grid">
            {selectedMovies.length > 0 ? (
              selectedMovies.map((movie) => (
                <div className="ch-details-movie-card" key={movie.movieId}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.movieId.poster_path}`}
                    alt={movie.movieId.title}
                    className="ch-details-movie-poster"
                  />
                  <div className="ch-details-movie-details">
                    <h3>{movie.movieId.title}</h3>
                    <p>{new Date(movie.movieId.release_date).getFullYear()}</p>
                    {movie.watched ? (
                      <p>Visto</p>
                    ) : (
                      <button onClick={() => markMovieAsWatched(movie.movieId)}>
                        Segna come visto
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Non ci sono film selezionati per questa sfida.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeDetail;
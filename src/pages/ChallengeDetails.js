import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeDetails, markMovieAsWatched } from "../services/challengesservice";
import '../App.css';
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
                    srcSet={`https://image.tmdb.org/t/p/w200/${movie.movieId.poster_path.split("/")[6]} 200w, 
                    https://image.tmdb.org/t/p/w400/${movie.movieId.poster_path.split("/")[6]} 400w`} 
                    sizes="(max-width: 768px) 200px, 400px"
                    alt={movie.movieId.title} 
                    className=".ch-details-movie-poster" 
                    loading="lazy"
                    style={{ width: "150px"}} 
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
          <div className="pagination">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeDetail;
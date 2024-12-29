import React, {useState, useEffect} from "react";
import {fetchUserMovies} from '../services/movieservice'
import '../App.css'
import './WatchedMovies.css'
import MovieDetailPopup from "../components/MovieDetailPopup";
import Loader from "../components/Loader";


const ToWatchMovies = () => {

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);  // Stato per il film selezionato
  const [isPopupOpen, setIsPopupOpen] = useState(false);     // Stato per la visibilità del popup
  
  useEffect(() => {
    const loadWatchedMovies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Non sei autenticato.");
          return;
        }

        const movies = await fetchUserMovies(token, 'to-watch');
        setMovies(movies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWatchedMovies();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  // Funzione per aprire il popup con i dettagli del film
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsPopupOpen(true); // Apri il popup
  };

  // Funzione per chiudere il popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedMovie(null);
  };
  
  
  return (
    <div className="watched-movies content">
      {loading && <Loader />}
      <h1 className="title">Film Da Vedere</h1>
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id} onClick={()=>handleMovieClick(movie.movieId)}>
              <img 
                src={movie.movieId.poster_path} 
                alt={movie.movieId.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
                loading="lazy"
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-description">{new Date(movie.movieId.Year).getFullYear()}</p> */}

              <div className="hide-on-mobile">
                <p className="movie-title">{movie.movieId.title}</p>
                <p className="movie-year">{new Date(movie.movieId.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">Non hai ancora aggiunto film da vedere.</p>
      )}
      {/* Popup per i dettagli del film */}
      {isPopupOpen && selectedMovie && (
        <MovieDetailPopup
          movie={selectedMovie}
          closePopup={closePopup} // Passa la funzione per chiudere il popup
        />
      )}
    </div>
  );
  
};

export default ToWatchMovies;

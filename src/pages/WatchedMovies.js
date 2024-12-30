import React, { useEffect, useState } from "react";
import { fetchUserMovies, changeMovieStatus } from "../services/movieservice";
import "./WatchedMovies.css"; // File CSS dedicato
import MovieDetailPopup from "../components/MovieDetailPopup";
import Loader from "../components/Loader";
/* import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; */

const WatchedMovies = () => {
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

        const movies = await fetchUserMovies(token, 'watched');
        setMovies(movies);
      } catch (err) {
        setError(err.message);
      }finally {
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

  const changeStatus = async (selectedMovie) => {
    setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Non sei autenticato.");
          return;
        }

        await changeMovieStatus(token, selectedMovie._id,  false);
        window.location.reload()
      } catch (err) {
        setError(err.message);
      }finally {
        setLoading(false);
      }
  }

  return (
    <div className="watched-movies content">
      {loading && <Loader />}
      <h1 className="title">Film Visti</h1>
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id} onClick={()=>handleMovieClick(movie.movieId)}>
              <img 
                srcSet={`https://image.tmdb.org/t/p/w200/${movie.movieId.poster_path.split("/")[6]} 200w, 
                https://image.tmdb.org/t/p/w400/${movie.movieId.poster_path.split("/")[6]} 400w`} 
                sizes="(max-width: 768px) 200px, 400px"
                alt={movie.movieId.title} 
                className="movie-poster" 
                loading="lazy"
                style={{ width: "150px"}} 
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-year">{new Date(movie.movieId.Year).getFullYear()}</p> */}
              
              <div className="hide-on-mobile">
                <p className="movie-title">{movie.movieId.title}</p>
                <p className="movie-year">{new Date(movie.movieId.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">Non hai ancora aggiunto film visti.</p>
      )}

      {/* Popup per i dettagli del film */}
      {isPopupOpen && selectedMovie && (
        <MovieDetailPopup
          movie={selectedMovie}
          movieStatus="watched"
          changeMovieStatus={()=>changeStatus(selectedMovie)}
          closePopup={closePopup} // Passa la funzione per chiudere il popup
        />
      )}
    </div>
  );
};

export default WatchedMovies;
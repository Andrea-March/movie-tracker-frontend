import React, {useState, useEffect} from "react";
import {fetchUserMovies, changeMovieStatus} from '../services/movieservice'
import '../App.css'
import './WatchedMovies.css'
import MovieDetailPopup from "../components/MovieDetailPopup";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
/* import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; */


const ToWatchMovies = () => {

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(undefined);

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

        const res = await fetchUserMovies(token, 'to-watch', page, !totalPages);
                setMovies(res.movies);
                if(!totalPages){
                  setTotalPages(res.totalPages);
                }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWatchedMovies();
  }, [page]);

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

        await changeMovieStatus(token, selectedMovie._id,  true);
        window.location.reload()
      } catch (err) {
        setError(err.message);
      }finally {
        setLoading(false);
      }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  
  return (
    <div className="watched-movies content">
      {loading && <Loader />}
      {/* <h1 className="title">Film Da Vedere</h1> */}
      {loading && <div className="movies-grid-placeholder"></div>}
      {!loading && movies.length > 0 && 
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id} onClick={()=>handleMovieClick(movie.movieId)}>
              <img 
                srcSet={`https://image.tmdb.org/t/p/w200/${movie.movieId.poster_path.split("/")[6]} 200w, 
                https://image.tmdb.org/t/p/w400/${movie.movieId.poster_path.split("/")[6]} 400w`} 
                sizes="(max-width: 768px) 200px, 400px"
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
      }
       
      { !loading && movies.length < 1 && <p className="no-movies">Non hai ancora aggiunto film da vedere.</p>}

      <div className="pagination">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={page === 1}
                  className="pagination-button"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span>{page} / {totalPages}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                  className="pagination-button"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
        </div>
      {/* Popup per i dettagli del film */}
      {isPopupOpen && selectedMovie && (
        <MovieDetailPopup
          movie={selectedMovie}
          movieStatus="to-watch"
          changeMovieStatus={()=>changeStatus(selectedMovie)}
          closePopup={closePopup} // Passa la funzione per chiudere il popup
        />
      )}
    </div>
  );
  
};

export default ToWatchMovies;

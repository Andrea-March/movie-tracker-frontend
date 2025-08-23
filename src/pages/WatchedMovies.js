import React, { useEffect } from "react";
import { Slidable } from "../components/Slidable";
import "./WatchedMovies.css"; // File CSS dedicato
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

const WatchedMovies = () => {

  const { watched, error } = movieStore;


  useEffect(() => {
    movieStore.loadWatchedMovies();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }


  const handleNextPage = () => {
    if (watched.page < watched.totalPages) {
      movieStore.setWatchedPage(watched.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (watched.page > 1) {
      movieStore.setWatchedPage(watched.page - 1);
    }
  };


  return (
    <div className="watched-movies content">
      {movieStore.loading && <div className="movies-grid-placeholder"></div>}
      {!movieStore.loading && watched.movies.length > 0 && 
        <Slidable 
          className="movie-grid" 
          onNext={handleNextPage} 
          onPrev={handlePreviousPage} 
        >
          {watched.movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id} onClick={()=>movieStore.setSelectedMovie(movie.movieId, "watched")}>
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
          
        </Slidable>
      }
       {!movieStore.loading && watched.movies.length < 1 && <p className="no-movies">Non hai ancora aggiunto film visti.</p>}
        <div className="pagination">
          <button 
            onClick={handlePreviousPage} 
            disabled={watched.page === 1}
            className="pagination-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span>{watched.page} / {watched.totalPages}</span>
          <button 
            onClick={handleNextPage} 
            disabled={watched.page === watched.totalPages}
            className="pagination-button"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
         </div>
    </div>
  );
};

export default observer(WatchedMovies);
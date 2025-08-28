import React, {useEffect} from "react";
import { Slidable } from "../components/Slidable";
import '../App.css'
import './WatchedMovies.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

const ToWatchMovies = () => {

  const { toWatch, loading } = movieStore;

  useEffect(() => {
    movieStore.loadToWatchMovies();
  }, []);

  const handleNextPage = () => {
    if (toWatch.page < toWatch.totalPages) {
      movieStore.setToWatchPage(toWatch.page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (toWatch.page > 1) {
      movieStore.setToWatchPage(toWatch.page - 1);
    }
  };

  
  return (
    <div className="watched-movies content">
      {!loading && toWatch.movies.length > 0 && 
        <Slidable 
          className="movie-grid flex-wrap justify-center" 
          onNext={handleNextPage} 
          onPrev={handlePreviousPage}
        >
          {toWatch.movies.map((movie) => (
            <div className="movie-card" key={movie.movieId.id} onClick={()=>movieStore.setSelectedMovie(movie.movieId, "to-watch")}>
              <img 
                srcSet={`https://image.tmdb.org/t/p/w200/${movie.movieId.poster_path.split("/")[6]} 200w, 
                https://image.tmdb.org/t/p/w400/${movie.movieId.poster_path.split("/")[6]} 400w`} 
                sizes="(max-width: 768px) 200px, 400px"
                alt={movie.movieId.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
                loading="lazy"
              />

              <div className="hide-on-mobile">
                <p className="movie-title">{movie.movieId.title}</p>
                <p className="movie-year">{new Date(movie.movieId.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </Slidable>
      }
      { !loading && toWatch.movies.length < 1 && <p className="no-movies">Non hai ancora aggiunto film da vedere.</p>}

      <div className="pagination">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={toWatch.page === 1}
                  className="pagination-button"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span>{toWatch.page} / {toWatch.totalPages}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={toWatch.page === toWatch.totalPages}
                  className="pagination-button"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
        </div> 
    </div>
  );
  
};

export default observer(ToWatchMovies);

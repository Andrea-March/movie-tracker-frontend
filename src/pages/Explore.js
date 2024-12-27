import React, {useEffect, useState} from "react";
import './WatchedMovies.css'
import './Explore.css'
import {searchPopularMovies, searchTopRatedMovies} from '../services/movieservice'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MovieDetailPopup from "../components/MovieDetailPopup";

const Explore = () => {

    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState("popular"); // Stato per il filtro selezionato

    const [selectedMovie, setSelectedMovie] = useState(null);  // Stato per il film selezionato
    const [isPopupOpen, setIsPopupOpen] = useState(false);     // Stato per la visibilità del popup
  

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                setError("Non sei autenticato.");
                return;
                }
                setPopularMovies([]);
                const res =
                filter === "popular"
                  ? await searchPopularMovies(currentPage)
                  : await searchTopRatedMovies(currentPage);
                setPopularMovies(res.movies);
                setTotalPages(res.totalPages)
            } catch (err) {
                setError(err.message);
            }
        };
        
        loadPopularMovies();
    }
    ,[currentPage, filter]);

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

    const handleFilterChange = (e) => {
      setFilter(e.target.value);
      setCurrentPage(1); // Resetta alla prima pagina quando cambia il filtro
    };

    return(
     <div className="watched-movies content">
      <select
          className="filter-select"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="popular">Popolari</option>
          <option value="top_rated">Top Rated</option>
        </select>
      {popularMovies.length > 0 ? (
        <div className="movie-grid">
          {popularMovies.map((movie) => (
            <div className="movie-card" key={movie.id} onClick={() => handleMovieClick(movie)}>
              <img 
                src={"https://image.tmdb.org/t/p/original"+movie.poster_path} 
                alt={movie.title} 
                className="movie-poster" 
                style={{ width: "150px"}} 
                loading="lazy"
              />
             {/*  <p className="movie-title">{movie.movieId.Title}</p>
              <p className="movie-year">{new Date(movie.movieId.Year).getFullYear()}</p> */}
              
              <div className="hide-on-mobile">
                <p className="movie-title">{movie.title}</p>
                <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
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
        </div>
        
      ) : (
        <p className="no-movies">Non ci sono film da visualizzare.</p>
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
}

export default Explore;
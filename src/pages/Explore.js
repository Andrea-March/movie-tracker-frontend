import React, {useEffect, useState} from "react";
import './WatchedMovies.css'
import './Explore.css'
import {searchPopularMovies} from '../services/movieservice'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Explore = () => {

    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                setError("Non sei autenticato.");
                return;
                }
                setPopularMovies([]);
                const res = await searchPopularMovies(currentPage);
                setPopularMovies(res.movies);
                setTotalPages(res.totalPages)
            } catch (err) {
                setError(err.message);
            }
        };
        
        loadPopularMovies();
    }
    ,[currentPage]);

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

    return(
     <div className="watched-movies content">
      <h1 className="title">Film Popolari</h1>
      {popularMovies.length > 0 ? (
        <div className="movie-grid">
          {popularMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
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
      
    </div>
    );
}

export default Explore;
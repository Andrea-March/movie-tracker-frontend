import React, {useEffect, useState} from "react";
import './WatchedMovies.css'
import './Explore.css'
import {searchPopularMovies, searchTopRatedMovies, searchUpcomingMovies} from '../services/movieservice'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MovieDetailPopup from "../components/MovieDetailPopup";
import Loader from "../components/Loader";
import CustomSelect from "../components/CustomSelect";
/* import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; */

const Explore = () => {

    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [filter, setFilter] = useState("popular"); // Stato per il filtro selezionato
    const options = [
      { value: "popular", label: "Popolari" },
      { value: "top_rated", label: "Top Rated" },
      { value: "upcoming", label: "In arrivo"}
  ];
    
    const [loading, setLoading] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState(null);  // Stato per il film selezionato
    const [isPopupOpen, setIsPopupOpen] = useState(false);     // Stato per la visibilità del popup
  

    useEffect(()=>{
        const loadPopularMovies = async () => {
          setLoading(true);
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
                  : filter === "top_rated" ? await searchTopRatedMovies(currentPage) : await searchUpcomingMovies(currentPage)
                setPopularMovies(res.movies);
                setTotalPages(res.totalPages)
            } catch (err) {
                setError(err.message);
            }finally{
              setLoading(false);
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

    const handleFilterChange = (newFilter) => {
      setFilter(newFilter);
      setCurrentPage(1);
  };

    return(
     <div className="watched-movies content">
      {loading && <Loader />}
      <div style={{marginLeft: "15px"}}>
      <CustomSelect
                options={options}
                value={filter}
                onChange={handleFilterChange}
            />
      </div>
     
      {popularMovies.length > 0 ? (
        <>
        <div className="movie-grid">
          {popularMovies.map((movie) => (
            <div className="movie-card" key={movie.id} onClick={() => handleMovieClick(movie)}>
              <img 
                srcSet={`https://image.tmdb.org/t/p/w200${movie.poster_path} 200w, 
                https://image.tmdb.org/t/p/w400${movie.poster_path} 400w,
                https://image.tmdb.org/t/p/w800${movie.poster_path} 800w`} 
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 400px, 800px" 
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
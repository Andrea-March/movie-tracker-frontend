import React, {useEffect, useState} from "react";
import './WatchedMovies.css'
import './Explore.css'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomSelect from "../components/CustomSelect";
import { Slidable } from "../components/Slidable";
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

const Explore = () => {

    const {popular, loading, setFilter} = movieStore;
    const [currentFilter, setCurrentFilter] = useState("popular");
    const options = [
      { value: "popular", label: "Popolari" },
      { value: "top_rated", label: "Top Rated" },
      { value: "upcoming", label: "In arrivo"}
    ];

    useEffect(()=>{      
        movieStore.loadPopularMovies();
    }
    ,[]);

      const handleNextPage = () => {
        if (popular.page < popular.totalPages) {
          movieStore.setPopularPage(popular.page + 1);
        }
      };
    
      const handlePreviousPage = () => {
        if (popular.page > 1) {
          movieStore.setPopularPage(popular.page - 1);
        }
      };
    
      const handleFilterChange = (filter) =>{console.log(filter);setFilter(filter);setCurrentFilter(filter)}

    return(
     <div className="watched-movies content">
      <div className="display-flex justify-center">
      <CustomSelect
                options={options}
                value={currentFilter}
                onChange={handleFilterChange}
      />
      </div>
      {!loading && popular.movies.length > 0 ? (
        <>
        <Slidable 
          className="movie-grid"
          onNext={handleNextPage} 
          onPrev={handlePreviousPage}
        >
          {popular.movies.map((movie) => (
            <div className="movie-card" key={movie.id} onClick={() => {movieStore.setSelectedMovie(movie, undefined)}}>
              <img 
                srcSet={`https://image.tmdb.org/t/p/w200${movie.poster_path} 200w, 
                https://image.tmdb.org/t/p/w400${movie.poster_path} 400w`} 
                sizes="(max-width: 768px) 200px, 400px"
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
          
        </Slidable>
        <div className="pagination">
          <button 
            onClick={handlePreviousPage} 
            disabled={popular.page === 1}
            className="pagination-button"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span>{popular.page} / {popular.totalPages}</span>
          <button 
            onClick={handleNextPage} 
            disabled={popular.page === popular.totalPages}
            className="pagination-button"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </>
      ) : (
        <p className="no-movies">Non ci sono film da visualizzare.</p>
      )}
    
    </div>
    );
}

export default observer(Explore);
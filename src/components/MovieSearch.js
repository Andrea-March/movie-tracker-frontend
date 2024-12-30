import React, { useEffect, useState } from "react";
import { searchMovies, addMovieToList } from "../services/movieservice";
import { faCheckCircle, faEye, faTimes } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MovieSearch.css';
import { useNavigate } from "react-router-dom";
import MovieDetailPopup from "./MovieDetailPopup";
import Error from './Error.js'

function MovieSearch({onCloseClick}) {
  /* const [query, setQuery] = useState(""); */
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [movie, setMovie] = useState(undefined);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const navigate = useNavigate();

  const DEBOUNCE_TIME_MS = 500;

  useEffect(() => {
    // Cleanup il timeout precedente se l'utente continua a scrivere
    return () => clearTimeout(typingTimeout);
  }, [typingTimeout]);


  // Funzione per cercare i film
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError("Inserisci un titolo da cercare.");
      setMovies([]);
      return;
    }

    setError(""); // Reset dell'errore precedente
    try {
      const data = await searchMovies(query); // Chiamata al servizio
      setMovies(data); // Imposta i risultati dei film
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setError("Errore durante la ricerca. Riprova.");
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;

    clearTimeout(typingTimeout);


    setTypingTimeout(
      setTimeout(async () => handleSearch(query), DEBOUNCE_TIME_MS) // Attendi 500ms dopo che l'utente smette di scrivere
    );
  };

    // Funzione per aggiungere un film alla lista dell'utente
    const handleAddToList = async (movie, watched) => {
        try {
          console.log(movie)
          const message = await addMovieToList(movie, watched); // Usa il servizio per aggiungere il film
          watched ? navigate("/watched") : navigate("/to-watch");
          window.location.reload();
        } catch (err) {
          setError(err.message);
        }
      };

    const handleMovieClick = (movie) => {
      setMovie(movie);
      setShowDetail(true);
    }

  return (
    <div className="movie-search-container">
      <div className="flex-row justify-between align-items-center">
        <h1>Ricerca Film</h1>
        <FontAwesomeIcon className="close-search-bar-icon" icon={faTimes} size="2x" onClick={onCloseClick}/>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Cerca un film..."
          onChange={handleInputChange}
        />
          
      </div>
      <button className="button search-button"
          onClick={handleSearch}
        >
        Cerca
        </button>
      <div>
         {/* Lista dei film */}
      {movies.length > 0 && (
        <div className="found-movies-container">
          <h2>Risultati della ricerca:</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {movies.slice(0, 3).map((movie) => (
              <li
                className="search-result"
                key={movie.id}
                onClick={()=>{handleMovieClick(movie)}}
              >
                  {movie.poster_path && (
                    <img
                      src={"https://image.tmdb.org/t/p/original"+movie.poster_path}
                      alt={movie.title}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h3 style={{ margin: 0 }} className="movie-title">
                      {movie.title}{" "}
                      {movie.release_date && `(${movie.release_date.slice(0, 4)})`}
                    </h3>
                  </div>
                <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
                <FontAwesomeIcon
                      icon={faCheckCircle}
                      onClick={(e) => {handleAddToList(movie, true)}}
                      style={{
                        cursor: "pointer",
                        color: "#4CAF50",
                        fontSize: "24px",
                      }}
                      className="add-icon"
                      title="Aggiungi ai visti"
                    />
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={(e) => {handleAddToList(movie, false)}}
                      style={{
                        cursor: "pointer",
                        color: "#FF9800",
                        fontSize: "24px",
                      }}
                      title="Aggiungi ai da vedere"
                    />
                  </div>
              </li>
            ))}
          </ul>
          {showDetail && <MovieDetailPopup movie={movie} closePopup={()=>setShowDetail(false)}/>}
        </div>
      )}
      </div>
      {/* <Error error={error}/> */}
    </div>
  );
}

export default MovieSearch;
import React, { useState } from "react";
import { searchMovies, addMovieToList } from "../services/movieservice";
import { faCheckCircle, faEye, faTimes } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MovieSearch.css';
import { useNavigate } from "react-router-dom";

function MovieSearch({onCloseClick}) {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Funzione per cercare i film
  const handleSearch = async () => {
    console.log(query)
    if (!query.trim()) {
      setError("Inserisci un titolo da cercare.");
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

    // Funzione per aggiungere un film alla lista dell'utente
    const handleAddToList = async (movie, watched) => {
        try {
          console.log(movie)
          const message = await addMovieToList(movie, watched); // Usa il servizio per aggiungere il film
          watched ? navigate("/watched") : navigate("/to-watch");
          window.location.reload();
        } catch (err) {
          console.error("Errore durante l'aggiunta del film:", err);
          alert("Errore durante l'aggiunta del film.");
        }
      };

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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
          
      </div>
      <button className="button search-button"
          onClick={handleSearch}
        >
        Cerca
        </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
              >
                {movie.Poster !== "N/A" && (
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
                </div><div style={{ display: "flex", gap: "10px", marginTop: "10px", marginLeft: "auto" }}>
                <FontAwesomeIcon
                      icon={faCheckCircle}
                      onClick={() => handleAddToList(movie, true)}
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
                      onClick={() => handleAddToList(movie, false)}
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
        </div>
      )}
      </div>
    </div>
  );
}

export default MovieSearch;
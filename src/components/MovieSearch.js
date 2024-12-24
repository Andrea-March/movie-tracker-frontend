import React, { useState } from "react";
import { searchMovies, addMovieToList } from "../services/movieservice";
import { faCheckCircle, faEye } from "@fortawesome/free-solid-svg-icons"; // Importa le icone da FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MovieSearch.css';
import { useNavigate } from "react-router-dom";

function MovieSearch() {
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
      <h1>Ricerca Film</h1>
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
                key={movie.imdbID}
              >
                {movie.Poster !== "N/A" && (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={{ borderRadius: "5px", width: "100px" }}
                  />
                )}
                <div>
                  <h3 style={{ margin: 0 }} className="movie-title">
                    {movie.Title}{" "}
                    {movie.Year && `(${movie.Year})`}
                  </h3>
                  <p style={{ margin: 0 }}>{movie.Plot}</p>
                </div><div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
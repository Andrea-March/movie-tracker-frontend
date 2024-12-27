import React from 'react';
import './MoviePopupDetail.css'; // Puoi aggiungere uno stile per il popup
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MovieDetailPopup = ({ movie, closePopup }) => {
  return (
    <div className="movie-popup-overlay">
      <div
        className="movie-popup"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1) 0%,  rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0) 100%), url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
        }}
      >
        <FontAwesomeIcon icon={faTimes} onClick={closePopup} className="close-popup-btn" />
        <h2>{movie.title}</h2>
        <p><strong>Data di uscita:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
        <p><strong>Descrizione:</strong> {movie.overview}</p>
        <p><strong>Voto:</strong> {movie.vote_average?.toFixed(1) || "?"} / 10</p>
      </div>
    </div>
  );
};

export default MovieDetailPopup;
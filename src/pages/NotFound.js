import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';  // Il file CSS per lo stile della pagina 404
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
    const navigate = useNavigate();

    const handleRedirectHome = () => {
      navigate('/movies/watched');
    };

  return (
    <div className="error404-container">
      <div className="error404-content">
        <h1 className="error404-title">Oops! Pagina non trovata.</h1>
        <p className="error404-description">
          Sembra che tu sia finito in un posto sbagliato. Non preoccuparti, ci sono tante altre pagine da esplorare!
        </p>
        <button className="error404-button" onClick={handleRedirectHome}>
          Torna alla Home <FontAwesomeIcon icon={faHome} />
        </button>
      </div>
    </div>
  );
};

export default NotFound;
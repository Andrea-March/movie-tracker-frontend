import React, { useEffect, useState } from 'react';
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react-lite";
import { movieStore } from "../stores/MovieStore";

const Error = observer(() => {
  const [showSelf, setShowSelf] = useState(false);

  useEffect(() => {
    if (movieStore.error) {
      setShowSelf(true);
      const timer = setTimeout(() => {
        setShowSelf(false);
        setTimeout(() => movieStore.clearError(), 300); // Attendi la fine dell'animazione
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [movieStore.error]);

  if (!movieStore.error) return null;

  return (
    <div className={`error-popup ${showSelf ? 'show' : ''}`}>
      <span style={{ marginRight: '8px', color: 'var(--error-text)' }}>
        <FontAwesomeIcon icon={faCircleXmark} size="2x" />
      </span>
      {movieStore.error}
    </div>
  );
});

export default Error;
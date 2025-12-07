import React, { useEffect, useState } from 'react';
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react-lite";
import { stateStore } from '../stores/StateStore';

const Error = () => {

  const { error } = stateStore; 
  const [showSelf, setShowSelf] = useState(false);

  useEffect(() => {
    if (error) {
      setShowSelf(true);
    const timer = setTimeout(() => {
        setShowSelf(false);
        setTimeout(() => stateStore.clearError(), 300); // Attendi la fine dell'animazione
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!error) return null;

  return (
    <div className={`error-popup ${showSelf ? 'show' : ''}`}>
      <span style={{ marginRight: '8px', color: 'var(--error-text)' }}>
        <FontAwesomeIcon icon={faCircleXmark} size="2x" />
      </span>
      {error}
    </div>
  );
};

export default observer(Error);
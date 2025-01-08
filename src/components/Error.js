import React, { useEffect, useState } from 'react';
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Error = ({ error, setError }) => {
    const [showSelf, setShowSelf] = useState(false);

    useEffect(() => {
        if (error) {
            setShowSelf(true);
            const timer = setTimeout(() => {
                setShowSelf(false);
                setTimeout(() => setError(''), 300); // Attendi la fine dell'animazione prima di pulire l'errore
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    return (
        <div className={`error-popup ${showSelf ? 'show' : ''}`}>
            <span style={{ marginRight: '8px', color: 'var(--error-text)' }}><FontAwesomeIcon icon={faCircleXmark} size="2x"/></span>
            {error}
        </div>
    );
};

export default Error;
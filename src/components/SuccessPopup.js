import React, { useEffect, useState } from 'react';
import './SuccessPopup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const SuccessPopup = ({ successMessage, setSuccessMessage }) => {
    const [showSelf, setShowSelf] = useState(false);

    useEffect(() => {
        if (successMessage) {
            setShowSelf(true);
            const timer = setTimeout(() => {
                setShowSelf(false);
                setTimeout(() => setSuccessMessage(''), 300); // Attendi la fine dell'animazione prima di pulire l'errore
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);

    return (
        <div className={`error-popup ${showSelf ? 'show' : ''}`}>
            <span style={{ marginRight: '8px', color: 'var(--error-text)' }}><FontAwesomeIcon icon={faCircleXmark} size="2x"/></span>
            {successMessage}
        </div>
    );
};

export default SuccessPopup;
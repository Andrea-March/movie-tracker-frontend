import React, { useEffect, useState } from 'react';
import './SuccessPopup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { observer } from 'mobx-react-lite';
import { stateStore } from '../stores/StateStore';

const SuccessPopup = () => {

      const { successMessage } = stateStore;
      const [showSelf, setShowSelf] = useState(false);
    
      useEffect(() => {
        if (successMessage) {
          setShowSelf(true);
          const timer = setTimeout(() => {
            setShowSelf(false);
            setTimeout(() => stateStore.clearSuccess(), 300); // Attendi la fine dell'animazione
          }, 3500);
    
          return () => clearTimeout(timer);
        }
      }, [successMessage]);
    
      if (!successMessage) return null;
    
      return (
        <div className={`success-popup ${showSelf ? 'show' : ''}`}>
          <span style={{ marginRight: '8px', color: 'var(--success-text)' }}>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" />
          </span>
          {successMessage}
        </div>
      );
};

export default observer(SuccessPopup);
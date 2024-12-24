import React, {useState, useEffect} from "react";


const DarkModeToggle = () => {
// Stato per la modalità dark
const [isDarkMode, setIsDarkMode] = useState(() => {
    // Recupera la preferenza dal localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  // Cambia la classe `dark-mode` su `document.documentElement` (equivale a `:root` nel CSS)
  useEffect(() => {
    if (isDarkMode) {
        try {
            document.documentElement.classList.remove('light-theme');
        }catch{}
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
        try {
            document.documentElement.classList.remove('dark-theme');
            
        }catch{}
        document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Funzione per togglare la modalità
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button 
      onClick={toggleDarkMode} 
      aria-label="Toggle dark mode" 
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0
      }}
    >
      {isDarkMode ? (
        // Lampadina accesa
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffab40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        // Lampadina spenta
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
}

export default DarkModeToggle;



/* // Lampadina accesa
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<circle cx="12" cy="12" r="5"></circle>
<line x1="12" y1="1" x2="12" y2="3"></line>
<line x1="12" y1="21" x2="12" y2="23"></line>
<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
<line x1="1" y1="12" x2="3" y2="12"></line>
<line x1="21" y1="12" x2="23" y2="12"></line>
<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
</svg> */
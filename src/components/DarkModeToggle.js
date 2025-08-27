import React, { useEffect, useState } from "react";

const THEME_KEY = "theme"; // 'dark' | 'light'

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return getSystemTheme();
}

function applyTheme(theme) {
  const root = document.documentElement;

  // 1) Attributo data-theme (nuovo stile)
  root.setAttribute("data-theme", theme);

  // 2) Classi legacy (compat)
  root.classList.remove("dark-theme", "light-theme");
  root.classList.add(theme === "dark" ? "dark-theme" : "light-theme");

  // 3) Aiuta i controlli nativi del browser (modali, form) a usare palette giusta
  root.style.colorScheme = theme;

  localStorage.setItem(THEME_KEY, theme);
}

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme); // 'dark' | 'light'
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <button
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={isDark ? "Tema chiaro" : "Tema scuro"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
    >
      {isDark ? (
        /* sole */
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
             viewBox="0 0 24 24" fill="none" stroke="#ffab40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        /* luna */
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3
                   7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        {isDark ? "Tema scuro attivo" : "Tema chiaro attivo"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
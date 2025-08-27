import { useEffect, useRef, useState } from "react";
import "./CreateGroupModal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils } from "@fortawesome/free-solid-svg-icons";

// set di icone
const ICONS = [
  { key: "users", icon: faUsers, label: "Generico" },
  { key: "film", icon: faFilm, label: "Cinema" },
  { key: "book", icon: faBook, label: "Libri" },
  { key: "gamepad", icon: faGamepad, label: "Gaming" },
  { key: "music", icon: faMusic, label: "Musica" },
  { key: "food", icon: faUtensils, label: "Food" },
];

const CreateGroupModal = ({ open, onClose, onSubmit, submitting = false, error = null }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("film"); 
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setName("");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await onSubmit?.({ name: trimmed, icon });
  }

  if (!open) return null;

  return (
    <div
      className="cg-modal__backdrop"
      ref={dialogRef}
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
    >
      <div className="cg-modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <header className="cg-modal__header">
          <div className="cg-modal__icon" aria-hidden />
          <div>
            <h3 id="create-group-title" className="cg-modal__title">Crea gruppo</h3>
            <p className="cg-modal__subtitle">Dai un nome al tuo nuovo gruppo</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="cg-modal__form">
          <label className="cg-field">
            <span className="cg-label">Nome gruppo</span>
            <input
              ref={inputRef}
              className="cg-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. CineClub, BookWorms, Squad Goals…"
              maxLength={60}
              disabled={submitting}
              required
            />
          </label>
          
          {/* Picker icone */}
          <div className="cg-field">
            <span className="cg-label">Icona gruppo</span>
            <div className="cg-icons">
              {ICONS.map((i) => (
                <button
                  type="button"
                  key={i.key}
                  className={`cg-icon-btn ${icon === i.key ? "active" : ""}`}
                  onClick={() => setIcon(i.key)}
                  disabled={submitting}
                >
                  <FontAwesomeIcon icon={i.icon} />
                  <span className="cg-icon-label">{i.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error ? <div className="cg-error" role="alert">{error}</div> : null}

          <div className="cg-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!name.trim() || submitting}
            >
              {submitting ? <span className="cg-spinner" aria-label="Creazione…" /> : "Crea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
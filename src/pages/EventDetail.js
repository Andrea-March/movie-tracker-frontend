import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EventDetail.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock, faMapMarkerAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getEvent } from "../services/eventService";
import { stateStore } from "../stores/StateStore";
export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvent(eventId).then(setEvent).catch(() => {
      stateStore.setError("Errore caricamento evento");
    });
  }, [eventId]);

  if (!event) return <div className="page-loading">Caricamento evento...</div>;

  const startsAt = new Date(event.startsAt).toLocaleString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  const endsAt = event.endsAt
    ? new Date(event.endsAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <section className="gd-section event-detail">
      <div className="gd-card">
        <button className="gd-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Torna indietro
        </button>

        {event.movie?.poster_path && (
          <div className="event-poster">
            <img src={event.movie.poster_path} alt={event.movie.title} />
          </div>
        )}

        <div className="event-info">
          <h2 className="event-title">{event.title}</h2>

          <div className="event-meta">
            <div><FontAwesomeIcon icon={faCalendarDays} /> {startsAt}{endsAt && ` → ${endsAt}`}</div>
            {event.location && (
              <div><FontAwesomeIcon icon={faMapMarkerAlt} /> {event.location}</div>
            )}
            {event.movie?.title && (
              <div><FontAwesomeIcon icon={faClock} /> Film: <strong>{event.movie.title}</strong></div>
            )}
          </div>

          {event.createdBy && (
            <p className="event-owner">Creato da {event.createdBy.username}</p>
          )}
        </div>
      </div>
    </section>
  );
}
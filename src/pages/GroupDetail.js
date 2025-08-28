import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { groupStore } from "../stores/GroupStore";
import InvitePanel from "../components/groups/InvitePanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils, faChevronLeft, faCalendarDays, faPlus
} from "@fortawesome/free-solid-svg-icons";
import "./GroupDetail.css";
import InviteIcon from "../components/groups/InviteIcon";

const ICONS_MAP = {
  users: faUsers,
  film: faFilm,
  book: faBook,
  gamepad: faGamepad,
  music: faMusic,
  food: faUtensils,
};

const GroupDetail = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { groupStore.fetchGroup(id); }, [id]);

  const g = groupStore.currentGroup;
  const faIcon = g?.icon && ICONS_MAP[g.icon];

  return (
     <div className="group-detail">
      <header className="gd-header">
        <button className="gd-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Indietro</span>
        </button>
      </header>

      {groupStore.currentLoading ? (
        <div className="gd-skeleton">Caricamento…</div>
      ) : !g ? (
        <div className="gd-error">Gruppo non trovato.</div>
      ) : (
        <>
          {/* HERO */}
          <section className="gd-hero">
            <div className="gd-avatar">
              {faIcon ? (
                <div className="gd-icon"><FontAwesomeIcon icon={faIcon} /></div>
              ) : (
                <img src={g.icon || "/default-group.png"} alt="" />
              )}
            </div>

            <div className="gd-meta">
              <h1 className="gd-title">{g.name}</h1>
              <p className="gd-subtitle">
                Creato da{' '}
                <strong>{g.myRole === "owner" ? "te" : (g.owner?.username || "—")}</strong> •{' '}
                {g.membersCount || g.members.length || 0} membri
              </p>

              <div className="gd-members">
                {g.members.map((m, i) => (
                  <img
                    key={m._id || i}
                    className="gd-member"
                    src={m.avatar || "/avatar.png"}
                    alt={m.username || "membro"}
                    title={m.username}
                  />
                ))}
                {true && <span className="gd-more">+{"2"}</span>}
              </div>
            </div>

            <div className="gd-actions">
              {/* pulsante invito rapido (creator/admin) */}
              {(g.myRole === "owner" || g.myRole === "admin") && (
                <InviteIcon groupId={g._id} />
              )}

            </div>
          </section>

          {/* EVENTO IN EVIDENZA */}
          {g.nextEvent ? (
            <section className="gd-section">
              <div className="gd-card gd-event">
                <div className="gd-event-body" onClick={() => navigate(`/events/${g.nextEvent._id}`)}>
                  <div className="gd-event-icon">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </div>
                  <div className="gd-event-info">
                    <div className="gd-event-title">{g.nextEvent.name || "Prossimo evento"}</div>
                    <div className="gd-event-meta">
                      {g.nextEvent.datePretty || g.nextEvent.date || ""} • {g.nextEvent.time || ""}
                    </div>
                    {g.nextEvent.movieTitle && (
                      <div className="gd-event-movie">In voto: <strong>{g.nextEvent.movieTitle}</strong></div>
                    )}
                  </div>
                  {g.nextEvent.cover && (
                    <img className="gd-event-cover" src={g.nextEvent.cover} alt="" />
                  )}
                </div>

                <div className="gd-event-actions">
                  <button
                    className="gd-btn gd-btn-primary"
                    onClick={() => navigate(`/events/${g.nextEvent._id}`)}
                  >
                    Vai all’evento
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="gd-section">
              <div className="gd-card gd-empty">
                Nessun evento in programma.
                {(g.myRole === "owner" || g.myRole === "admin") && (
                  <button
                    className="gd-btn gd-btn-primary gd-empty-cta"
                    onClick={() => navigate(`/groups/${g._id}/events/new`)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Crea evento</span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* LISTA FILM DEL GRUPPO */}
          <section className="gd-section">
            <div className="gd-section-head">
              <h2 className="gd-h2">Film da vedere</h2>
              <div className="gd-section-actions">
                <button className="gd-btn gd-btn-ghost" onClick={() => navigate('/search')}>
                  Aggiungi
                </button>
              </div>
            </div>

            {g.watchlist.length === 0 ? (
              <div className="gd-card gd-empty">La lista è vuota. Aggiungi un film dalla ricerca.</div>
            ) : (
              <ul className="gd-list">
                {g.watchlist.map((m, idx) => (
                  <li key={m.id || m._id || idx} className="gd-list-item" onClick={() => navigate(`/movie/${m.id || m._id}`)}>
                    <img className="gd-poster" src={m.poster || "/poster.png"} alt="" />
                    <div className="gd-li-main">
                      <div className="gd-li-title">{m.title}</div>
                      <div className="gd-li-meta">
                        {(m.year || '').toString()} {m.runtime ? `• ${m.runtime} min` : ''}
                      </div>
                    </div>
                    <div className="gd-li-actions">
                      <span className="gd-chevron">›</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

         {/* 
          {(g.myRole === "owner" || g.myRole === "admin") && (
            <section className="gd-section">
              <h2 className="gd-h2">Inviti</h2>
              <InvitePanel groupId={g._id} />
            </section>
          )} */}
        </>
      )}
    </div>
  );
});

export default GroupDetail;
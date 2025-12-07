import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { groupStore } from "../stores/GroupStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils, faChevronLeft, faCalendarDays, faPlus
} from "@fortawesome/free-solid-svg-icons";
import "./GroupDetail.css";
import InviteIcon from "../components/groups/InviteIcon";
import GroupMovieDetail from "../components/groups/GroupMovieDetail";

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

  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(undefined);

  useEffect(() => { groupStore.fetchGroup(id); }, [id]);

  const g = groupStore.currentGroup;
  const faIcon = g?.icon && ICONS_MAP[g.icon];

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("it-IT", {
      weekday: "short",  // ven
      day: "numeric",    // 26
      month: "long",     // settembre
      year: "numeric",   // 2025
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

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
                {g.members.slice(0,3).map((m, i) => (
                  <img
                    key={m._id || i}
                    className="gd-member"
                    src={m.avatar || "/avatar.png"}
                    alt={m.username || "membro"}
                    title={m.username}
                  />
                ))}
                {g.members.length > 3 && <span className="gd-more">+{g.members.length - 3}</span>}
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
              <div className="gd-card gd-event" onClick={() => navigate(`/events/${g.nextEvent._id}`)}>
                {g.nextEvent.movie?.poster_path && (
                  <div className="gd-event-poster">
                    <img src={g.nextEvent.movie.poster_path} alt={g.nextEvent.movie.title} />
                  </div>
                )}

                <div className="gd-event-content">
                  <div className="gd-event-header">
                    <h3 className="gd-event-title">
                      {g.nextEvent.title || "Prossimo evento"}
                    </h3>
                    <div className="gd-event-date">
                      <FontAwesomeIcon icon={faCalendarDays} /> {formatDateTime(g.nextEvent.startsAt)}
                    </div>
                  </div>

                  <div className="gd-event-meta">
                    {g.nextEvent.time && <span>{g.nextEvent.time}</span>}
                    {g.nextEvent.location && (
                      <span className="gd-event-location">📍 {g.nextEvent.location}</span>
                    )}
                  </div>

                  {g.nextEvent.movie?.title && (
                    <div className="gd-event-movie">
                      In programma: <strong>{g.nextEvent.movie.title}</strong>
                    </div>
                  )}

                  <div className="gd-event-actions">
                    <button
                      className="gd-btn gd-btn-primary"
                      onClick={() => navigate(`/events/${g.nextEvent._id}`)}
                    >
                      Vai all’evento
                    </button>
                  </div>
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
                  <li key={m.id || m._id || idx} className="gd-list-item" onClick={() => {setSelectedSnapshot(m.snapshot); setShowMovieDetail(true)}} >
                    <img
                      className="gd-poster"
                      srcSet={`https://image.tmdb.org/t/p/w200/${m.snapshot.poster.split("/")[6]} 200w, 
                      https://image.tmdb.org/t/p/w400/${m.snapshot.poster.split("/")[6]} 400w`} 
                      sizes="(max-width: 768px) 200px, 400px"
                      alt={m.title}
                      loading="lazy"
                    />
                    <div className="gd-li-main">
                      <div className="gd-li-title">{m.snapshot.title}</div>
                      <div className="gd-li-meta">
                        {(m.snapshot.year || '').toString()} {m.snapshot.runtime ? `• ${m.snapshot.runtime} min` : ''}
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
          {showMovieDetail && <GroupMovieDetail movie={selectedSnapshot} setShowMovieDetail={setShowMovieDetail}/>}

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
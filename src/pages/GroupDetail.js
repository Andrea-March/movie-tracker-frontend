import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { groupStore } from "../stores/GroupStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils, faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import "./GroupDetail.css";

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
          <FontAwesomeIcon icon={faChevronLeft} /> <span>Indietro</span>
        </button>
      </header>

      {groupStore.currentLoading ? (
        <div className="gd-skeleton">Caricamento…</div>
      ) : !g ? (
        <div className="gd-error">Gruppo non trovato.</div>
      ) : (
        <>
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
                Creato da <strong>{g.myRole === "owner" ? "te" : g.owner || "—"}</strong> • {g.membersCount || 0} membri
              </p>

              <div className="gd-actions">
                <button className="btn btn-primary" onClick={() => groupStore.joinGroup(g._id)}>Join</button>
                <button className="btn btn-ghost" onClick={() => groupStore.leaveGroup(g._id)}>Leave</button>
              </div>
            </div>
          </section>

          <section className="gd-section">
            <h2 className="gd-h2">Attività</h2>
            <div className="gd-cards">
              <div className="gd-card">Prossime iniziative…</div>
              <div className="gd-card">Chat/Note…</div>
            </div>
          </section>
        </>
      )}
    </div>
  );
});

export default GroupDetail;
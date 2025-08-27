import "./GroupCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const ICONS_MAP = {
  users: faUsers,
  film: faFilm,
  book: faBook,
  gamepad: faGamepad,
  music: faMusic,
  food: faUtensils,
};

const GroupCard = ({ group, onJoin, onDecline }) => {
  const navigate = useNavigate();
  const goToDetail = () => navigate(`/groups/${group.groupId}`);
    const faIcon = ICONS_MAP[group.icon];

    useEffect(()=>{console.log(group)},[])

  return (
    <article className="group-card" role="group" aria-label={group.name} onClick={goToDetail}>
      <div className="group-card__head">
        {faIcon ? (
          <div className="group-avatar icon-avatar">
            <FontAwesomeIcon icon={faIcon} />
          </div>
        ) : (
          <img src={group.icon || "/default-group.png"} alt="" className="group-avatar" />
        )}
        <div className="group-info">
          <h3 className="group-name" title={group.name}>{group.name}</h3>
          {group.myRole !== "owner" && <p className="group-meta">
                Invitato da {group.ownerName || "—"} • {group.membersCount || 0} membri
            </p>
           }
        </div>
      </div>

      <div className="accent-bar" aria-hidden />

      <div className="group-actions">
        <button
          className="btn btn-join"
          onClick={(e) => { e.stopPropagation(); onJoin(group.groupId); }}
        >
          Join
        </button>
        <button
          className="btn btn-decline"
          onClick={(e) => { e.stopPropagation(); onDecline(group.groupId); }}
        >
          Decline
        </button>
      </div>
    </article>
  );
};

export default GroupCard;

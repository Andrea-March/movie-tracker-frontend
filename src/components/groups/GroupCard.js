import "./GroupCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faFilm, faBook, faGamepad, faMusic, faUtensils } from "@fortawesome/free-solid-svg-icons";

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


  return (
    <article className="group-card" role="group" aria-label={group.name} onClick={goToDetail}>
      <div className="group-card__head">
        {faIcon ? (
          <div className="group-avatar icon-avatar">
            <FontAwesomeIcon icon={faIcon} />
          </div>
        ) : (
          <img src={group.icon || "/popcorn.png"} alt="" className="group-avatar" />
        )}
      </div>
      <div className="group-info">
          <h3 className="group-name" title={group.name}>{group.name}</h3>
          <p className="group-meta">
                {/* Invitato da {group.myRole === "owner" ? "te" : group.owner || "—"} • {group.membersCount || 0} membri */}
                {group.membersCount || 0} membri
          </p>
           
      </div>

      <div className="group-actions">
        {/* <button
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
        </button> */}
      </div>
    </article>
  );
};

export default GroupCard;

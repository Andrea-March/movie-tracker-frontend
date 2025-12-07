import './SubNavbar.css'
import { movieStore } from "../stores/MovieStore";
import { observer } from 'mobx-react-lite';

const SubNavbar = () => {
  const { activePage } = movieStore;

  // indice del thumb nel segmented (0 = Visti, 1 = Da Vedere)
  const segIndex = activePage === "toWatch" ? 1 : 0;

  return (
    <div className="sub-navbar justify-center">
      {/* <button
        className={`ghost ${activePage === "explore" ? "is-active" : ""}`}
        onClick={() => movieStore.setActivePage("explore")}
      >
        Esplora
      </button>
 */}
      <div className="segmented" data-index={segIndex}>
        <span
          className="thumb"
          style={{ transform: `translateX(${segIndex * 100}%)` }}
          aria-hidden="true"
        />
        <button
          className={`seg-btn ${segIndex === 0 ? "is-active" : ""}`}
          onClick={() => movieStore.setActivePage("watched")}
        >
          Visti
        </button>
        <button
          className={`seg-btn ${segIndex === 1 ? "is-active" : ""}`}
          onClick={() => movieStore.setActivePage("toWatch")}
        >
          Da Vedere
        </button>
      </div>
    </div>
  );
};

export default observer(SubNavbar);
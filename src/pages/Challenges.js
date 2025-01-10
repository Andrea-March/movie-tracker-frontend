import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChallenges, getUserBadges } from "../services/challengesservice";
import '../App.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengesData = await getChallenges(); // Usa il service per ottenere le sfide
        setChallenges(challengesData);

        const badgesData = await getUserBadges(); // Usa il service per ottenere i badge
        setBadges(badgesData);
      } catch (error) {
        console.error("Errore durante il recupero delle sfide e dei badge", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [token]);

  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  return (
    <div className="content">
      <h1>Le tue Sfide e Badge</h1>

      {loading ? (
        <p>Caricamento...</p>
      ) : (
        <>

          <div className="challenges">
            <h2>Le tue Sfide Attive</h2>
            <div className="challenge-list">
              {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <div
                    className="challenge-card"
                    key={challenge.challengeId}
                    onClick={() => handleChallengeClick(challenge.challengeId)}
                  >
                    <h3>{challenge.title}</h3>
                    <p>{challenge.theme}</p>
                    <p>Obiettivo: {challenge.goal}</p>
                    <p>Data di fine: {new Date(challenge.endDate).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>Non ci sono sfide attive al momento.</p>
              )}
            </div>
          </div>

          <div className="badges">
            <h2>Badge Vinti</h2>
            <div className="badge-list">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <div className="badge" key={badge.id}>
                    <img src={badge.image} alt={badge.name} />
                    <p>{badge.name}</p>
                  </div>
                ))
              ) : (
                <p>Non hai ancora vinto badge.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Challenges;
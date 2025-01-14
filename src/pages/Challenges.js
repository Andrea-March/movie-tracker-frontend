import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChallenges, getUserBadges } from "../services/challengesservice";
import '../App.css';
import './Challenges.css'
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faJoint, faRocket } from "@fortawesome/free-solid-svg-icons";

const Challenges = () => {
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
 /*  const [badges, setBadges] = useState([]); */
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const challengesData = await getChallenges(); // Usa il service per ottenere le sfide
        console.log(challengesData)
        setAvailableChallenges(challengesData.availableChallenges);
        setJoinedChallenges(challengesData.joinedChallenges);

        /* const badgesData = await getUserBadges(); // Usa il service per ottenere i badge
        setBadges(badgesData); */
      } catch (error) {
        console.error("Errore durante il recupero delle sfide e dei badge", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  },[]);

  const handleChallengeClick = (challengeId) => {
    navigate(`${challengeId}`);
  };

  const handleJoinChallenge = () => {

  }

  return (
    <div className="content ch-content">
      <h1>Le tue Sfide e Badge</h1>

      {loading ? (
        <Loader />
      ) : (
        <>

          <div className="challenges">

          <h2>Sfide a cui partecipi</h2>
              <div className="challenge-lsit">
              {joinedChallenges.length > 0 ? (
                joinedChallenges.map((challenge) => (
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
                <p>Non partecipi ad alcuna sfida al momento.</p>
              )}
            </div>
            <h2>Sfide Disponibili</h2>
            <div className="challenge-list">
              {availableChallenges.length > 0 ? (
                availableChallenges.map((challenge) => (
                  <div
                    className="challenge-card flex-column"
                    key={challenge.challengeId}
                    onClick={() => handleChallengeClick(challenge.challengeId)}
                  >
                    <h3>{challenge.title}</h3>
                    <p>{challenge.theme}</p>
                    <p>Obiettivo: {challenge.goal}</p>
                    <p>Data di fine: {new Date(challenge.endDate).toLocaleDateString()}</p>
                    <FontAwesomeIcon onClick={handleJoinChallenge} icon={faRocket} className="challenge-join-icon" size="2x" /> 
                  </div>
                ))
              ) : (
                <p>Non ci sono nuove sfide attive al momento.</p>
              )}
              </div>
              
          </div>

         {/*  <div className="badges">
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
          </div> */}
        </>
      )}
    </div>
  );
};

export default Challenges;
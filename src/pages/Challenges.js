import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChallenges, joinChallenge } from "../services/challengesservice";
import '../App.css';
import './Challenges.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassEnd, faRocket } from "@fortawesome/free-solid-svg-icons";
import ChallengeSubNavbar from "../components/ChallengesSubNavbar";

const Challenges = () => {
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [badges, setBadges] = useState([]);

  const navigate = useNavigate();

  const types = {
    JOINED_CHALLENGES: "joined",
    AVAILABLE_CHALLENGES: "available",
    BADGES: "badges"
  }

  const[component, setComponent] = useState(types.JOINED_CHALLENGES)



  useEffect(() => {
    setBadges([])
    const fetchChallenges = async () => {
      try {
        const challengesData = await getChallenges(); // Usa il service per ottenere le sfide
        setAvailableChallenges(challengesData.availableChallenges);
        setJoinedChallenges(challengesData.joinedChallenges);

        /* const badgesData = await getUserBadges(); // Usa il service per ottenere i badge
        setBadges(badgesData); */
      } catch (error) {
        console.error("Errore durante il recupero delle sfide e dei badge", error);
      } 
    };

    fetchChallenges();
  },[]);

  const handleChallengeClick = (challengeId) => {
    navigate(`${challengeId}`);
  };

  const handleJoinChallenge = async (event, challengeId) => {
    event.stopPropagation();
      try{
        await joinChallenge(challengeId);
        handleChallengeClick(challengeId);
        /* window.location.reload(); */
      }catch(err){
        console.log(err)
      }
  }

  return (
    <>
    <ChallengeSubNavbar setComponent={setComponent}/>
    <div className="content ch-content">
          <div className="challenges">

          { component === types.JOINED_CHALLENGES && 
                <div className="challenge-list">
                {joinedChallenges.length > 0 ? (
                  joinedChallenges.map((challenge) => (
                    <div
                      className="challenge-card flex-row"
                      key={challenge.challengeId}
                      onClick={() => handleChallengeClick(challenge.challengeId)}
                    >
                      <img src="https://picsum.photos/id/237/200/300" alt="challenge card" style={{width: "100px", height: "150px"}}/>
                      <div className="flex-column width-100 margin-left-10">
                        <h3>{challenge.title}</h3>
                        <p>{challenge.theme}</p>
                        <p><FontAwesomeIcon icon={faHourglassEnd} size="lg" className="margin-right-10"/> 
                          {new Date(challenge.endDate).toLocaleDateString("it-IT", {day: "numeric", month: "long", year: "numeric"})}
                        </p>
                      </div>  
                    </div>
                  ))
                ) : (
                  <p>Non partecipi ad alcuna sfida al momento.</p>
                )}
              </div>
          }
            
            { component === types.AVAILABLE_CHALLENGES && 
            <div className="challenge-list">
              {availableChallenges.length > 0 ? (
                availableChallenges.map((challenge) => (
                  <div
                    className="challenge-card flex-row"
                    key={challenge.challengeId}
                    onClick={() => handleChallengeClick(challenge.challengeId)}
                  >
                     <img src="https://picsum.photos/id/237/200/300" alt="challenge card" style={{width: "100px", height: "150px"}}/>
                     <div className="flex-column width-100 margin-left-10">
                        <h3>{challenge.title}</h3>
                        <p>{challenge.theme}</p>
                      {/*  <p>Obiettivo: {challenge.goal}</p> */}
                        <p>Data di fine: {new Date(challenge.endDate).toLocaleDateString()}</p>
                        <FontAwesomeIcon onClick={(e)=>{handleJoinChallenge(e, challenge.challengeId)}} icon={faRocket} className="challenge-join-icon" size="2x" /> 
                    </div>
                  </div>
                ))
              ) : (
                <p>Non ci sono nuove sfide attive al momento.</p>
              )}
              </div>

          }
          </div>
          { component === types.BADGES &&
          <div className="badges">
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
          }
    </div>
    </>
  );
};

export default Challenges;
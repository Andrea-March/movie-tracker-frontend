import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroupByToken } from "../../services/groupsService";

export default function JoinRedirect() {
  const { token } = useParams();
  console.log(token)
  const navigate = useNavigate();

  useEffect(() => {
    
    let alive = true;
    (async () => {
      try {
        const res = await joinGroupByToken(token); // { group }
        if (!alive) return;
        navigate(`/groups/${res.groupId}`, { replace: true });
      } catch (e) {
        if (!alive) return;
        alert(e.message || "Invito non valido");   // sostituisci con il tuo toast
        navigate("/groups", { replace: true });
      }
    })();
    return () => { alive = false; };
  }, [token]);

  return <div style={{padding:16}}>Sto entrando nel gruppo…</div>;
}
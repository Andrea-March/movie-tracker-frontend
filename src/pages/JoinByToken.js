import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/httpClient";              
import { joinGroupByToken } from "../services/groupsApi"; 

export default function JoinByToken() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);


  useEffect(()=> {
    let ok = true;
    (async () => {
      try {
        const res = await api.post(`/groups/join/${token}`);
        if (ok) setPreview(res.data);
      } catch (e) {
        setError(e?.response?.data?.error || "Invito non valido");
      } finally {
        setLoading(false);
      }
    })();
    return ()=>{ ok = false; };
  }, [token]);

  async function handleJoin() {
    setLoading(true); setError(null);
    try {
      const data = await joinGroupByToken(token); // POST /invite/:token/join
      navigate(`/groups/${data.group}`);          // data.group = id del gruppo (adatta se diverso)
    } catch (e) {
      setError(e.message || "Errore join");
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">Caricamento…</div>;

  return (
    <div style={{margin:"16px",background:"var(--card)",border:"1px solid var(--line)",borderRadius:16,padding:"16px"}}>
      <h1 className="gd-h2" style={{marginTop:0}}>Unisciti al gruppo</h1>

      {error && (
        <div style={{marginTop:8,background:"var(--error-bg,#FFBABA)",borderRadius:12,padding:"10px"}}>
          {error}
        </div>
      )}

      {preview && (
        <p style={{color:"var(--muted)"}}>
          Scadenza: {new Date(preview.expiresAt).toLocaleString()} ·
          Usi rimasti: {Math.max(preview.remainingUses,0)}
        </p>
      )}

      <button onClick={handleJoin} disabled={preview && !preview.valid}
        style={{marginTop:12,width:"100%",background:"var(--brand)",color:"#111",border:"0",borderRadius:16,padding:"12px",fontWeight:600}}>
        {preview && !preview.valid ? "Invito non valido" : "Unisciti al gruppo"}
      </button>
    </div>
  );
}
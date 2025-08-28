import { useState } from "react";
import { generateInviteToken } from "../../services/groupsApi"; // <-- il file dove hai le API sopra

export default function InvitePanel({ groupId }) {
  const [maxUses, setMaxUses] = useState(1);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);

  async function createInvite() {
    setLoading(true); setError(null);
    try {
      const expiresAt = new Date(Date.now() + days*24*60*60*1000).toISOString();
      const data = await generateInviteToken(groupId, maxUses, expiresAt);
      setInvite(data);
    } catch (e) {
      setError(e.message || "Errore creazione invito");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); alert("Copiato!"); }
    catch { alert("Copia fallita"); }
  }

  return (
    <div className="invite-panel" style={{background:"var(--card)",border:"1px solid var(--line)",borderRadius:"16px",padding:"16px"}}>
      <h3 style={{color:"var(--text)",margin:0}}>Invita membri</h3>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"12px"}}>
        <label style={{fontSize:"0.9rem",color:"var(--muted; max-width: 100px;)"}}>
          Max utilizzi
          <input type="number" min="1" max="50" value={maxUses}
            onChange={(e)=>setMaxUses(parseInt(e.target.value||"1"))}
            style={{width:"100%",marginTop:6,background:"var(--card-2)",border:"1px solid var(--line)",borderRadius:12,padding:"8px",color:"var(--text)"}} />
        </label>
        <label style={{fontSize:"0.9rem",color:"var(--muted)", maxWidth: "150px",}}>
          Scade tra (giorni)
          <input type="number" min="1" max="30" value={days}
            onChange={(e)=>setDays(parseInt(e.target.value||"7"))}
            style={{width:"100%",marginTop:6,background:"var(--card-2)",border:"1px solid var(--line)",borderRadius:12,padding:"8px",color:"var(--text)"}} />
        </label>
      </div>

      <button onClick={createInvite} disabled={loading}
        style={{marginTop:12,width:"100%",background:"var(--brand)",color:"#111",border:"0",borderRadius:16,padding:"10px 14px",fontWeight:600,opacity:loading?.7:1}}>
        {loading ? "Creazione…" : "Crea link invito"}
      </button>

      {error && (
        <div style={{marginTop:12,background:"var(--error-bg,#FFBABA)",borderRadius:12,padding:"10px",color:"var(--text)"}}>
          {error}
        </div>
      )}

      {invite && (
        <div style={{marginTop:12,background:"var(--card-2)",border:"1px solid var(--line)",borderRadius:12,padding:"10px"}}>
          <div style={{fontSize:"0.9rem",color:"var(--muted)"}}>
            Scade il <strong>{new Date(invite.expiresAt).toLocaleString()}</strong> · Utilizzi: <strong>{invite.maxUses}</strong>
          </div>
          <div style={{marginTop:8,wordBreak:"break-all",fontSize:"0.9rem"}}>{invite.link}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>copy(invite.link)} style={{background:"var(--navbar)",border:"1px solid var(--line)",borderRadius:12,padding:"8px 10px"}}>
              Copia link
            </button>
            <button onClick={()=>copy(invite.token)} style={{background:"var(--navbar)",border:"1px solid var(--line)",borderRadius:12,padding:"8px 10px"}}>
              Copia token
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { generateInviteToken } from "../../services/groupsApi"; // <-- il file dove hai le API sopra
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InviteIcon({ groupId }) {
 /*  const [maxUses, setMaxUses] = useState(1);
  const [days, setDays] = useState(7); */

  const [loading, setLoading] = useState(false);

  async function createInvite() {
    setLoading(true);
    try {
      const expiresAt = new Date(Date.now() + 7*24*60*60*1000).toISOString();
      const data = await generateInviteToken(groupId, 10, expiresAt);
      copy(data.link)
    } catch (e) {
      console.log("Errore nella creazione del token di invito: " + e.message)
    } finally {
      setLoading(false);
    }
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch { console.log("Copia fallita"); }
  }

  return (
    <button
        className="gd-btn gd-btn-ghost"
        onClick={createInvite}
        title="Copia link invito"
        disabled={loading}
      >
          <FontAwesomeIcon icon={faLink} />
          <span>Invita</span>
    </button>
  );
}
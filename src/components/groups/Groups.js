import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { groupStore } from "../../stores/GroupStore";
import GroupCard from "./GroupCard";
import CreateGroupModal from "./CreateGroupModal";
import "./Groups.css";


const Groups = observer(() => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    groupStore.fetchGroups();
  }, []);

  async function handleCreate({name, icon}) {
    try {
      setSubmitError(null);
      setSubmitting(true);
      await groupStore.createGroup({ name, icon });
      // se la create va a buon fine, lo store chiude già: groupStore.creating = false
    } catch (e) {
      setSubmitError(e?.message || "Errore creazione gruppo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="groups-page">
      <header className="groups-header">
        <div className="groups-title">
          <div className="title-icon" aria-hidden />
          <div>
            <h2>I tuoi gruppi</h2>
            <p className="subtitle">Gruppi a cui partecipi</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => groupStore.startCreating()}>
            + Crea
          </button>
        </div>
      </header>

      <main className="groups-content">
        {groupStore.groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden />
            <h3>Non sei ancora in nessun gruppo</h3>
            <p>Crea un gruppo o accetta un invito per iniziare.</p>
            <button className="btn btn-primary" onClick={() => groupStore.startCreating()}>
              Crea il tuo primo gruppo
            </button>
          </div>
        ) : (
          <div className="groups-grid flex-wrap justify-center">
            {groupStore.groups.map((g) => (
              <GroupCard
                key={g.groupId}
                group={g}
                onJoin={groupStore.joinGroup}
                onDecline={groupStore.leaveGroup}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modale */}
      <CreateGroupModal
        open={groupStore.creating}
        onClose={() => groupStore.stopCreating()}
        onSubmit={handleCreate}
        submitting={submitting}
        error={submitError}
      />
    </div>
  );
});
export default Groups;
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {api} from '../services/httpClient';
import './CreateEventPage.css';
import { groupStore } from "../stores/GroupStore";

export default function CreateEventPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const group = groupStore.currentGroup;
  const [form, setForm] = useState({
    title: "",
    movieId: "",
    startsAt: "",
    endsAt: "",
    location: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post(`/groups/${groupId}/events`, form);
      navigate(`/groups/${groupId}`); // redirect alla pagina gruppo
    } catch (err) {
      alert("Errore creazione evento");
    }
  };

  return (
    <div className="create-event-page">
      <h2>Crea un evento</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Titolo *
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Film *
          <select name="movieId" value={form.movieId} onChange={handleChange} required>
            <option value="">-- Seleziona --</option>
            {group.watchlist.map(w => (
              <option key={w.movie} value={w.movie}>
                {w.snapshot.title} ({w.snapshot.year})
              </option>
            ))}
          </select>
        </label>

        <label>
          Inizio *
          <input type="datetime-local" name="startsAt" value={form.startsAt} onChange={handleChange} required />
        </label>

        <label>
          Fine
          <input type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange} />
        </label>

        <label>
          Luogo
          <input type="text" name="location" value={form.location} onChange={handleChange} />
        </label>

        <button type="submit">Crea evento</button>
      </form>
    </div>
  );
}
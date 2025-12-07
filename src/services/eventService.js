import { api } from "./httpClient"; 

// Recupera il dettaglio di un evento
export async function getEvent(eventId) {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
}

// Recupera tutti gli eventi futuri di un gruppo
export async function getGroupEvents(groupId, { from } = {}) {
  const params = {};
  if (from) params.from = from; // es: new Date().toISOString()
  const res = await api.get(`/groups/${groupId}/events`, { params });
  return res.data; // array di eventi
}

// Crea un nuovo evento
export async function createEvent(groupId, payload) {
  const res = await api.post(`/groups/${groupId}/events`, payload);
  return res.data;
}

// Aggiorna un evento esistente
export async function updateEvent(eventId, payload) {
  const res = await api.put(`/events/${eventId}`, payload);
  return res.data;
}

// Elimina un evento
export async function deleteEvent(eventId) {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
}
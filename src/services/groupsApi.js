import { api } from "./httpClient";

// Util per estrarre messaggio d'errore coerente
function normalizeError(err, fallback) {
  return new Error(err?.response?.data?.error || err?.message || fallback);
}

// === FUNZIONI USATE DALLO STORE ===

// GET /groups?q=...
export async function fetchGroups({ q } = {}) {
  try {
    const res = await api.get("/groups", { params: q ? { q } : undefined });
    return res.data; // array di gruppi
  } catch (err) {
    throw normalizeError(err, "Errore nella chiamata gruppi");
  }
}

export async function fetchGroupsDropdown({ q } = {}) {
  try {
    const res = await api.get("/groups/dropdown");
    return res.data; // array di gruppi
  } catch (err) {
    throw normalizeError(err, "Errore nella chiamata gruppi");
  }
}

export async function fetchGroupById(groupId) {
  try {
    const res = await api.get(`/groups/${groupId}`,
       {params: { include: "members,watchlist" }}
    );
    console.log(res.data)
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel recupero del gruppo");
  }
}
// POST /groups/:id/join
export async function joinGroup(groupId) {
  try {
    const res = await api.post(`/groups/${groupId}/join`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel join del gruppo");
  }
}

// POST /groups/:id/leave  (se il tuo backend usa DELETE /groups/:id/members/me, adatta qui)
export async function leaveGroup(groupId) {
  try {
    const res = await api.post(`/groups/${groupId}/leave`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore nel lasciare/declinare il gruppo");
  }
}

// POST /groups  (accetta sia { name } sia payload esteso)
export async function createGroup(payload) {
  try {
    const body = typeof payload === "string" ? { name: payload } : payload;
    const res = await api.post(`/groups`, body);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore creazione gruppo");
  }
}

// === LE TUE FUNZIONI ESISTENTI (compatibilità) ===

// GET /groups (solo alias: utile se in altre parti del codice usi già fetchUserGroups)
export async function fetchUserGroups() {
  try {
    const res = await api.get(`/groups`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Devi essere loggato per vedere i gruppi.");
  }
}

// GET /groups/:id/movies
export async function fetchGroupMovies(groupId) {
  try {
    const res = await api.get(`/groups/${groupId}/movies`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore fetching film del gruppo");
  }
}

// POST /groups/:id/movies { movieId }
export async function addMovieToGroup(groupId, movie) {
  try {
    const res = await api.post(`/groups/${groupId}/watchlist`, { movie });
    return res.data;
  } catch (err) {
    throw normalizeError(err, "Errore aggiunta film al gruppo");
  }
}

// POST /groups/:id/invite { maxUses, expiresAt }
export async function generateInviteToken(groupId, maxUses = 1, expiresAt = null) {
  try {
    const res = await api.post(`/groups/${groupId}/invite`, { maxUses, expiresAt });
    return res.data; // { link, token, maxUses, expiresAt }
  } catch (err) {
    throw normalizeError(err, "Errore generazione invito");
  }
}

// POST /groups/join/:token
export async function joinGroupByToken(inviteToken) {
  try {
    const res = await api.post(`/groups/join/${inviteToken}`);
    return res.data; // { message, group }
  } catch (err) {
    throw normalizeError(err, "Errore join gruppo");
  }
}
import { makeAutoObservable, runInAction } from "mobx";
import * as groupsApi from "../services/groupsApi";

class GroupStore {
  groups = [];
  loading = false;
  error = null;

  currentGroup = null;
  currentLoading = false;

  // UI state opzionale
  creating = false;
  query = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setQuery(q) {
    this.query = q;
  }

  startCreating() {
    this.creating = true;
    // qui potresti aprire un modal, oppure navigare /groups/new
    // es: uiStore.openModal("createGroup")
  }

  stopCreating() {
    this.creating = false;
  }

  async fetchGroups() {
    this.loading = true;
    this.error = null;

    try {
      const data = await groupsApi.fetchGroups({ q: this.query });
      runInAction(() => {
        // normalizza un minimo per sicurezza
        this.groups = (data.items || []).map(g => ({
          groupId: g.groupId,
          name: g.name,
          ownerName: g.ownerName ?? "—",
          membersCount: Number(g.membersCount ?? 0),
          icon: g.icon ?? "/default-group.png",
          category: g.category || "fa-users",
          status: g.status || "invited", // es: invited | member
          myRole: g.myRole || undefined
        }));
      });
    } catch (err) {
      runInAction(() => { this.error = err?.message || "Errore di rete"; });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  async fetchGroup(groupId) {
  this.currentLoading = true;
  this.error = null;
  try {
    const data = await groupsApi.fetchGroupById(groupId);
    runInAction(() => { this.currentGroup = data; });
  } catch (err) {
    runInAction(() => { this.error = err?.message || "Errore caricamento gruppo"; });
  } finally {
    runInAction(() => { this.currentLoading = false; });
  }
}

  // Join con ottimismo visivo: aggiorno subito e poi ripristino se fallisce
  async joinGroup(groupId) {
    const idx = this.groups.findIndex(g => g._id === groupId);
    if (idx === -1) return;

    const prev = this.groups[idx];
    const optimistic = { ...prev, status: "member", membersCount: (prev.membersCount || 0) + 1 };
    this.groups.splice(idx, 1, optimistic);

    try {
      await groupsApi.joinGroup(groupId);
      // opzionale: refetch o lasciare ottimistico
      // await this.fetchGroups();
    } catch (err) {
      // rollback
      this.groups.splice(idx, 1, prev);
      this.error = err?.message || "Impossibile unirti al gruppo";
    }
  }

  // Decline/leave: rimuove l’invito o esce dal gruppo
  async leaveGroup(groupId) {
    const idx = this.groups.findIndex(g => g._id === groupId);
    if (idx === -1) return;

    const prev = this.groups[idx];
    // ottimistico: tolgo dalla lista
    this.groups.splice(idx, 1);

    try {
      await groupsApi.leaveGroup(groupId);
      // opzionale: await this.fetchGroups();
    } catch (err) {
      // rollback
      this.groups.splice(idx, 0, prev);
      this.error = err?.message || "Impossibile lasciare/declinare";
    }
  }

  // Facoltativo: crea un gruppo
  async createGroup(payload) {
    this.loading = true;
    this.error = null;
    try {
      const created = await groupsApi.createGroup(payload);
      runInAction(() => {
        this.fetchGroups()
        this.creating = false;
      });
    } catch (err) {
      runInAction(() => { this.error = err?.message || "Errore creazione gruppo"; });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }
}

export const groupStore = new GroupStore();
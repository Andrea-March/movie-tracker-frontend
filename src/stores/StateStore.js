import { makeAutoObservable, runInAction } from "mobx";

class StateStore {

  
    successMessage = "";  
    error = "";
    loading = false;



    constructor() {
      makeAutoObservable(this, {}, { autoBind: true });
    }

    setSuccess(msg) { this.successMessage = msg }
    clearSuccess() { this.successMessage = "" }
    setError(msg) { this.error = msg }
    clearError() { this.error = "" }
    startLoading(){ this.loading=true }
    stopLoading(){ this.loading=false }
}


export const stateStore = new StateStore();
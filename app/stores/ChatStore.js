import {action, makeAutoObservable, observable} from 'mobx';

class ChatStore {
    isSideOpen = false;

    constructor() {
        makeAutoObservable(this);
    }

    setSideOpen(flag) {
        this.isSideOpen = flag;
    }
}

export default new ChatStore();

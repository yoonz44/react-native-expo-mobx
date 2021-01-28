import {action, observable} from 'mobx';

class ChatStore {
    @observable isSideOpen = false;

    @action setSideOpen(flag) {
        this.isSideOpen = flag;
    }
}

export default new ChatStore();

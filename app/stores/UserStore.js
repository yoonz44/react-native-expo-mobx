import {action, observable} from 'mobx';

class UserStore {
    @observable token;

    constructor() {
    }

    @action setToken(token) {
        this.token = token;
    }
}

export default new UserStore();

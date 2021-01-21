import {action, observable} from 'mobx';

class UserStore {
    @observable token;

    constructor() {
        console.log(100);
    }

    @action setToken(token) {
        this.token = token;
    }
}

export default new UserStore();

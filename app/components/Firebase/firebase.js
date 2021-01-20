import * as firebase from 'firebase';
import 'firebase/auth';

import firebaseConfig from './firebaseConfig';

// Initialize Firebase App

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();

export const auth = firebase.auth();

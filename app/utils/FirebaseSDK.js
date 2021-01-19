import firebase from 'firebase';

class FirebaseSDK {
    constructor() {
        if (!firebase.apps.length) {
            //avoid re-initializing
            firebase.initializeApp({
                apiKey: "AIzaSyDpdL8G_Fszophldy4EQiSUCrnGfQrIll4",
                authDomain: "talkpic-c0298.firebaseapp.com",
                databaseURL: "https://talkpic-c0298-default-rtdb.firebaseio.com",
                projectId: "talkpic-c0298",
                storageBucket: "talkpic-c0298.appspot.com",
                messagingSenderId: "783013660901",
                appId: "1:783013660901:web:f61c1146308a1f12446c0c",
                measurementId: "G-D6GN36F0P7",
            });

            firebase
                .auth()
                .signInWithEmailAndPassword('yoonz44444@gmail.com', 'dbswlschlrh')
                .then((result) => {
                    console.log(result);
                }, (result) => {
                    console.log(result);
                })
        }
    }
}

const firebaseSDK = new FirebaseSDK();

export default firebaseSDK;

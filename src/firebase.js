import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBphKPwbvxD2UT-FbZtInfSd22EYqaliSw",
    authDomain: "maquila-s-toolkit.firebaseapp.com",
    databaseURL: "https://maquila-s-toolkit.firebaseio.com",
    projectId: "maquila-s-toolkit",
    storageBucket: "maquila-s-toolkit.appspot.com",
    messagingSenderId: "589396359059",
    appId: "1:589396359059:web:596d49d44915c3dc419a66",
    measurementId: "G-CTD1YQTF31"
};

class Firebase {
    constructor() {
        // Initialize Firebase
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    async register(name, email, password) {
        await this.auth.createUserWithEmailAndPassword(email, password);
        return this.auth.currentUser.updateProfile({
            displayName: name
        });
    }

    getCurrentUsername() {
        return this.auth.currentUser.displayName;
    }
}

export default new Firebase();
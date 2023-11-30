'user strict'
// Importa la biblioteca de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import {
    getAuth,
    setPersistence,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    browserLocalPersistence,
    browserSessionPersistence,
    signInWithRedirect,
    inMemoryPersistence
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';

// Configura tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB6C0ZD9j_WGUd0Wwrygb0EOKaYB7T6JME",
    authDomain: "fakecommerce-2022.firebaseapp.com",
    projectId: "fakecommerce-2022",
    storageBucket: "fakecommerce-2022.appspot.com",
    messagingSenderId: "568390621800",
    appId: "1:568390621800:web:061d04c4c3ca57fab579dd"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)

class Auth {
    constructor() {

        this.uid = ''

    }


    async loginWithGmail() {

        try {
            const auth = getAuth(firebaseApp);

            if (auth.currentUser) {
                console.log(auth.currentUser)
                const signResponse = await signOut(auth)
                console.log('user disconnected: ', signResponse)
                return false
            }
            else {
                await setPersistence(auth, inMemoryPersistence)
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                this.id = user
                return user
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error de inicio de sesión con Google:', errorCode, errorMessage);
        }
    }
}
export {
    Auth,
}
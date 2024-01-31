'user strict'
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
import { firebaseConfig } from './config.js';
import { StorageService } from '../model/classes/StorageService.js';
import { keySessionStorage, keysLocalStorage } from '../constants.js';

class Auth {
    constructor() {
        this.uid = ''
    }


    async loginWithGmail() {
        try {
            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            if (auth.currentUser) {
                const signResponse = await signOut(auth)
                const storage = new StorageService()
                storage.removeItem(keysLocalStorage.CART)
                console.log('user disconnected: ', signResponse)
                return false
            }
            else {
                await setPersistence(auth, browserLocalPersistence)
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                const userToken = await result.user.getIdToken();
                const sessionToken = new StorageService()
                sessionToken.sessionStorageToken(keySessionStorage.TOKEN, userToken)
                this.uid = user
                return user;
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
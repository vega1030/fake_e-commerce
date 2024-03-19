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
import { StorageService } from '../model/classes/storage/StorageService.js';
import { keySessionStorage, keysLocalStorage } from '../constants.js';

class Auth {
    constructor() {
        this.uid = ''
    }



    persistanceOfDataUserPictureAtSessionStorage() {

        const newUid = new StorageService()
        const uid = newUid.getItem(keysLocalStorage.UID)
        const picture = newUid.getItem(keysLocalStorage.PICTURE)
        const name = newUid.getItem(keysLocalStorage.NAME)
        const email = newUid.getItem(keysLocalStorage.EMAIL)
        const user = { uid, picture, name, email }
        return user

    }


    async loginWithGmail() {
        try {
            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            await setPersistence(auth, browserSessionPersistence)
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            return user;
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error de inicio de sesión con Google:', errorCode, errorMessage);
        }
    }

    async logoutWithGmail() {
        try {

            const firebaseApp = initializeApp(firebaseConfig);
            const auth = getAuth(firebaseApp);
            const signResponse = await signOut(auth)
            if (auth.currentUser) {
                console.log('user disconnected: ', signResponse)
                return false
            } else {
                console.log('user disconnected: ', signResponse)
            }
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error al cerrar sesión', errorCode, errorMessage);
        }
    }
}
export {
    Auth
}
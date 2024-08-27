'user strict'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import {
    getAuth,
    setPersistence,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    browserLocalPersistence,
    onAuthStateChanged,
    browserSessionPersistence,
    signInWithRedirect,
    inMemoryPersistence
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';
import { firebaseConfig } from './config.js';
import { StorageService } from '../model/classes/storage/StorageService.js';
import { keySessionStorage, keysLocalStorage } from '../constants.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export class Auth {
    constructor() {
        this.uid = ''
        this.user = ''
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

    async checkUserConnection() {
        try {
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    resolve(user);
                }, (error) => {
                    reject(error);
                });
            });

            if (user) {
                this.user = user;
                console.log('check User is connected:', user);
                return {
                    user:this.user,
                    state: true
                };
            } else {
                console.log(' check User is disconnected');
                return false;
            }
        } catch (error) {
            console.error('Error checking user connection:', error);
            return false;
        }
    }

    async loginWithGmail() {
        try {
            await setPersistence(auth, browserSessionPersistence)
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            this.uid = user.uid
            this.checkUserConnection()
            return user;
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error de inicio de sesión con Google:', errorCode, errorMessage);
        }
    }

    async logoutWithGmail() {
        try {

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

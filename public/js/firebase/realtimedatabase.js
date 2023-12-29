import { getDatabase, ref, set, get, push } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { firebaseConfig } from './config.js'
import { Auth } from './auth.js';

const firebaseApp = initializeApp(firebaseConfig);

class RealTimeDB {

    constructor() {
        this.idPurchase = ''
        this.purchase = ''
        this.newUid = new Auth()
        this.realTimeFavorites = ''
    }

    /* -------Purchase------- */

    async saveDataPurchase(uid, purchase) {

        try {
            const db = getDatabase();
            const newPurchaseRef = push(ref(db, `user/ ${ uid }/PURCHASES/`));
            const idPurchase = newPurchaseRef.key;

            await set(newPurchaseRef, {
                purchase
            });

            const snapshot = await get(newPurchaseRef);
            const savedData = snapshot.val();

            this.idPurchase = idPurchase
            this.purchase = savedData
            this.uid = uid

            const snapShotDb = [ {
                id: this.uid,
                purchase: this.purchase,
                idPurchase: this.idPurchase
            } ];
            return snapShotDb

        }
        catch (error) {
            console.error('Error al guardar datos:', error);
        };
    };

    async returnPurchaseRealTimeDb(uid) {
        try {
            const db = getDatabase();
            const reference = ref(db, `user/ ${ uid }/PURCHASES/`);
            const snapshot = await get(reference);

            if (snapshot.exists()) {
                const data = snapshot.val();
                this.purchase = data
                return this.purchase
            }
            else {
                console.log('no hay')
            };
        }
        catch (err) {
            console.log('error: ', err)
            throw err
        }
    }


    /* ------Favorites------ */
    async saveFavoritesRealTimeDb(uid, favorite) {
        try {
            const db = getDatabase();
            const refFavorites = ref(db, `user/ ${ uid }/FAVORITES/`);
            await set(refFavorites, favorite);
            console.log('Datos de favorito guardados con éxito.');
        }
        catch (error) {
            console.error('Error al guardar datos de favorito:', error);
        }
    }

    async returnFavoritesRealTimeDb(uid) {
        try {

            const db = getDatabase();
            const refFavorites = ref(db, `user/ ${ uid }/FAVORITES/`);
            const snapshot = await get(refFavorites)

            if (snapshot.exists()) {
                const data = snapshot.val()
                this.realTimeFavorites = data
                return this.realTimeFavorites
            }
            else {
                console.log('no hay')
            }

        } catch (err) {
            console.log('error: ', err)
            throw err
        }
    }
}

export {
    RealTimeDB
}
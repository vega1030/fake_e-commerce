import { getDatabase, ref, set, get, push } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { firebaseConfig } from './config.js'
import { Auth } from './auth.js';
import { StorageService } from '../model/classes/storage/StorageService.js';
import { keySessionStorage, keysLocalStorage } from '../constants.js';

const firebaseApp = initializeApp(firebaseConfig);

class RealTimeDB {

    constructor() {
        this.idPurchase = ''
        this.purchase = ''
        this.newUid = new StorageService()
        this.realTimeFavorites = ''
        this.cart = ''
    }

    /* -------Purchase------- */

    async saveDataPurchase( purchase) {

        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            const db = getDatabase();
            const newPurchaseRef = push(ref(db, `user/ ${ sessionStorageUid }/PURCHASES/`));
            const idPurchase = newPurchaseRef.key;

            await set(newPurchaseRef, {
                purchase
            });

            const snapshot = await get(newPurchaseRef);
            const savedData = snapshot.val();

            this.idPurchase = idPurchase
            this.purchase = savedData
            this.uid = sessionStorageUid

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

    async returnPurchaseRealTimeDb() {
        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            const db = getDatabase();
            const reference = ref(db, `user/ ${ sessionStorageUid }/PURCHASES/`);
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

    /* --------------------- */

    /* ------Favorites------ */
    async saveFavoritesRealTimeDb(favorite) {
        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            const db = getDatabase();
            const refFavorites = ref(db, `user/ ${ sessionStorageUid }/FAVORITES/`);
            await set(refFavorites, favorite);
            console.log('Datos de favorito guardados con éxito.');
        }
        catch (error) {
            console.error('Error al guardar datos de favorito:', error);
        }
    }

    async returnFavoritesRealTimeDb() {
        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            console.log(sessionStorageUid)
            const db = getDatabase();
            const refFavorites = ref(db, `user/ ${ sessionStorageUid }/FAVORITES/`);
            const snapshot = await get(refFavorites)

            if (snapshot.exists()) {
                const data = snapshot.val()
                this.realTimeFavorites = data
                console.log(' favorites realtime ',data)
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

    /* --------------------- */

    async saveCart(cart) {

        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            const db = getDatabase();
            const refCart = ref(db, `user/ ${ sessionStorageUid }/CART/`);
            await set(refCart, cart);
            console.log('Datos de carrito guardados con éxito.');
        }
        catch {
            console.error('Error al guardar datos')
        }
    }
    async returnCartRealTimeDb() {

        try {
            const sessionStorageUid = await this.newUid.getItem(keySessionStorage.UID)
            const db = getDatabase();
            const refCart = await ref(db, `user/ ${ sessionStorageUid }/CART/`);
            const snapshot = await get(refCart)
            if (snapshot.exists()) {
                const data = await snapshot.val()
                this.realTimeCart = data
                console.log('cart realitime: ', this.realTimeCart)
                return this.realTimeCart
            }
        }
        catch {
            console.error('Error al guardar datos')
        }
    }

}

export {
    RealTimeDB
}
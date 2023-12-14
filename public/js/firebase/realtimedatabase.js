import { getDatabase, ref, set, child, get, push, orderByKey, limitToLast, query, onValue } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { firebaseConfig } from './config.js'


const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

class RealTimeDB {

    constructor() {
        this.idPurchase = ''
        this.purchase = ''
        this.uid = ''
        this.realTimeFavorites = ''
    }


    async saveDataPurchase(uid, purchase) {
        try {
            const db = getDatabase();
            const newPurchaseRef = push(ref(db, `user/ ${ uid }/PURCHASES/`));
            const idPurchase = newPurchaseRef.key;

            await set(newPurchaseRef, {
                purchase
            });
            console.log(newPurchaseRef)
            const snapshot = await get(newPurchaseRef);
            const savedData = snapshot.val();

            this.idPurchase = idPurchase
            this.purchase = savedData
            this.uid = uid

            const snapShotDb = [ {
                id: this.uid,
                purchase: this.purchase,
                idPurchase: this.idPurchase
            } ]
            return snapShotDb

        } catch (error) {
            console.error('Error al guardar datos:', error);
        };
    };

    async returnPurchaseRealTimeDb() {

        try {
            const db = getDatabase();
            const reference = ref(db, `user/ ${ uid }/PURCHASES/`);
            const refQuery = query(reference, orderByKey(), limitToLast(1));
            const snapshot = await get(refQuery)
            if (snapshot.exists()) {
                const data = snapshot.val()
                return data
            }
            else {
                console.log('no hay')
            }
        } catch (err) {
            console.log('error: ', err)
            throw err
        }
    }

    async saveFavoritesRealTimeDb(uid, favorite) {
        this.uid = uid
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
            await onValue(refFavorites, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    this.realTimeFavorites = data
                    console.log(this.realTimeFavorites)
                    return this.realTimeFavorites
                }
                else {
                    console.log('no hay')
                }
            })
        } catch (err) {
            console.log('error: ', err)
            throw err
        }
    }
}




export {
    RealTimeDB
}
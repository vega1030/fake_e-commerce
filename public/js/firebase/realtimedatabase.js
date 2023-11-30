import { getDatabase, ref, set, child, get, push, orderByKey, limitToLast, query } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { Auth } from './auth.js'

const firebaseConfig = {
    apiKey: "AIzaSyB6C0ZD9j_WGUd0Wwrygb0EOKaYB7T6JME",
    authDomain: "fakecommerce-2022.firebaseapp.com",
    projectId: "fakecommerce-2022",
    storageBucket: "fakecommerce-2022.appspot.com",
    messagingSenderId: "568390621800",
    appId: "1:568390621800:web:061d04c4c3ca57fab579dd"
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);




class RealTimeDB {

    constructor() {
        this.idPurchase = ''
        this.purchase = ''
        this.uid = ''
    }


    async saveData(uid, purchase) {
        try {
            const db = getDatabase();
            const newPurchaseRef = push(ref(db, uid, 'purchases'));
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
                id: this.idPurchase,
                purchase: this.purchase,
                idPurchase: this.idPurchase
            } ]
            return snapShotDb

        } catch (error) {
            console.error('Error al guardar datos:', error);
        };
    };

    async returnRealTimeDb() {
        
        try {
            const db = getDatabase();
            const reference = ref(db, this.uid, 'purchases');
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
}



export {
    RealTimeDB
}
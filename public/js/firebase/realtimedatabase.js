import { getDatabase, ref, set, child, get, push } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';



const firebaseConfig = {
    apiKey: "AIzaSyB6C0ZD9j_WGUd0Wwrygb0EOKaYB7T6JME",
    authDomain: "fakecommerce-2022.firebaseapp.com",
    projectId: "fakecommerce-2022",
    storageBucket: "fakecommerce-2022.appspot.com",
    messagingSenderId: "568390621800",
    appId: "1:568390621800:web:061d04c4c3ca57fab579dd"
};

const firebaseApp = initializeApp(firebaseConfig);

/*

const userHistory=
    'user':{
        'userID':{
            'id':id
        }
    }


*/


const database = getDatabase(firebaseApp);


const saveData = async (userId) => {
    console.log(userId)

    const db = getDatabase()

    const newPurchaseRef = push(ref(db, userId, 'purchases'))
    const idPurchase = newPurchaseRef.key
    set(newPurchaseRef, {

        'quantity': 2,
        'product': 'T-shirt',
        'price': 100,
        'total': 200

    })
}

/* const dbRef = (userId) => {
    ref(getDatabase())
    get(child(dbRef, `user/${ userId }`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val())
        }
        else {
            console.log('no data')
        }
    }).cath((error) => {
        console.log(error)
    })
} */



export {
    saveData as userData,
}
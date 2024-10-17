import { getDatabase, ref, onValue, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { firebaseConfig } from './config.js'


export class DetectUserConnected {
    constructor(firebaseConfig) {
        this.userState = false;
        this.firebaseConfig = firebaseConfig;
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(this.app);
        this.auth = getAuth(this.app);
        this.userId = null;
    }

    initialize() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.userId = user.uid;
                this.userStateDetected();
            } else {
                this.userState = false;
                this.userId = null;
            }
        });
    }

    userStateDetected() {
        if (!this.userId) {
            return;
        }

        const userStatusDatabaseRef = ref(this.database, 'status/' + this.userId);

        const isOfflineForDatabase = {
            state: 'offline',
            last_changed: serverTimestamp(),
        };

        const isOnlineForDatabase = {
            state: 'online',
            last_changed: serverTimestamp(),
        };

        const connectedRef = ref(this.database, '.info/connected');
        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() == false) {
                this.userState = false;
                return;
            }

            onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
                set(userStatusDatabaseRef, isOnlineForDatabase);
                this.userState = true;
            });
        });
    }

    isUserConnected() {
        return this.userState;
    }
}


// Crear una instancia de la clase y inicializar
const detectUserConnected = new DetectUserConnected(firebaseConfig);
detectUserConnected.initialize();

// Verificar el estado del usuario cuando se hace clic en el botón de favoritos
const favoriteBtn = document.querySelector('.favorite');

favoriteBtn.addEventListener('click', () => {
    if (!detectUserConnected.isUserConnected()) {
        alert('Por favor, inicie sesión para agregar a favoritos.');
        return;
    }

    // Lógica para agregar a favoritos
    console.log('Artículo agregado a favoritos');
});



/* 
export class DetectUserConnected{
    constructor(firebaseConfig) {
        this.userState = false;
        this.firebaseConfig = firebaseConfig;
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(this.app);
        this.auth = getAuth(this.app);
        this.userId = null;
        }

    userStateDetected(){
        const app = initializeApp(firebaseConfig)
        const database  = getDatabase(app)


        const userStatusDatabaseRef = ref(database,'status'+userId)

        const isOfflineForDatabase = {
            status: 'offline',
            last_changed: serverTimestamp(),

        }

        const isOnlineForDatabase = {
            state:'online',
            last_changed: serverTimestamp(),
        }

        const connectedRef= ref(database,'info/connected');
        onValue(connectedRef,(snapshot)=>{
            if(snapshot.val() === false){
                return;
            }
        })

        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(()=>{
            set(userStatusDatabaseRef, isOnlineForDatabase);
        })

    }
}

 */
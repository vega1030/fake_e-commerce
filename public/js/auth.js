// Importa la biblioteca de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js';

// Configura tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB6C0ZD9j_WGUd0Wwrygb0EOKaYB7T6JME",
    authDomain: "fakecommerce-2022.firebaseapp.com",
    projectId: "fakecommerce-2022",
    storageBucket: "fakecommerce-2022.appspot.com",
    messagingSenderId: "568390621800",
    appId: "1:568390621800:web:061d04c4c3ca57fab579dd"
};

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Función para iniciar sesión con Google
export function iniciarSesionConGoogle() {
    // Configura el proveedor de Google
    const provider = new GoogleAuthProvider();

    // Inicia sesión con el proveedor de Google
    const auth = getAuth(firebaseApp);
    signInWithPopup(auth, provider)
        .then((result) => {
            // Acceso exitoso, puedes redirigir o realizar acciones adicionales
            const user = result.user;
            console.log('Usuario autenticado con Google:', user);
        })
        .catch((error) => {
            // Manejar errores de inicio de sesión con Google
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error de inicio de sesión con Google:', errorCode, errorMessage);
        });
}

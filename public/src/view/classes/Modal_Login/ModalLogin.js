'use strict'

export class ModalLogin {
    constructor() {
        this.sessionInitialized = false;
    }

    initSession() {
        // Code to initialize the session
        this.sessionInitialized = true;
    }
    

    addFavorite(product) {
        if (!this.sessionInitialized) {
            throw new Error('Session not initialized');
        }

        // Code to add the product to favorites
        this.favorites.push(product);
    }

    addPurchase(product) {
        if (!this.sessionInitialized) {
            throw new Error('Session not initialized');
        }

        // Code to add the product to purchases
        this.purchases.push(product);
    }

    renderTemplate() {
        const template = `
            <div id="modal">
                <h2>Login</h2>
                <form>
                    <input type="text" id="username" placeholder="Username">
                    <input type="password" id="password" placeholder="Password">
                    <button type="button" onclick="initSession()">Login</button>
                </form>
            </div>
        `;
        this.sessionInitialized === true ? document.body.innerHTML = template : false
        console.log(template);

    }

    initSession() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Code to authenticate the user and initialize the session
        // ...

        this.sessionInitialized = true;
    }

    addFavorite(product) {
        if (!this.sessionInitialized) {
            throw new Error('Session not initialized');
        }

        // Code to add the product to favorites
        this.favorites.push(product);
    }

    addPurchase(product) {
        if (!this.sessionInitialized) {
            throw new Error('Session not initialized');
        }

        // Code to add the product to purchases
        this.purchases.push(product);
    }
}
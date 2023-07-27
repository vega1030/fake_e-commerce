
'use strict'

import { keysLocalStorage } from './constants.js'
/* It's a class that has a constructor that receives two parameters, and then has three methods that
add, delete, and get products from local storage. */

//These abstraction step at localStorage
class StorageService {
    setItem(key, value) {
        const setValue = JSON.stringify(value)
        if(typeof localStorage !== 'undefined'){
            localStorage.setItem(key, setValue);
        }
    }

    getItem(key) {
        if (typeof localStorage !== 'undefined') {
            const value = JSON.parse(localStorage.getItem(key)) || []
            return value
        }
        return []
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }
}
const local_Storage = new StorageService()

//---------------------------------------/
class Drive_Data_Cart {

    constructor() {
        this.modelCart

    }

    send_Cart_LocalStorage = () => {
        return local_Storage.getItem(keysLocalStorage.CART);
    };

    assign_Cart_Without_LocalStorage = (newCart) => {

        this.responseCart = newCart
    }

    send_Cart_Without_LocalStorage = () => {
        return this.responseCart

    }

    createCopyLocalStorage(cart){
        console.log('cart at model: ',cart);
        this.responseCart = cart
        local_Storage.setItem(keysLocalStorage.CART,this.responseCart)
        return this.responseCart
    }
    //***********--Cart--**************/ 


    /* A function that receives an id as a parameter, gets the cart from local storage, subtracts the
    product from the cart, and then saves the cart back to local storage. */


    //*****************//***************** */


}
/***********--------------***************/
const handler_Cart_Model = new Drive_Data_Cart()

handler_Cart_Model.send_Cart_Without_LocalStorage()

//***********--Favorites--**************/ 
class Handler_Favorites {
    constructor() {
        this.favorites
    }

    /* The `save_Favorites` method is a function that receives an object as a parameter. It first
    initializes an empty array called `favorites` on the `this` object. It then retrieves the current
    favorites from local storage using the `get_Favorites` method of the
    `favoriteStorage` class and assigns it to the `favorites` array. */
    save_And_Update_Favorites = (productId) => {
        const id = productId.id && productId ? productId.id : null
        this.favorites = local_Storage.getItem(keysLocalStorage.FAVORITES) || [];
        const index = this.favorites.findIndex(i => i.id === id)

        if (index !== -1) {
            this.favorites.splice(index, 1)
        }
        else {
            this.favorites.push(productId)
        }
        local_Storage.setItem(keysLocalStorage.FAVORITES, this.favorites)
        return this.favorites
    }

}

handler_Cart_Model.createCopyLocalStorage(local_Storage.getItem(keysLocalStorage.CART))

/***********--------------***************/




export {

    Drive_Data_Cart,
    Handler_Favorites,
    StorageService
}

'use strict'

import { keysLocalStorage } from '../constants.js'
/* It's a class that has a constructor that receives two parameters, and then has three methods that
add, delete, and get products from local storage. */

//These abstraction step at localStorage
class StorageService {
    setItem(key, value) {
        const setValue = JSON.stringify(value)
        if (typeof localStorage !== 'undefined') {
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


    setAndCopyLocalStorage(cart) {
        this.responseCart = cart
        local_Storage.setItem(keysLocalStorage.CART, this.responseCart)
        return this.responseCart
    }

}
/***********--------------***************/
const handler_Cart_Model = new Drive_Data_Cart()


//***********--Favorites--**************/ 
class Handler_Favorites {
    constructor() {
        this.favorites = []
    }


    saveFavorites(favorite){
        this.favorites = favorite
    }

    sendFavorites(){
        return this.favorites
    }

}

handler_Cart_Model.setAndCopyLocalStorage(local_Storage.getItem(keysLocalStorage.CART))

/***********--------------***************/




export {

    Drive_Data_Cart,
    Handler_Favorites,
    StorageService
}
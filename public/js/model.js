
'use strict'

import { keysLocalStorage } from './constants.js'
/* It's a class that has a constructor that receives two parameters, and then has three methods that
add, delete, and get products from local storage. */

//These abstraction step at localStorage
class StorageService {
    setItem(key, value) {
        const setValue = JSON.stringify(value)
        localStorage.setItem(key, setValue);
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

//-----------------------------------
class Drive_Data_Cart {

    constructor() {
        this.modelCart=[]

    }

    assign_Cart_Without_LocalStorage = (newCart) => {

        this.modelCart = newCart
    }

    send_Cart_Without_LocalStorage = () => {

        return this.modelCart

    }

    copyLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            this.modelCart = local_Storage.getItem(keysLocalStorage.CART)
            console.log(this.modelCart);
            return this.modelCart
        }
        return this.modelCart
    }

}
/***********--------------***************/
const handler_Cart_Model = new Drive_Data_Cart()
handler_Cart_Model.copyLocalStorage()
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

    dataFavorites(favorites = []) {
        this.favorites = favorites
    }

    sendDataFavorites() {
        return this.favorites
    }

}

/***********--------------***************/




export {

    Drive_Data_Cart,
    Handler_Favorites,
    StorageService
}
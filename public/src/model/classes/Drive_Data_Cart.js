'use strict'
import { StorageService } from "./StorageService.js"

export class Drive_Data_Cart {

    constructor() {
        this.modelCart = ''
        this.local_Storage = new StorageService()
    }


    setAndCopyLocalStorage(cart) {
        this.responseCart = cart
        this.local_Storage.setItem(keysLocalStorage.CART, this.responseCart)

    }
    returnCopyLocalStorage() {
        return this.local_Storage.getItem(keysLocalStorage.CART)
    }

}
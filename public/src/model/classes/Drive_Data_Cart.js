'use strict'
import { StorageService } from "../classes/StorageService.js"
import { keysLocalStorage } from "../../constants.js"
export class Drive_Data_Cart {

    constructor() {
        this.local_Storage = new StorageService()
        this.modelCart = this.local_Storage.getItem(keysLocalStorage.CART) || []
    }


    setCart(cart) {

        console.log(cart)
        this.setCartLocalStorage()

    }

    setCartLocalStorage() {
        this.local_Storage.setItem(keysLocalStorage.CART, this.modelCart)

    }

    returnCopyLocalStorage() {
        return this.local_Storage.getItem(keysLocalStorage.CART)
    }

    mergeCart(cartFromDB, cartFromLocalStorage) {
        console.log('storage Real TIme: ', cartFromDB)
        console.log('storage LocalStorage: ', cartFromLocalStorage)
        const combinedMap = new Map();

        // Combina los elementos del primer array
        if (cartFromDB) {
            cartFromDB.forEach(item => {
                const { id, ...rest } = item;
                combinedMap.set(id, { id, ...rest });
            });
        }

        // Combina los elementos del segundo array y suma la quantity si ya existe
        if (cartFromLocalStorage) {
            cartFromLocalStorage.forEach(item => {
                const { id, ...rest } = item;
                if (combinedMap.has(id)) {
                    combinedMap.set(id, { ...combinedMap.get(id), quantity: (combinedMap.get(id).quantity || 0) + (item.quantity || 0) });
                } else {
                    combinedMap.set(id, { id, ...rest, quantity: item.quantity || 0 });
                }
            });
        }

        // Convierte el Map de nuevo a un array
        const combinedArray = Array.from(combinedMap.values());
        console.log('combined Array: ', combinedArray)
        return combinedArray;

    }

}


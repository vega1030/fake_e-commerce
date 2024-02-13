'use strict'
import { StorageService } from "./StorageService.js"
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
        /*         console.log('merge cart ', cartFromDB, cartFromLocalStorage);
                const mergedCart = {};
        
                if (cartFromDB) {
                    cartFromDB.forEach(product => {
                        const productId = product.id;
                        const quantity = product.quantity;
                        mergedCart[ productId ] = mergedCart[ productId ] || { ...product, quantity: 0 };
                        mergedCart[ productId ].quantity += quantity;
                        console.log(product);
                        console.log('merge cart ', mergedCart);
                    });
                }
        
                if (cartFromLocalStorage) {
                    const localStorageCart = JSON.parse(this.local_Storage.getItem(keysLocalStorage.CART));
        
                    Object.keys(localStorageCart).forEach(productId => {
                        const quantity = localStorageCart[ productId ];
                        mergedCart[ productId ] = mergedCart[ productId ] || { quantity: 0 };
                        mergedCart[ productId ].quantity += quantity;
                    });
                    console.log(mergedCart);
                }
        
                const resultArray = [ ...Object.values(mergedCart) ];
                console.log(resultArray);
        
                // Corregir el uso del setItem en el localStorage
                this.local_Storage.setItem(keysLocalStorage.CART, resultArray);
        
                return resultArray;
         */

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


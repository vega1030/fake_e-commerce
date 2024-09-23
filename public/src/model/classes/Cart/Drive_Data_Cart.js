'use strict'
import { StorageService } from "../../../model/classes/storage/StorageService.js"
import { keysLocalStorage } from "../../../constants.js"
/* The Drive_Data_Cart class manages cart data by merging items from a database with items stored
locally and updating the cart accordingly. */
export class Drive_Data_Cart {

    constructor() {
        this.local_Storage = new StorageService()
        this.modelCart = this.local_Storage.getItem(keysLocalStorage.CART) || []
    }

    setCartLocalStorage(cart) {
        this.local_Storage.setItem(keysLocalStorage.CART, cart)
    }

    returnCopyLocalStorage() {
        return this.local_Storage.getItem(keysLocalStorage.CART)
    }


/**
 * The function `mergeCart` merges two arrays of cart items, updating quantities if items with the same
 * ID are found.
 * @param cartFromDB - Cart items retrieved from the database. It contains an array of objects with
 * properties like id, name, price, and quantity.
 * @param cartFromLocalStorage - Cart items stored in the user's browser storage, which may include
 * items that are not yet saved to the database.
 * @returns The function `mergeCart` returns the merged array containing items from both `cartFromDB`
 * and `cartFromLocalStorage`, with quantities updated if the same item exists in both arrays.
 */
    mergeCart(cartFromDB, cartFromLocalStorage) {
        const mergedArray = cartFromDB.concat(cartFromLocalStorage.filter(item2 =>
            !cartFromDB.some(item1 => item1.id === item2.id)
        ));

        mergedArray.forEach(element => {element!==undefined
            const matchingArray = cartFromLocalStorage.find(item => item.id === element.id);
            if (matchingArray) {
                const newQuantity = element.quantity + matchingArray.quantity
                element.quantity = newQuantity <= 10 ? newQuantity : 10;
            }
        });
        const cleanedArray = mergedArray.filter(element => element !== undefined);


        console.log('new merged ', cleanedArray);
        return mergedArray;
    }


}


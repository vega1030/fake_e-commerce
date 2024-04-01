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
     * The `mergeCart` function combines items from two arrays, updating quantities if items already exist,
     * and returns a new array with the combined items.
     * @param cartFromDB - The `cartFromDB` parameter represents the cart items retrieved from a database,
     * while `cartFromLocalStorage` represents the cart items stored in the local storage of the user's
     * browser. The `mergeCart` function you provided combines these two sets of cart items, ensuring that
     * quantities are properly summed if
     * @param cartFromLocalStorage - The `cartFromLocalStorage` parameter in the `mergeCart` function
     * represents the shopping cart items stored in the user's browser's local storage. These items are
     * typically saved locally on the user's device and can be used to persist the cart contents across
     * sessions or page reloads.
     * @returns The `mergeCart` function returns an array that combines the items from `cartFromDB` and
     * `cartFromLocalStorage`. It merges the items based on their `id`, summing up the quantities if an
     * item with the same `id` already exists in both arrays. The final array contains unique items with
     * their quantities combined.
     */
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

        /* This part of the code is iterating over each item in the `cartFromLocalStorage` array and processing
        them to merge with the items from the database. Here's a breakdown of what it's doing: */
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

        /* The code snippet you provided is creating a new array called `combinedArray` by converting the
values of a `Map` object `combinedMap` into an array using `Array.from(combinedMap.values())`. */

        const combinedArray = Array.from(combinedMap.values());
        console.log('combined Array: ', combinedArray)
        return combinedArray;

    }

}


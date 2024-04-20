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
    // Filtrar elementos indefinidos en cartFromDB y cartFromLocalStorage
    const filteredCartFromDB = cartFromDB.filter(element => element !== undefined);
    const filteredCartFromLocalStorage = cartFromLocalStorage.filter(element => element !== undefined);

    // Concatenar los arrays filtrados y filtrar elementos duplicados
    const mergedArray = filteredCartFromDB.concat(filteredCartFromLocalStorage.filter(item2 =>
        !filteredCartFromDB.some(item1 => item1.id === item2.id)
    ));

    // Actualizar las cantidades de los elementos en mergedArray
    mergedArray.forEach(element => {
        const matchingArray = filteredCartFromLocalStorage.find(item => item.id === element.id);
        if (matchingArray) {
            // Actualizar la cantidad del elemento si existe en cartFromLocalStorage
            const totalQuantity = element.quantity + matchingArray.quantity;
            element.quantity = totalQuantity <= 10 ? totalQuantity : 10;
        }
    });

    console.log('new merged ', mergedArray);
    return mergedArray;
}


}


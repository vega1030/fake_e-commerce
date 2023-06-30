
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
        const value = JSON.parse(localStorage.getItem(key));
        return value
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }
}
const local_Storage = new StorageService()





class Drive_Data_Cart {

    constructor() {
        this.responseCart

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
    //***********--Cart--**************/ 

    /* A function that receives an id as a parameter, calls the get_Single_Product function, which returns
    a product, and then adds the product to the cart. */
    create_A_New_Array_Of_Object = async (result) => {
        const product = {
            quantity: 1,
            ...result
        }
        return this.addProductsInCart(product)
    }


    /**
     * It receives a product as a parameter, gets the cart from local storage, adds the product to the
     * cart, and then saves the cart back to local storage
     * @param paramProduct - is the product that is added to the cart.
     * @returns the localStorage.setItem(CART, JSON.stringify(cart_LocalStorage))
     */
    addProductsInCart = (paramProduct) => {
        let cart_Model = local_Storage.getItem(keysLocalStorage.CART) || [];
        const cart = [ ...cart_Model, paramProduct ];
        cart_Model = cart.reduce((acc, e) => {
            const searchRepeat = acc.find(x => e.id === x.id);
            searchRepeat ? searchRepeat.quantity += e.quantity : acc.push(e);
            return acc;
        }, []);
        const isProductAdded = cart_Model.some(p => p.id === paramProduct.id && p.quantity === paramProduct.quantity);
        const isCartUpdated = cart_Model.length !== cart_Model.filter(p => p.quantity > 0).length;

        this.assign_Cart_Without_LocalStorage(cart_Model);
        local_Storage.setItem(keysLocalStorage.CART, cart_Model);
        return isProductAdded || isCartUpdated;
    }





    /* A function that receives an id as a parameter, gets the cart from local storage, subtracts the
    product from the cart, and then saves the cart back to local storage. */
    update_Quantity_Cart = (id = "", flag) => {
        if (flag === true) {
            const updateCart_Minus = local_Storage.getItem(keysLocalStorage.CART).map
                (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            return (
                local_Storage.setItem(keysLocalStorage.CART, updateCart_Minus),
                local_Storage.getItem(keysLocalStorage.CART),
                this.assign_Cart_Without_LocalStorage(updateCart_Minus)
                )
            }
            const updateCart_Add = local_Storage.getItem(keysLocalStorage.CART).map
            (i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);
            return (
            local_Storage.setItem(keysLocalStorage.CART, updateCart_Add),
            local_Storage.getItem(keysLocalStorage.CART),
            this.assign_Cart_Without_LocalStorage(updateCart_Add)
        )
    }

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
        console.log(this.favorites); 
        local_Storage.setItem(keysLocalStorage.FAVORITES, this.favorites)
        return this.favorites
    }

}

/***********--------------***************/




export {

    Drive_Data_Cart,
    Handler_Favorites,
    StorageService
}
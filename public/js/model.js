'use strict'

import { controller, controller_Cart, controller_Favorites } from "./controller.js";
class Calls_API {

    constructor(response = '', response_Categories = [], response_Product_For_Category = []) {

        this._response = response,
            this._response_Categories = response_Categories,
            this._response_Product_For_Category = response_Product_For_Category
    }


/*     get_Single_Product = async (id) => {
        const url = `https://fakestoreapi.com/products/${ Number(id) }`
        try {
            if (id == '') {
                console.log('error');
            }
            else {
              const  result = await fetch(url)
                const res = result.json()
                return res
            }

        } catch (error) {
            console.log(error);
        }
    }*/
} 

const calls_To_API = new Calls_API()



/* It's a class that contains functions that are used to save data into the cart */
class Drive_Data_Cart {

    constructor(response_Cart) {
        this.responseCart = response_Cart;
    }



    /* A function that receives an id as a parameter, calls the get_Single_Product function, which returns
    a product, and then adds the product to the cart. */
    save_Data_Into_Cart = async (id) => {
        const result = await calls_To_API.get_Single_Product(id)
        const product = {
            quantity: 1,
            ...result
        }
        this.addProductsInCart(product)
    }

    //***********--Cart--**************/ 

    /**
     * It receives a product as a parameter, gets the cart from local storage, adds the product to the
     * cart, and then saves the cart back to local storage
     * @param paramProduct - is the product that is added to the cart.
     * @returns the localStorage.setItem(CART, JSON.stringify(cart_LocalStorage))
     */

    addProductsInCart = (paramProduct) => {
        const CART = 'cart';
        this.responseCart = [];
        this.responseCart = api_LocalStorage.get_Cart() || [];
        const cart = [ ...this.responseCart, paramProduct ];
        this.responseCart = cart.reduce((acc, e) => {
            const searchRepeat = acc.find(x => e.id === x.id);
            searchRepeat ? searchRepeat.quantity += e.quantity : acc.push(e);
            return acc;
        }, []);
        api_LocalStorage.saveCartAtLocalStorage(this.responseCart);
        controller_Cart.control_Data_For_Cart(this.responseCart);
        controller_Cart.calculate_Total_Cart(this.responseCart)
        return this.responseCart;
    }

    /* A function that receives an id as a parameter, gets the cart from local storage, subtracts the
    product from the cart, and then saves the cart back to local storage. */
    delete_Product_At_Cart = (id = "") => {

        const updateCart = api_LocalStorage.get_Cart().map(i => i.id === id
            ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
        this.responseCart = updateCart
        return (api_LocalStorage.saveCartAtLocalStorage(this.responseCart),
            controller_Cart.control_Data_For_Cart(this.responseCart),
            controller_Cart.calculate_Total_Cart(this.responseCart)
        )
    }

    //***************** */



    /* It's a function that receives an id as a parameter, calls the get_Single_Product function, which
    returns
    a product, and then adds the product to the cart. */
    send_Cart_To_Controller = async (id) => {
        const result = calls_To_API.get_Single_Product(id)

    }

}

/***********--------------***************/

/* It's a class that has a constructor that receives two parameters, and then has three methods that
add, delete, and get products from local storage. */
class Call_Api_LocalStorage {

    /* A function that receives a parameter, which is the data, and then saves the data in localStorage. */
    saveCartAtLocalStorage = (data) => {
        const CART = 'cart';
        return localStorage.setItem(CART, JSON.stringify(data));
    }


    get_Cart = () => {
        return JSON.parse(localStorage.getItem('cart'))
    }

    //***********--Favorites--**************/ 

}

/***********--------------***************/

class Favorites_ {

    /* Saving the favorites at localStorage. */
    static save_Favorites_At_LocalStorage = (favorite) => {

        const FAVORITES = 'favorites';

        return localStorage.setItem(FAVORITES, JSON.stringify(favorite));
    };


    //save info to localStorage and no overwriting

    static get_Favorites = () => {
        const cart_response_Favorites = JSON.parse(localStorage.getItem('favorites'));

        return cart_response_Favorites;
    };

}


//*************----*************************/

class Control_Data {
    constructor(favorites = []) {
        this.favorites = favorites
    }

    save_Favorites = (object, flag) => {
        if (flag === 'off') {
            this.favorites = []
            this.favorites = Favorites_.get_Favorites() || []
            const favorites = [ ...this.favorites, object ]

            this.favorites = favorites.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)

            controller_Favorites.reception_Favorite_Product(this.favorites)

            return Favorites_.save_Favorites_At_LocalStorage(this.favorites)
        }
        else {
            this.favorites = []
            this.favorites = Favorites_.get_Favorites() || []
            const favorites = [ ...this.favorites, object ]
            this.favorites = favorites.filter(data => data.id !== object.id)

            controller_Favorites.reception_Favorite_Product(this.favorites)
            return Favorites_.save_Favorites_At_LocalStorage(this.favorites)

        }


    }
}
controller_Favorites.reception_Favorite_Product(Favorites_.get_Favorites())


/***********--------------***************/

const handler_Data_At_LocalStorage = new Control_Data
const data_Cart = new Drive_Data_Cart
const api_LocalStorage = new Call_Api_LocalStorage
const favorites = new Favorites_



controller_Cart.control_Data_For_Cart(api_LocalStorage.get_Cart());
controller_Cart.handle_View_Products_At_Cart(api_LocalStorage.get_Cart())

/* controller_Cart.calculate_Total_Cart(api_LocalStorage.get_Cart())
 */
export {
    calls_To_API,
    api_LocalStorage,
    handler_Data_At_LocalStorage,
    data_Cart,

}
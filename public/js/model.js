'use strict'
/* It's a class that has a constructor that receives two parameters, and then has three methods that
add, delete, and get products from local storage. */




class Call_Api_LocalStorage {

    constructor(storage_Cart) {
        this.storage_Cart = storage_Cart
    }

    /* A function that receives a parameter, which is the data, and then saves the data in localStorage. */
    saveCartAtLocalStorage = (data) => {
        const CART = 'cart';
        return localStorage.setItem(CART, JSON.stringify(data));
    }
    get_Cart() {
        if (typeof localStorage !== "undefined") {
            const cartData = localStorage.getItem('cart');
            return JSON.parse(cartData) || [];
        }
        return [];
    }




}

const api_LocalStorage = new Call_Api_LocalStorage()

class Drive_Data_Cart {

    constructor(cart) {
        this.responseCart = cart

    }

    send_Cart_LocalStorage = () => {
        return api_LocalStorage.get_Cart();
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
        const CART = 'cart';
        let cart_Model = [];
        cart_Model = api_LocalStorage.get_Cart() || [];
        const cart = [ ...cart_Model, paramProduct ];
        cart_Model = cart.reduce((acc, e) => {
            const searchRepeat = acc.find(x => e.id === x.id);
            searchRepeat ? searchRepeat.quantity += e.quantity : acc.push(e);
            return acc;
        }, []);

        const isProductAdded = cart_Model.some(p => p.id === paramProduct.id && p.quantity === paramProduct.quantity);
        const isCartUpdated = cart_Model.length !== cart_Model.filter(p => p.quantity > 0).length;

        this.assign_Cart_Without_LocalStorage(cart_Model);
        api_LocalStorage.saveCartAtLocalStorage(cart_Model);

        return isProductAdded || isCartUpdated;
    }





    /* A function that receives an id as a parameter, gets the cart from local storage, subtracts the
    product from the cart, and then saves the cart back to local storage. */
    update_Quantity_Cart = (id = "", flag) => {
        if (flag === true) {
            const updateCart_Minus = api_LocalStorage.get_Cart().map
                (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            return (
                api_LocalStorage.saveCartAtLocalStorage(updateCart_Minus),
                this.send_Cart_LocalStorage(),
                this.assign_Cart_Without_LocalStorage(updateCart_Minus)
            )
        }
        const updateCart_Add = api_LocalStorage.get_Cart().map(i => i.id === id
            ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);

        return (
            api_LocalStorage.saveCartAtLocalStorage(updateCart_Add),
            this.send_Cart_LocalStorage(),
            this.assign_Cart_Without_LocalStorage(updateCart_Add)
        )
    }

    //*****************//***************** */


}
/***********--------------***************/
const handler_Cart_Model = new Drive_Data_Cart()

handler_Cart_Model.send_Cart_Without_LocalStorage()
//***********--Favorites--**************/ 
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
/* controller_Favorites.reception_Favorite_Product(Favorites_.get_Favorites())
 */


/***********--------------***************/

const favorites = new Favorites_()


handler_Cart_Model.send_Cart_LocalStorage()

export {

    Drive_Data_Cart,
    Call_Api_LocalStorage

}
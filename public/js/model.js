'use strict'
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


}

/***********--------------***************/

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
class Drive_Data_Cart {

    constructor(response_Cart) {
        this.responseCart = response_Cart

    }

    assign_Cart = (newCart) => {
        this.responseCart = newCart
    }



    send_Cart_ = () => {
        return this.responseCart
    }


    /* A function that receives an id as a parameter, calls the get_Single_Product function, which returns
    a product, and then adds the product to the cart. */
    create_A_New_Array_Of_Object = async (result) => {
        const product = {
            quantity: 1,
            ...result
        }
        return this.addProductsInCart(product)
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
        let cart_Model = [];
        cart_Model = api_LocalStorage.get_Cart() || [];
        const cart = [ ...cart_Model, paramProduct ];
        cart_Model = cart.reduce((acc, e) => {
            const searchRepeat = acc.find(x => e.id === x.id);
            searchRepeat ? searchRepeat.quantity += e.quantity : acc.push(e);
            return acc;
        }, []);
        /*         controller_Cart.control_Quantity(send_Cart)
         */
         this.assign_Cart(cart_Model);
         return this.send_Cart_();
    }


    /* A function that receives an id as a parameter, gets the cart from local storage, subtracts the
    product from the cart, and then saves the cart back to local storage. */
    update_Quantity_Cart = (id = "", flag) => {

        if (flag === true) {
            const updateCart_Minus = api_LocalStorage.get_Cart().map
                (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            return (api_LocalStorage.saveCartAtLocalStorage(updateCart_Minus),
                controller_Cart.control_Quantity(updateCart_Minus),
                this.assign_Cart(updateCart_Minus)


            )
        }

        const updateCart_Add = api_LocalStorage.get_Cart().map(i => i.id === id
            ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);

        return (api_LocalStorage.saveCartAtLocalStorage(updateCart_Add),
            controller_Cart.control_Quantity(updateCart_Add),
            this.assign_Cart(updateCart_Add)

        )

    }

    //***************** */


}


/***********--------------***************/

const favorites = new Favorites_()
const api_LocalStorage = new Call_Api_LocalStorage()
const data_Cart = new Drive_Data_Cart()


/* data_Cart.assign_Cart(api_LocalStorage.get_Cart())
 */

/* data_Cart.controller_Cart.cart_Quantity(api_LocalStorage.get_Cart()); */

//____controller.js____




//------------------------




/* controller_Cart.calculate_Total_Cart(api_LocalStorage.get_Cart())
 */
export {
    api_LocalStorage,
    data_Cart,
    Drive_Data_Cart,
    Call_Api_LocalStorage

}
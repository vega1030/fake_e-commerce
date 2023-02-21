'use strict'
import { controller, controller_Cart, controller_Favorites } from "./controller.js";
class Calls_API {

    constructor(response = '', response_Categories = [], response_Product_For_Category = []) {

        this._response = response,
            this._response_Categories = response_Categories,
            this._response_Product_For_Category = response_Product_For_Category
    }



    get_All_Products = async (url = "") => {
        let result = []
        try {
            if (url === "") {
                console.error('error')
            }
            else {
                result = await fetch(url)
                const res = await result.json()
                return res
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    get_Categories = async (url = "") => {
        let result = []

        try {
            if (url === '') {
                console.log('error');
            } else {
                result = await fetch(url)
                const res = await result.json()
                return res
            }

        } catch (error) {
            console.log(error);
        }
    }

    get_View_Products_For_Category = async (category) => {
        let result = [];
        const url = `https://fakestoreapi.com/products/category/${ category }`
        try {
            if (category == '') {
                console.log('error');
            }
            else {
                result = await fetch(url)
                const res = await result.json()
                return res
            }
        } catch (error) {
            console.log(error);
        }
    }

    get_Single_Product = async (id) => {
        let result = []
        const url = `https://fakestoreapi.com/products/${ Number(id) }`
        try {
            if (id == '') {
                console.log('error');
            }
            else {
                result = await fetch(url)
                const res = result.json()
                return res
            }

        } catch (error) {
            console.log(error);
        }
    }
}

const calls_To_API = new Calls_API()

controller.control_View_All_Products(await calls_To_API.get_All_Products('https://fakestoreapi.com/products'))
controller.control_View_Categories(await calls_To_API.get_Categories('https://fakestoreapi.com/products/categories'))


class Drive_Data_Cart {



    /* A function that receives an id as a parameter, calls the get_Single_Product function, which returns
    a product, and then adds the product to the cart. */
    save_Data_Into_Cart = async (id) => {
        const result = await calls_To_API.get_Single_Product(id)
        const product = {
            quantity: 1,
            ...result
        }

        api_LocalStorage.addProductsInCart(product)
    }



    send_Cart_To_Controller = async (id) => {
        const result = calls_To_API.get_Single_Product(id)

    }

}

//create a function to add a product at localStorage

class Call_Api_LocalStorage {

    constructor(response_Cart, response_Favorites) {
        this.responseCart = response_Cart;
        this.responseCart = response_Favorites;
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
        this.responseCart = this.get_Cart() || [];
        const cart = [ ...this.responseCart, paramProduct ];
        this.responseCart = cart.reduce((acc, e) => {
            const searchRepeat = acc.find(x => e.id === x.id);
            searchRepeat ? searchRepeat.quantity += e.quantity : acc.push(e);
            return acc;
        }, []);
        this.saveCartAtLocalStorage(this.responseCart);
        /* localStorage.setItem(CART, JSON.stringify(this.responseCart)); */
        controller_Cart.control_Data_For_Cart(this.responseCart);
        return this.responseCart;

    }

    //fix

    delete_Product_At_Cart = (id = "") => {
        //filters the cart and deletes the product
        const CART = 'cart';
        const searchProductInCart = this.get_Cart().find((item => {
            return item.id === id?item.quantity -=1:this.get_Cart();
        }))
        console.log(searchProductInCart)

        //create a function to replace elements at an array of objects
        const updateCart = this.get_Cart().map(i=>i.id===searchProductInCart.id?searchProductInCart:i)
        return this.saveCartAtLocalStorage(updateCart)
    }


    saveCartAtLocalStorage = (data) => {
        const CART = 'cart';
        return localStorage.setItem(CART, JSON.stringify(data));
    }


    get_Cart = () => {
        return JSON.parse(localStorage.getItem('cart'))
    }

    //***********--Favorites--**************/ 

    /* Saving the favorites at localStorage. */
    save_Favorites_At_LocalStorage = (product) => {
        const FAVORITES = 'favorites';
        let favorites = [];
        favorites = api_LocalStorage.get_Favorites() || [];
        favorites = [ ...favorites, product ];
        favorites = favorites.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
        return localStorage.setItem(FAVORITES, JSON.stringify(favorites));
    };


    //how create a function to subtract units an array of objects with vanilla javascript

    //save info to localStorage and no overwriting

    get_Favorites = () => {
        const cart_response_Favorites = JSON.parse(localStorage.getItem('favorites'));
        return cart_response_Favorites;
    };

    //*************----*************************/




    delete_Favorites_At_LocalStorage = (id) => {
        api_LocalStorage.get_Favorites().forEach(data => {
            console.log(`${ data } and ${ id }`);
        })
    }
    //*************----*************************/


}


//*************----*************************/

class Control_Data {
    constructor(favorites = []) {
        this.favorites = favorites
    }



    save_Favorites = (items, id) => {
        const product = { ...items }
        let arr_Favorites = []
        arr_Favorites = [ ...arr_Favorites, product ]

        this.favorites = arr_Favorites
        Call_Api_LocalStorage.save_Favorites_At_LocalStorage(product, id)

    }

}
const handler_Data_At_LocalStorage = new Control_Data
const data_Cart = new Drive_Data_Cart
const api_LocalStorage = new Call_Api_LocalStorage


api_LocalStorage.get_Favorites() != null ? window.addEventListener('DOMContentLoaded', controller_Favorites.receive_Favorite_Product(Call_Api_LocalStorage.get_Favorites())) : false

controller_Cart.control_Data_For_Cart(api_LocalStorage.get_Cart());


/* controller_Cart.control_Data_For_Cart(api_LocalStorage.responseCart)
 */

export {
    calls_To_API,
    api_LocalStorage,
    handler_Data_At_LocalStorage,
    data_Cart,

}
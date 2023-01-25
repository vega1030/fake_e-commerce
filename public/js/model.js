'use strict'
import { controller, controller_Cart, controller_Favorites } from "./controller.js";
class Calls_API {

    constructor(response = '', response_Categories = [], response_Product_For_Category = []) {

        this._response = response,
            this._response_Categories = response_Categories,
            this._response_Product_For_Category = response_Product_For_Category
    }

    async get_All_Products(url = "") {
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

    async get_Categories(url = "") {
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

    async get_View_Products_For_Category(category) {
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

    async get_Single_Product(id) {
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

    constructor() {
        this._cart = []
    }


    async save_Data_Into_Cart(id) {
        const result = await calls_To_API.get_Single_Product(id)

        const product = {
            quantity: 1,
            ...result
        }

        this._cart.push(product)

        const search_Repeat = this._cart.reduce((acc, e) => {
            const new_Cart = acc.find(x => e.id === x.id)
            new_Cart ? new_Cart.quantity += e.quantity : acc.push(e)
            return acc
        }, [])
        this._cart = search_Repeat
        return controller_Cart.reception_Data_For_Cart(this._cart)
    }

    delete_Product_At_Cart(id = "") {
        const new_Cart = []
        new_Cart.push(cart.filter(item => item.id != id))
        cart = new_Cart
        console.log(cart);
        return cart
    }

    async send_Cart_To_Controller(id) {
        const result = calls_To_API.get_Single_Product(id)
        console.log(result)

    }

}


class Call_Api_LocalStorage {

    //***********--Cart--**************/ 

    constructor(response_Cart, response_Favorites) {
        this.response_Cart = response_Cart;
        this.response_Favorites = response_Favorites;
    }
    //*************----*************************/


    //***********--Favorites--**************/ 

    static save_Favorites_At_LocalStorage(product) {

        /* Saving the favorites at localStorage. */
        const FAVORITES = 'favorites';
        let favorites = []
        favorites = Call_Api_LocalStorage.get_Favorites() || []
        favorites = [ ...favorites, product ]

        /* Filtering the array of favorites to remove duplicates. */
        favorites = favorites.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
        return localStorage.setItem(FAVORITES, JSON.stringify(favorites));

    }

    //empty favorites, fix the value null at the first iteration

    static get_Favorites() {
        this.response_Favorites = JSON.parse(localStorage.getItem('favorites'))
        return this.response_Favorites
    }

    static delete_Favorites_At_LocalStorage(id) {
        Call_Api_LocalStorage.get_Favorites().forEach(data => {
            console.log(`${ data } and ${ id }`);
        })
    }
}
Call_Api_LocalStorage.get_Favorites() != null ? window.addEventListener('DOMContentLoaded', controller_Favorites.receive_Favorite_Product(Call_Api_LocalStorage.get_Favorites())) : false

//*************----*************************/

class Control_Data {
    constructor(favorites = []) {
        this.favorites = favorites
    }

    save_Favorites(items, id) {
        const product = { ...items }
        let arr_Favorites = []
        arr_Favorites = [ ...arr_Favorites, product ]

        this.favorites = arr_Favorites
        Call_Api_LocalStorage.save_Favorites_At_LocalStorage(product, id)

    }

}
const handler_Data_At_LocalStorage = new Control_Data
const data_Cart = new Drive_Data_Cart

export {
    calls_To_API,
    Call_Api_LocalStorage,
    handler_Data_At_LocalStorage,
    data_Cart,

}
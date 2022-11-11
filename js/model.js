'use strict'
import { controller, controller_Cart } from "./controller.js";


let id_products_reference = []


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

    async get_Categories(url) {
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

        const url = `https://fakestoreapi.com/products/${ id }`
        try {
            if (id == '') {
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

}

const calls_To_API = new Calls_API()

let cart = []
calls_To_API.get_All_Products('https://fakestoreapi.com/products').then(products => { controller.control_View_All_Products(products) })

calls_To_API.get_Categories('https://fakestoreapi.com/products/categories').then(categories => controller.control_View_Categories(categories))


class Drive_Data_Cart {

    constructor(data_cart = []) {
        this._data_cart = data_cart
    }

    async save_Data_Into_Cart(id) {
        id_products_reference.push(id)
        await data_Cart.send_Products_To_Controller(id)

    }

    async send_Products_To_Controller(id) {
        calls_To_API.get_All_Products('https://fakestoreapi.com/products').then(products => {
            cart.push(products.find(item => item.id == id))
            controller_Cart.reception_Data_For_Cart(cart)
        })
    }
}

const data_Cart = new Drive_Data_Cart

class Control_Data {

    //save data at cart

    save_Cart_Db(objCart) {
        console.log(objCart);
        localStorage.setItem('cart', JSON.stringify(objCart))
    }
    //delete products at cart

    delete_Cart_db(objCart) {
        if (objCart.id === JSON.parse(localStorage.getItem('cart'))) {
        }
    }
}
export {
    calls_To_API,
    Control_Data,
    data_Cart
}
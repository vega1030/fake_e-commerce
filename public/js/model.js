'use strict'
import { controller, controller_Cart } from "./controller.js";
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
        const url = `https://fakestoreapi.com/products/${ Number (id) }`
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

    constructor(id, count, total) {
        this._id = id,
            this._count = count,
            this._total = total
    }

    set item(item) {
        this._id = item
    }

    get item() {
        return this._id
    }

    set count(count) {
        this._count = count
    }

    get count() {
        return this._count
    }

    set total(total) {
        this._total = total;
    }
    get total() {
        return this._total
    }


    async save_Data_Into_Cart(id) {

        await calls_To_API.get_Single_Product(id).then(product => {

            const amount_Item = cart.reduce((acc, item) => {
                return item.id === id ? item.amount += 1 : acc
            }, 1)

            const cart_Item = {
                amount: amount_Item,
                ...product
            }


            console.log(cart_Item);

            cart = [ ...cart, cart_Item ]


            console.log(cart)
            controller_Cart.reception_Data_For_Cart(cart)


            const filter_Max_Amount = cart.filter(item => console.log(item.amount, 'and id' ,item.id))

            let total = 0
            let itemsTotal = 0
            cart.map(item => {
                total += item.price * item.amount;
                itemsTotal += item.amount
            }
            )
        })

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

const data_Cart = new Drive_Data_Cart

class Control_Data {

    //save data at cart

    save_Cart_Db(objCart) {
        localStorage.setItem('cart', JSON.stringify(objCart, 3))
    }

    send_Cart_To_Controller() {
        const cart_Local_Storage = JSON.parse(localStorage.getItem('cart'))
        console.log(cart_Local_Storage)
    }

    //delete products at cart

    delete_Cart_db(objCart) {
        if (objCart.id === JSON.parse(localStorage.getItem('cart'))) {
        }
    }
}



const handle_Local_Storage = new Control_Data

export {
    calls_To_API,
    Control_Data,
    data_Cart
}
'use strict'

import { calls_To_API, data_Cart } from "./model.js";
import { View_cart, Category_ui, products_Instance } from "./view.js";





const view_Cart = new View_cart

const categories_UI = new Category_ui
//----------------------------------------------------------------
class Control_View_Information_At_DOM {

    constructor(data = []) {
        this._data = data
    }

    async control_View_All_Products(products, route) {

        products_Instance.create_Card(products, false)
    }

    async control_View_Categories(categories = '') {
        if (categories === '') {
            console.log('error')
        }
        else {
            return categories_UI.createDynamicCategoryNav(categories)
        }
    }

    async send_Category(category) {
        if (category === '') {
            console.log('error')
        }
        else {
            return await calls_To_API.get_View_Products_For_Category(category)
                .then(data =>
                    products_Instance.create_Card(data, true));
        }
    }

    async send_Id(id) {
        if (id === '') {
            console.log('error');
        }
        else {
            return await calls_To_API.get_Single_Product(id).then(
                data => data)
            // product_Instance_Controller.uI_Individual_Card(data))
        }
    }

}

//----------------------------------------------------------------
//-----------------------------------------------------------------------------//


class Control_cart {

    constructor(total) {
        this._total = total
    }

    set total_At_Cart(newTotal) {
        this._total = newTotal
    }
    get total_At_Cart() {
        return this._total;
    }
    //filter element for search at API and later push into cartObject

    send_Id_To_Cart(idElement = '') {
        if (idElement === '') {
            console.log('error');
        }
        else {

            data_Cart.save_Data_Into_Cart(idElement);
        }
    }


    async reception_Data_For_Cart(data) {
        try {
            if (data === '') {
                console.log('error');
            }
            else {
                view_Cart.createCartCont(data)
                controller_Cart.reception_Price_And_Sum(data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async reception_Price_And_Sum(price) {
        price.reduce((previous, current) => {
            previous + current.price
            console.log(previous + current.price)
            return previous + current.price
        }, 0);
    }
}

class Control_Routes {

    async reception_Hash(hash = '') {
        const  name_hash  =  {
            "#home": "The home",
            "#cart": "The cart",
            "#_categories": "The categories"
        }
        return await console.log("the hash is: " + name_hash[ hash ]);
    }

}

const instance_Control_Routes = new Control_Routes

const cart_Instance = new Control_cart()
const controller = new Control_View_Information_At_DOM
const controller_Cart = new Control_cart

export {
    instance_Control_Routes,
    cart_Instance,
    controller,
    controller_Cart
}
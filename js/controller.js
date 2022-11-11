'use strict'

import { calls_To_API, data_Cart } from "./model.js";
import { View_cart, Category_ui, products_Instance, Handler_Displayes_Ui } from "./view.js";




const handler_View = new Handler_Displayes_Ui

const view_Cart = new View_cart

const categories_UI = new Category_ui
//----------------------------------------------------------------
class Control_View_Information_At_DOM {

    constructor(data = {}) {
        this._data = data
    }

    async control_View_All_Products(products,) {

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
                return console.log('error');
            }
            else {
                return (
                    view_Cart.createCartCont(data),
                    view_Cart.model_UiCart_List(data)
                )
            }
        } catch (error) {
            console.log(error);
        }
    }
    async reception_Price_And_Sum(price,quantity) {

        const total_For_Contact = price*quantity
        console.log(price*quantity) 

    };

    }



class Control_Routes {

    reception_Hash(hash = '') {
        const name_Hash = {
            "#home": 'home',
            "#section_cart": 'cart',
            "#_categories": 'categories'
        }
        return handler_View.handler_Display_(name_Hash[ hash ]);
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
'use strict'

import { calls_To_API, data_Cart, handler_Data_At_LocalStorage, api_LocalStorage } from "./model.js";
import { View_cart, Category_ui, products_Instance, Handler_Displays_Ui, Product, View_Favorites } from "./view.js";


const handler_View = new Handler_Displays_Ui()

const view_Cart = new View_cart()

const categories_UI = new Category_ui()

//----------------------------------------------------------------

class Control_Favorites {
    constructor(favorites) {
        this._favorites_ = favorites
    }

    static get favorites() {
        return this._favorites_
    }

    async send_Favorite_Product_To_LocalStorage(id) {
        if (id === '') {
            console.log('error')
        }
        else {
            const res = await calls_To_API.get_Single_Product(id)
            handler_Data_At_LocalStorage.save_Favorites(res, id)
        }
    }
    receive_Favorite_Product(products) {
        products === "" ? console.log("error") : this._favorites_ = products;
        return View_Favorites.display_Favorites(this._favorites_)
    }
}


class Control_View_Information_At_DOM {

    constructor(data = {}) {
        this._data = data
    }

    async control_View_All_Products(products) {
        return products_Instance.create_Card(await products, false)
    }



    delete_product_favorite_list(id) {
        console.log(id);
    }

    async control_View_Categories(categories = '') {
        if (categories === '') {
            return console.log('error')
        }
        else {
            return categories_UI.createDynamicCategoryNav(categories)
        }
    }

    async send_Category(category = '') {
        if (category === '') {
            console.log('error')
        }
        else {
            return products_Instance.create_Card(await calls_To_API.get_View_Products_For_Category(category), true)
        }
    }

    async send_Id(id = '') {

        if (id === '') {
            return console.log('error');
        }
        let iterable_Product = []
        const res = await calls_To_API.get_Single_Product(id)
        const product = { ...res }
        iterable_Product = [ ...iterable_Product, product ]

        return (
            products_Instance.uI_Individual_Card(iterable_Product))
    }
}

//----------------------------------------------------------------
//-----------------------------------------------------------------------------//

class Control_cart {

    constructor(total = 0) {
        this.total = total
    }

    handle_Id_Cart(idElement = '', flag) {

        if (idElement === '' && flag === null) {
            console.log('error');
        }
        else {
            data_Cart.save_Data_Into_Cart(idElement)
        }
    }

    handle_Id_Cart_delete(id) {
        if (id === '') {
            console.log('error')
        }
        else {
            data_Cart.delete_Product_At_Cart(id)
        }
    }

    calculate_Total_Cart(data = 0) {

        this.total = data === 0 ? null : data.reduce((previous, current) => {
            const total = (current.price * current.quantity) + previous
            return total
        }, 0).toFixed(2)
        console.log(this.total)
        return Number(this.total)

    }

    control_Data_For_Cart(data) {

        const acu = data === null ? 0 : data.reduce((previous, current) => {
            return previous + current.quantity
        }, 0)
        return view_Cart.createCartCont(acu)
    }

}


//----------------------------------------------------------------

class Control_Routes {
    //reception hash to routers
    reception_Hash(hash = '') {
        console.log(hash);
        const name_Hash = {
            "#individual_product": 'individual_product',
            "#home": 'home',
            "#section_cart": 'cart',
            "#_categories": 'categories',
            "#favorites_section": 'favorites'

        }
        //send hash to controller
        return handler_View.handler_Display_(name_Hash[ hash ]);
    }

}

const instance_Control_Routes = new Control_Routes()
const controller_Cart = new Control_cart()
const controller = new Control_View_Information_At_DOM()
const controller_Favorites = new Control_Favorites()

export {
    instance_Control_Routes,
    controller,
    controller_Favorites,
    controller_Cart
}
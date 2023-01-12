'use strict'

import { calls_To_API, data_Cart, handler_Data_At_LocalStorage, Call_Api_LocalStorage } from "./model.js";
import { View_cart, Category_ui, products_Instance, Handler_Displays_Ui, Product, View_Favorites } from "./view.js";




const handler_View = new Handler_Displays_Ui()

const view_Cart = new View_cart()

const categories_UI = new Category_ui()



//----------------------------------------------------------------


class Control_Favorites {
    constructor(favorites) {
        this._favorites_ = favorites
    }

    get favorites() {
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
    static receive_Favorite_Product(products) {
        console.log(products);
        console.log(Call_Api_LocalStorage.get_Favorites()); 
        return products === "" ? console.log("error") : this._favorites_=products;
    }
}


class Control_View_Information_At_DOM {

    constructor(data = {}) {
        this._data = data
    }

    async control_View_All_Products(products) {

        products_Instance.create_Card(products, false)
    }



    delete_product_favorite_list(id) {
        console.log(id);
    }

    async control_View_Categories(categories = '') {
        if (categories === '') {
            console.log('error')
        }
        else {
            return categories_UI.createDynamicCategoryNav(categories)
        }
    }

    async send_Category(category= '') {
        if (category === '') {
            console.log('error')
        }
        else {
            return  products_Instance.create_Card( await calls_To_API.get_View_Products_For_Category(category),true)
        }
    }

    async send_Id(id = '') {
        let create_Iterable_Product = []
        if (id === '') {
            console.log('error');
        }
        else {
            return await (
                instance_Control_Routes.reception_Hash(id),
                calls_To_API.get_Single_Product(id).then(
                    data => {
                        const product = {
                            ...data
                        }
                        create_Iterable_Product = [ ...create_Iterable_Product, product ]
                        products_Instance.uI_Individual_Card(create_Iterable_Product)
                    }
                )
            )

        }
    }



}

//----------------------------------------------------------------
//-----------------------------------------------------------------------------//

let total = 0;
class Control_cart {

    constructor(total = 0) {
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

            data_Cart.save_Data_Into_Cart(idElement)
        }
    }

    calculate_Total_Cart(quantity, price) {
        total = total + price * quantity
        // quantity === 1 ? total : total = quantity * price;
    }
    async reception_Data_For_Cart(data, id) {

        try {
            if (data === '') {
                return console.log('error');
            }
            else {

                return (
                    view_Cart.createCartCont(data),
                    view_Cart.model_UiCart_List(data, units)

                    // view_Cart.render_Total(total)
                )
            }
        } catch (error) {
            console.log(error);
        }
    }



}
//check update total sending total with input value


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

const cart_Instance = new Control_cart(total)
const controller = new Control_View_Information_At_DOM
const controller_Cart = new Control_cart
const controller_Favorites = new Control_Favorites()

export {
    instance_Control_Routes,
    cart_Instance,
    controller,
    controller_Favorites,
    controller_Cart
}
'use strict'

import { products_Store, Control_Data } from "./model.js";
import { products_Instance, View_cart, Category_ui } from "./view.js";

let controller_Store = await products_Store;
const control_Data_Model = new Control_Data

const cart_New = new View_cart




let cart = []
//-----------------------------------------------------------------------------//
class Cart {

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

    push_Into_Cart(idElement = '') {
        cart.push(controller_Store.find(ele => ele.id === parseInt(idElement)));
        control_Data_Model.save_Cart_Db(cart)

        cart_Instance.calculate_Total_Into_Cart(cart);
        return cart_New.createListCart(cart)
    }

    calculate_Total_Into_Cart = (product = '') => {
        const initialValue = 0;
        const total = product.reduce((preValue, currValue) => preValue + currValue.price, initialValue);
        console.log(total);
    };

    delete_Product_At_Cart(idElement = '') {
        cart = cart.filter(ele => { return ele.id != parseInt(idElement) });
        console.log('Update cart: ', cart);
    };

}
//-----------------------------------------------------------------------------//
/**
 * It takes a category as an argument, filters the controller_Store array by that category, and returns
 * a new array with the filtered data
 * @param category - The category of the element you want to filter.
 */

const category_Instance = new Category_ui


const filterElementByCategory = (category) => {
    let newFilter = '';
    controller_Store.filter(data => data.category === category).map(dataFiltered => {
        newFilter = dataFiltered;
        category_Instance.create_Category_UI_Cards (newFilter)
        return newFilter;
    })
}

products_Instance.create_Card(controller_Store)

const cart_Instance = new Cart()

export {
    cart_Instance,
    filterElementByCategory,
    controller_Store,
    cart

}
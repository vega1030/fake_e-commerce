'use strict'

import { products_Store } from "./model.js";
import { products_Instance, createCartCont, create_Category_UI } from "./view.js";

let controller_Store = await products_Store;

let cart = [];


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
        cart_Instance.calculate_Total_Into_Cart(cart);
        return createCartCont(cart)
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

const filterElementByCategory = (category) => {
    let newFilter = '';
    controller_Store.filter(data => data.category === category).map(dataFiltered => {
        newFilter = dataFiltered;
        return create_Category_UI(newFilter);
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
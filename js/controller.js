'use strict'

import { products_Store, Control_Data } from "./model.js";
import { products_Instance, View_cart, Category_ui } from "./view.js";

let controller_Store = await products_Store;






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

class Filter_Feactures {


    filterElementsAndCreateNewObject(category) {
        controller_Store.filter(data => data.category === category).forEach(dataFiltered => {
            const filterProducts = {
                id: dataFiltered.id,
                category: dataFiltered.category,
                title: dataFiltered.title,
                image: dataFiltered.image
            }
            console.log(filterProducts);
        })
    }



    send_Categories_In_View(products) {
        let result = products.reduce((value, i) => {
            if (!value.some(data => data.category === i.category)) {
                value.push(i)
            }
            return value
        }
            , [])
        category_Instance_View.createDynamicCategoryNav(result)
    };

    filterElementByCategory(category) {
        const newFilter = controller_Store.filter(data => data.category === category)
        category_Instance_View.create_Category_UI_Cards(newFilter)

    }
}


/* This is a event listener that is listening to the click event on the dropdown menu. */


const control_Data_Model = new Control_Data
const category_Instance_View = new Category_ui
const filter_Feactures = new Filter_Feactures
const cart_New = new View_cart

document.querySelector('.dropdown-menu').addEventListener('click', (event) => { filter_Feactures.filterElementByCategory(event.target.id) })
filter_Feactures.send_Categories_In_View(controller_Store)
filter_Feactures.filterElementsAndCreateNewObject(controller_Store)
products_Instance.create_Card(controller_Store)

const cart_Instance = new Cart()

export {
    cart_Instance,
    controller_Store,
    cart

}
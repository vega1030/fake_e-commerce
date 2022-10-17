'use strict'

import { calls_To_API, Control_Data } from "./model.js";
import { View_cart, Category_ui, Product } from "./view.js";



const product_Instance_Controller = new Product()


let cart = []

const categories_UI = new Category_ui
//----------------------------------------------------------------
class Control_View_Information_At_DOM {

    constructor(data = []) {
        this._data = data
    }

    async control_View_All_Products(products) {
        product_Instance_Controller.create_Card(products)
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
                    product_Instance_Controller.create_Card(data));
        }
    }

    async send_Id(id) {
        if (id === '') {
            console.log('error');
        }
        else {
            return await calls_To_API.get_Single_Product(id).then(data => console.log(data));
        }
    }

}

//----------------------------------------------------------------
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

    // push_Into_Cart(idElement = '') {
    //     cart.push(controller_Store.find(ele => ele.id === parseInt(idElement)));
    //     control_Data_Model.save_Cart_Db(cart)

    //     cart_Instance.calculate_Total_Into_Cart(cart);
    //     return cart_New.createListCart(cart)
    // }

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


    // filterElementsAndCreateNewObject(category,data='') {

    //     data.filter(data => data.category === category).forEach(dataFiltered => {
    //         const filterProducts = {
    //             id: dataFiltered.id,
    //             category: dataFiltered.category,
    //             title: dataFiltered.title,
    //             image: dataFiltered.image
    //         }
    //         console.log(filterProducts);
    //     })
    // }



    send_Categories_In_View() {

        // category_Instance_View.createDynamicCategoryNav( res);

        // category_Instance_View.createDynamicCategoryNav ()

        // let result = products.reduce((value, i) => {
        //     if (!value.some(data => data.category === i.category)) {
        //         value.push(i)
        //     }
        //     return value
        // }
        //     , [])
        // category_Instance_View.createDynamicCategoryNav(result)
    };

    filterElementByCategory(category) {
        const controller_Store = products_Store;
        const newFilter = controller_Store.filter(data => data.category === category)
        category_Instance_View.create_Category_UI_Cards(newFilter)

    }
}


/* This is a event listener that is listening to the click event on the dropdown menu. */


// const control_Data_Model = new Control_Data
// const category_Instance_View = new Category_ui
// const filter_Feactures = new Filter_Feactures
// const cart_New = new View_cart


const cart_Instance = new Cart()
const controller = new Control_View_Information_At_DOM



export {
    cart_Instance,
    cart,
    controller,
}
"use strict";

import { cart_Instance } from "./controller.js";

class Product {
    constructor(title, category, price, description, id, image) {
        this._title = title;
        this._category = category;
        this._price = price;
        this._description = description;
        this._id = id
        this._image = image
    }

    set image(newImage) {
        this._image = newImage
    }

    get image() {
        return this._image;
    }

    ////********----------------------- */


    /* Creating a getter and setter for the title property. */

    set title(newTitle) {
        this.title = newTitle

    }

    get title() {
        return this._title
    }

    ////********----------------------- */

    /* A getter and setter for the category property. */
    set category(newCategory) {
        this._category = newCategory
    }
    get category() {
        return this._category
    }

    ////********----------------------- */


    /* A getter and setter for the price property. */
    set price(newPrice) {
        this._price = newPrice
    }
    get price() {

        return this._price
    }

    ////********----------------------- */


    /* A getter and setter for the description property. */
    set description(newDescription) {
        this._description = newDescription
    }
    get description() {
        return this._description
    }
    /* Creating a card with the information of the product. */

    create_Card(product, flag = '') {

        const content_Cards = document.querySelector("#content_card");
        const $content_Categories = document.querySelector('#section_categories')

        let cards = "";

        product.forEach((data) => {
            cards +=
                `
            <div class="content-sale__child">
                <img src="${ data.image }" class="${ data.title } img-cards-product" alt="" srcset="">
                <div class="content-text">
                    <h3 class="name_product">${ data.title.slice(0, 13) }</h3>
                    <h4>€ ${ data.price }</h4>                        
                </div>
                <div class="content-buttons___card">
                <button type="button" id ="${ data.id }" class="btn btn-primary btn-card btn_push_element">comprar</button>
                <button type="button" id ="${ data.id }" class="btn btn-primary btn-card btn_delete_element">DELETE AT CART</button>
                </div>
            </div>
            `;

            content_Cards.innerHTML = cards;
        })

        const btn_Push_Cart = document.querySelectorAll('.btn_push_element')
        btn_Push_Cart.forEach((element) => {
            element.addEventListener('click', (e) => {
                cart_Instance.push_Into_Cart(e.target.id)
            });
        })
        const btn_Delete_Cart = document.querySelectorAll('.btn_delete_element')
        btn_Delete_Cart.forEach((element) => {
            element.addEventListener('click', (e) => {
                cart_Instance.delete_Product_At_Cart(e.target.id)
            });
        })
    }
}
class View_cart {

    createListCart = (products) => {
        cart_Ui.createCartCont(products)
        products.forEach(elements => {
            return (elements)
        })
    }
    createCartCont = (arr) => {
        const counter = document.querySelector('#count_elements_at_cart')
        const content_Counter = document.querySelector('#content_count_cart')

        counter.innerText = JSON.stringify(arr.length)
        content_Counter.appendChild(counter)

    }
}



class Category_ui {

    constructor(category) {
        this._category = category;
    }

    set category(newCategory) {
        this._category = newCategory;
    }

    get category() {
        return this._category;
    }

    createDynamicCategoryNav(categories) {

        const containt_Li_In_Header = document.querySelector('#ul_List')
        let modelNavHeader = "";
        products_Instance.create_Card(categories, true)
        categories.forEach((elements) => {
            modelNavHeader +=
                `
            <li><a class="dropdown-item" href="#" id="${ elements.category }"> ${ elements.category } </a></li>
            `;
            containt_Li_In_Header.innerHTML = modelNavHeader

        })

    }

    create_Category_UI_Cards = (data) => {
        console.log(data);
        products_Instance.create_Card(data, true)
    }

}
const cart_Ui = new View_cart;


const products_Instance = new Product;




export {
    products_Instance,
    View_cart,
    Category_ui
}

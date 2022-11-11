"use strict";

import { controller, cart_Instance } from "./controller.js";

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

    ////******** ---------------------- ******************/


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

    create_Card(product, flag) {
        const card_Model = (products, content_Data_In_DOM, global_Variable) => {
            products.forEach(data => {
                global_Variable +=
                    `
                <div class="content-sale__child">
                    <img src="${ data.image }" class="${ data.title } img-cards-product" alt="" srcset="">
                    <div class="content-text">
                    <a href="#" class="content_names" id="${ data.id }">
                        <h3 class="name_product">${ data.title.slice(0, 13) }</h3>
                    </a>                      
                        <h4>€ ${ data.price }</h4>  
                    </div>
                    <div class="content-buttons___card">
                        <button type="button" id ="${ data.id }" class="btn btn-primary btn-card btn_push_element">comprar</button>
                        <button type="button" id ="${ data.id }" class="btn btn-primary btn-card btn_delete_element">DELETE AT CART</button>
                    </div>
                </div>
                `;
                return content_Data_In_DOM.innerHTML = global_Variable
            })
        }
        const content_Cards = document.querySelector("#content_card");
        const $content_Categories = document.querySelector('#_categories')

        let cards = "";
        let filtered_cards = ""


        flag === true ? card_Model(product, $content_Categories, filtered_cards) : card_Model(product, content_Cards, cards)

        const anchor_Name = document.querySelectorAll('.content_names')

        anchor_Name.forEach((element) => {
            element.addEventListener('click', (e) => {
                controller.send_Id(e.target.parentNode.id)
            })
        })

        const btn_Push_Cart = document.querySelectorAll('.btn_push_element')
        btn_Push_Cart.forEach((element) => {
            element.addEventListener('click', (e) => {
                cart_Instance.send_Id_To_Cart(parseInt(e.target.id))
            });
        })
        const btn_Delete_Cart = document.querySelectorAll('.btn_delete_element')
        btn_Delete_Cart.forEach((element) => {
            element.addEventListener('click', (e) => {
                // cart_Instance.delete_Product_At_Cart(e.target.id)
            });
        })
    }

    uI_Individual_Card(product) {
        const content_Individual_Cards = document.querySelector('#individual_product')

        let model_Card = ''
        model_Card =
            `
        <div class="content_title">
        <h1> ${ product.title }</h1>
    </div>
    <div class="content_price">
        <h3>${ product.price }</h3>
    </div>
    <div class="content_description">
        <p>

            ${ product.description }
        
        </p>
    </div>
    <div class="content_image">
        <img src="${ product.image }" alt="image${ product.title }" class="image_style">
    </div>
        `    }
}

class Handler_Displayes_Ui {

    handler_Display_(hash) {
        if (hash === 'categories') {
            return (
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#_categories').style.display = 'grid'
            )
        }
        if (hash === 'home') {
            return (
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('#home').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none'
            )
        }
        if (hash === 'cart') {
            return (
                document.querySelector('.cart_style').style.display = 'grid',
                document.querySelector('#home').style.display = 'none',

                console.log('cart')
            )
        }

    }



}

class View_cart {

    createListCart(products) {
        cart_Ui.createCartCont(products)
        products.forEach(elements => {
            console.log(elements);
            return (elements)
        })
    }
    createCartCont(arr) {
        const counter = document.querySelector('#count_elements_at_cart')
        const content_Counter = document.querySelector('#section_cart')

        counter.innerText = JSON.stringify(arr.length)
        content_Counter.appendChild(counter)

    }

    model_UiCart_List(arr) {
        const section_Content_Data = document.querySelector('#view_section_cart')
        const total_At_Cart = document.querySelector('#total_at_cart')

        let content_Data = ''
        arr.forEach(item => {

            content_Data =
                `

            <div class="containt_card____cart" id="$containt_card____cart">
                <button type="button" class="btn-close close" aria-label="Close"></button>
            <div class="content_image_product_at_cart">
                <img src="${ item.image }" alt="img" srcset="" class="img-card____cart">
            </div>

            <div class="content_description">
                <h2>${ item.title.slice(0, 13) }</h2>

            </div>

            <div class="price_and_cant">
                <h3>$${ item.price }</h3>
            </div>
            <div class="content_select">

            <select class="select_quantity_value form-select" aria-label="Default select example" id="select_quantity_value">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>
            <div class="content_total">
                <h3 id="total" class="total">123</h3>
            </div>
            </div>`
            
            console.log(item.price)
            const value_quantity_products = document.querySelectorAll('.select_quantity_value')
            value_quantity_products.forEach(data => data.addEventListener('click', (e) => {
                console.log(e)
            }))
        })


        section_Content_Data.insertAdjacentHTML('beforeend', content_Data)

        //check sum total value the option tag


        // const total = arr.reduce(
        //     (previous, current) => current.price + previous, 0);
        // console.log(total.toFixed(2))
        // total_At_Cart.innerHTML = total.toFixed(2);
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
        categories.forEach(elements => {
            modelNavHeader +=
                `
            <li><a class="dropdown-item route" href="#_categories" id="${ elements }"> ${ elements } </a></li>
            `;
            containt_Li_In_Header.innerHTML = modelNavHeader

        })

    }

    create_Category_UI_Cards = (data) => {
        products_Instance.create_Card(data)
    }


}
const cart_Ui = new View_cart();
const products_Instance = new Product();

document.querySelector('.dropdown-menu').addEventListener('click', (event) => { controller.send_Category(event.target.id) })
export {
    products_Instance,
    View_cart,
    Category_ui,
    Product, controller,
    Handler_Displayes_Ui
}
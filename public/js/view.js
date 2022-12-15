"use strict";

import { controller, cart_Instance, controller_Cart } from "./controller.js";

class Product {
    constructor(title, category, price, description, id, image) {
        this._title = title;
        this._category = category;
        this._price = price;
        this._description = description;
        this._id = id
        this._image = image
    }

    set image(image) {
        this._image = image
    }

    get image() {
        return this._image;
    }

    ////******** ---------------------- ******************/


    /* Creating a getter and setter for the title property. */

    set title(title) {
        this.title = title
    }

    get title() {
        return this._title
    }

    ////********----------------------- */

    /* A getter and setter for the category property. */
    set category(category) {
        this._category = category
    }
    get category() {
        return this._category
    }

    ////********----------------------- */


    /* A getter and setter for the price property. */
    set price(price) {
        this._price = price
    }
    get price() {

        return this._price
    }

    ////********----------------------- */


    /* A getter and setter for the description property. */
    set description(description) {
        this._description = description
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
                <a class="favorite" data-id="${ data.id }"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                </a>
                    <img src="${ data.image }" class="${ data.title } img-cards-product" alt="" srcset="">
                    <div class="content-text">
                    <a href="#individual_product" class="content_names view_one_element individual_product" data-id="${ data.id }">
                        <h3 data-id="${ data.id }" class="name_product">${ data.title.slice(0, 13) } </h3>
                    </a>                      
                        <h4> ${ data.price.toLocaleString('es-AR', { style: 'currency', currency: 'EUR' }) }</h4>  
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


        /* A function that change the color of the heart when user click,
        and send id product to saving*/



        const view_Element = document.querySelectorAll('.view_one_element')
        view_Element.forEach((element) => {
            element.addEventListener('click', () => {
                const data_Id = element.dataset.id
                return controller.send_Id(data_Id)
            })
        })

        Product.handler_Favorites()

    }


    static handler_Favorites() {
        let hearts = document.querySelectorAll('.favorite')
        hearts.forEach((element) => {
            element.addEventListener("click", (e) => {
                element.classList.forEach(data => {
                    if (data.includes('activate')) {
                        element.classList.remove('activate')
                    }
                    else {
                        const data_Id = Number(element.dataset.id)
                        controller.control_Favorites_Product(data_Id)
                        element.classList.add('activate')
                        console.log(data_Id);
                    }
                });
                const selection = e.target
                const color_selection = selection.style.color === 'red' ? 'initial' : 'red'
                selection.style.color = color_selection

                //add if and question: if class name is "activate add favorites"



                e.preventDefault()

            })



        })

    }

    static create_Selected_Favorites(favorites) {

        hearts.forEach((element) => {

        })


        console.log(checkEquals);
    }

    uI_Individual_Card(product) {
        const content_Individual_Cards = document.querySelector('#individual_product')
        let model_Card = ''
        product.forEach(item => {
            model_Card =
                `
        <div class="content_title___individual_item">
        <h1> ${ item.title }</h1>
    </div>
    <div class="content_price___individual_item">
        <h3>${ item.price.toLocaleString('es-AR', { style: 'currency', currency: 'EUR' }) }</h3>
    </div>
    <div class="content_description___individual_item">
        <p>

            ${ item.description }
        
        </p>
    </div>
    <div class="content_image___individual_item">
        <img src="${ item.image }" alt="image${ item.title }" class="image_style">

    </div>
    <div class="content-buttons___card">
    <button type="button" id ="${ item.id }" class="btn btn-primary btn-card btn_push_element">Add Cart</button>
</div>
 
        `    })
        console.log(model_Card);
        content_Individual_Cards.insertAdjacentHTML('afterbegin', model_Card)
        content_Individual_Cards.innerHTML = model_Card
    }
}
class Handler_Displays_Ui {

    handler_Display_(hash) {
        console.log(hash);
        if (hash === 'categories') {
            return (
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#_categories').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none'

            )
        }
        if (hash === 'home') {
            return (
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('#home').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'grid'

            )
        }
        if (hash === 'cart') {
            return (
                document.querySelector('.cart_style').style.display = 'grid',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none'

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


    model_UiCart_List(arr = "", units) {
        const section_Content_Data = document.querySelector('#view_section_cart')
        let content_Data = ''
        arr.forEach(item => {

            content_Data =
                `
                <div class="containt_card____cart" id="$containt_card____cart" data-id = ${ item.id }>
                <button type="button" class="btn-close close btn_delete_element" aria-label="Close"></button>
            <div class="content_image_product_at_cart">
                <img src="${ item.image }" alt="img" srcset="" class="img-card____cart">
            </div>

            <div class="content_description">
                <h2>${ item.title.slice(0, 13) }</h2>

            </div>

            <div class="price">
                <h3>$${ item.price
                }</h3>
            </div>
            <div class="content_select">
                <a id="add">+</a> <a id="">-</a>
            <input type="number" min="1" max="10" data-id = ${ item.id } type="number" 
            class="count form-control" value=${ units }
            </div>
            </div>
            `

        })

        //********--RENDER--- */
        section_Content_Data.insertAdjacentHTML('afterbegin', content_Data)

        const btn_Delete_Cart = document.querySelectorAll('.btn_delete_element')
        btn_Delete_Cart.forEach((element) => {
            element.addEventListener('click', (e) => {
                cart_Instance.handler_Delete_Element_Cart(parseInt(e.target.id))
            });
        })

        const items_At_Card_Ui = document.querySelectorAll('.containt_card____cart')

        items_At_Card_Ui.forEach(item => {
            const quantity = item.querySelector('.count')
            console.log(quantity.value);
            const price_Ui = Number(item.querySelector('.price').textContent.replace('$', ''))
            cart_Instance.calculate_Total_Cart(quantity.value, price_Ui)

            quantity.addEventListener('change', (e) => {
                const quantity = Number(e.target.value)

            })



        })
    }

    render_Total(total) {

        const $content_Total = document.querySelector('#content_total')
        const model_Total =
            `
        <h4 class="total" id="total_at_cart">$${ total.toFixed(2) }</h4>
        `
        $content_Total.innerHTML = model_Total
        //********----- */


        //Listeners

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
        const content_Li_In_Header = document.querySelector('#ul_List')
        let modelNavHeader = "";
        categories.forEach(elements => {
            modelNavHeader +=
                `
            <li><a class="dropdown-item route" href="#_categories" id="${ elements }"> ${ elements } </a></li>
            `;
            content_Li_In_Header.innerHTML = modelNavHeader

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
    Handler_Displays_Ui
}
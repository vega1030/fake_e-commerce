"use strict";

class Product {
    /* Creating a card with the information of the product. */
    create_Card(product, flag) {

        const card_Model = (products, content_Data_In_DOM, global_Variable) => {
            products.forEach(data => {
                global_Variable +=
                    `
                <div class="content-sale__child">
                    <button  type="button" class="favorite" id=${ data.id } data-id="${ data.id }" value = "on"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path class= "pathHeart" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                    </button>
                    <div class="content_photo">
                        <img src="${ data.image }" class="${ data.title } img-cards-product" alt="" srcset="">
                    </div>
                <div class="content-text">
                    <a href="#individual_product" class="content_names view_one_element individual_product" data-id="${ data.id }">
                        <h3 data-id="${ data.id }" class="name_product">${ data.title.slice(0, 20) }... </h3>
                    </a>                      
                    <h4 class= price> ${ data.price.toLocaleString('es-AR', { style: 'currency', currency: 'EUR' }) }</h4>  
                </div>
                <button class='btn_add_to_cart' id='${ data.id }'>
                Add Cart 
                </button>
                <button class='btn_delete_element_cart' id='${ data.id }'>
                delete 
                </button>
                
                </div>
                `;
                return content_Data_In_DOM.innerHTML = global_Variable
            })
        }
        const content_Cards = document.querySelector("#content_card");
        const $content_Categories = document.querySelector('#_categories')

        let cards = "";
        let filtered_cards = ""

        /* The above code is checking if the flag is true, if it is true, it will run the card_Model function
        with the filtered_cards array, if it is false, it will run the card_Model function with the cards
        array. */
        flag === true ? card_Model(product, $content_Categories, filtered_cards) : card_Model(product, content_Cards, cards)



        const btns_Delete_Cart = document.querySelectorAll('.btn_delete_element_cart')
        btns_Delete_Cart.forEach(i => i.addEventListener('click', (e) => {
            const id = Number(e.target.id)
            return controller_Cart.handle_Id_Cart_delete(id)
        }))

        /* A function that change the color of the heart when user click,
        and send id product to saving*/

        const view_Element = document.querySelectorAll('.view_one_element')
        view_Element.forEach((element) => {
            element.addEventListener('click', (e) => {
                const data_Id = Number(element.dataset.id)
                console.log(e.target.parentElement.attributes.href)
                return controller.send_Id(data_Id)

            })
        })
        View_Favorites.handler_Favorites()

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
        <h3>${ item.price }\u20AC</h3>
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
        content_Individual_Cards.insertAdjacentHTML('afterbegin', model_Card)
        content_Individual_Cards.innerHTML = model_Card
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
        const content_Li_In_Header = document.querySelector('#list_classification')
        let modelNavHeader = "";
        categories.forEach(elements => {
            modelNavHeader +=
                `
                    <li class="dropdown-item_ul">
                        <a class="dropdown-item listener_category route" href="#_categories" id="${ elements }"> ${ elements } </a>
                    </li>
                `;
            return content_Li_In_Header.innerHTML = modelNavHeader
        })


    }

    create_Category_UI_Cards = (data) => {
        products_Instance.create_Card(data)
    }
}

// create shopping cart with vanilla javascript?    

class View_Favorites {

    constructor(favorites) {
        this._favorites = favorites
    }

    static handler_Favorites() {
        const hearts = document.querySelectorAll('.favorite')
        hearts.forEach((element) => {
            element.addEventListener("click", (e) => {
                const data_Id = Number(element.dataset.id)
                console.log(e.target.style)
                e.target.style.fill === 'red' ? e.target.style.fill = 'white' : e.target.style.fill = 'red'

                const valueFavorites = element.value === 'on' ? element.value = 'off' : element.value = 'on'
                controller_Favorites.send_Favorite_Product_To_LocalStorage(data_Id, valueFavorites)
                e.stopPropagation()
            })
        })
    }


    static display_Favorites(product) {
        const model_Favorites = [ ...document.querySelectorAll('.favorite') ]
        model_Favorites.reduce((previous, current) => {
            if (product.find(i => i.id === Number(current.dataset.id))) {
                current.classList.add('red')
            }
        }, [])




        /*         
        */
        /* if (confirm === 'yes') {
            return i.nextElementSibling.childNodes[ 1 ].style.color = 'red'
        }
        return i.nextElementSibling.childNodes[ 1 ].style.color = 'white' */

        /*         const content_Favorites = document.querySelector('#content_favorites')
                let model_Favorites = '' */

    }

}

class View_cart {



    /**
     * It creates a counter for the cart and appends it to the cart section
     * @param quantity - the number of items in the cart
     */



    createCartCont(quantity) {
        const counter = document.querySelector('#count_elements_at_cart')
        const content_Counter = document.querySelector('#section_cart')
        quantity > 9 ? counter.innerText = '+9' : counter.innerText = JSON.stringify(quantity)
        content_Counter.appendChild(counter)

    }

    cart_In_Controller = (newCart) => {
        //here is cart
        this.model_UiCart_List(newCart)

    }


    model_UiCart_List = (cart) => {
        render_Total_And_Pay(cart)
        let content_Data = ''
        const section_Content_Data = document.querySelector('#ui_Cart')

        /****************************** */



        cart.forEach(item => {
            const model_Trash_Basket =
                `<img src="../../public/icon/trash_basket.svg" alt="trash" class='trash_count' data-id=${ item.id }>`;
            content_Data =
                `
                <div class="content_card____cart" id="$content_card____cart" data-id = ${ item.id }>
                    <div class="content_image_product_at_cart content_photo">
                        <img src="${ item.image }" alt="img" srcset="" class="img-card____cart">
                    </div>
                
                    <div class="content_description">
                        <h5>${ item.title.slice(0, 20) }</h5>
                    </div>
                    <div class="price">
                        <h4>${ item.price }\u20AC </h4>
                    </div>
                
                    <div class="content_select">
                        <a class="subtract" data-id=${ item.id }> ${ item.quantity === 1 ? model_Trash_Basket : '-' } </a>
                        <input type="number" min="0" max="10" data-id = ${ item.id } type="number" 
                        class="count form-control" value=${ item.quantity }>
                        <a class="add" data-id=${ item.id }> + </a>   
                    </div>

                </div>
                `
            return section_Content_Data.insertAdjacentHTML('beforeend', content_Data)
        })
        /******************************/

        /******************************/

    }

    handle_Delete_Element_In_DOM(element) {
        return element.remove()
    }

}


const replace_Minus_Symbol_For_Trash_Basket = (content_trash, flag = false) => {

    const inputValue = content_trash.value

    if (flag === true) {
        const dataSetId = content_trash.dataset.id;
        const model_Trash_Basket =
            `<img src="../../public/icon/trash_basket.svg" alt="trash" class='trash_count' data-id=${ dataSetId }>`;
        return content_trash.innerHTML = model_Trash_Basket;
    }
    else {
        return content_trash.innerHTML = '-'
    }

}

const render_Total_And_Pay = (cart) => {

    if (cart === '') {
        const model_Empty = `<h1>El carro esta vacio</h1>`
        return section_Content_Data.innerHTML = model_Empty
    }
    const total_Render = document.querySelector('#content_total')

    if (total_Render) {
        total_Render.remove()
    }

    const model_Total = cart.reduce((previous, current) => {
        return `
        <div id="content_total" class="content_total">
        <h3>Subtotal ${ parseFloat(current.price * current.quantity).toFixed(2) }\u20AC</h3>º
        <a href="#" class="btn_confirm_buy">
        Pagar pedido (${ current.quantity + previous } productos)
        </a>
        </div>`
    }, 0)
    console.log(model_Total);
    // Añadir el nuevo contenido HTML al inicio del elemento
    const $total = document.querySelector('#view_section_cart')
    $total.insertAdjacentHTML('afterbegin', model_Total);
    console.log(total_Render);



}

/* This class is responsible for displaying the correct section of the page based on the hash in the
url */

class Handler_Displays_Ui {


    static reload_Page = () => {
        const reload_Handler = document.querySelector('#init')
        reload_Handler.addEventListener('click', () => {
            window.location.reload()
        })
    }

    handler_Display_(hash) {
        if (hash === 'categories') {
            return (
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#_categories').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'none',
                document.querySelector('#individual_product').style.display = 'none'


            )
        }
        if (hash === 'home') {
            return (
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('#home').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'grid',
                document.querySelector('#favorites_section').style.display = 'none'

            )
        }
        if (hash === 'cart') {
            return (
                document.querySelector('.cart_style').style.display = 'grid',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'none',
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('#section_cart').style.display = 'flex',
                document.querySelector('#content').style.display = 'none'

            )
        }
        if (hash === 'favorites') {
            return (
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'grid'
            )
        }
        if (hash === 'individual_product') {
            return (
                console.log(hash),
                document.querySelector('#individual_product').style.display = 'grid',
                document.querySelector('#_categories').style.display = 'none',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'none'

            )
        }

    }
}

Handler_Displays_Ui.reload_Page()

const cart_Ui = new View_cart();


const products_Instance = new Product();



export {
    products_Instance,
    cart_Ui,
    Category_ui,
    Product,
    Handler_Displays_Ui,
    View_Favorites,
    replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay,
    View_cart
}
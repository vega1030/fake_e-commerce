"use strict";
import { TemplateCardsHome } from "./classes/TemplateCardsHome.js";
class TemplateCards {


    constructor(heartsDom) {
        this.heartsDom = heartsDom
        this.modelCard = ''
        this.modelIndividualCard = ''
        this.products = ''
    }

    /* Creating a card with the information of the product. */


    /* -------------------------------------- */

    uI_Individual_Card(product, productDOMId = 0) {
        console.log(product)
        let model = ''
        this.modelIndividualCard = ''

        
        const coincidentElements = Number(this.heartsDom.dataset.id) === product.id

        const content_Individual_Cards = document.querySelector('#individual_product')
        
        content_Individual_Cards.innerHTML = ''
        //initialize color
        const initialColor = coincidentElements === undefined ? 'black' : 'red'
        //-----
        model =
            `
            <div class='content-button-favorite' data-id="${ product.id }">
            <button type="button" class="favorite individual-favorite" data-id="${ product.id }" value="on"> 
                <svg data-id="${ product.id }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=${ initialColor } class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path data-id="${ product.id }" class="pathHeart heart-path" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
            </button>
        </div>
            <div class="content_title___individual_item">
                <h1> ${ product.title }</h1>
            </div>
            <div class="content_price___individual_item">
                <h3>${ product.price }\u20AC</h3>
            </div>
            <div class="content_description___individual_item">
                <p>
                    ${ product.description }
                </p>
            </div>
            <div class="content_image___individual_item ">
                <img src="${ product.image }" alt="image${ product.title }" class="image_style">
            </div>
            <div class="content-buttons___individual_item">
                <button type="button" data-id ="${ product.id }" class="btn btn-primary btn-card individual_btn_add_to_cart">Add Cart</button>
            </div>
        `
        this.modelIndividualCard = model
        return this.modelIndividualCard
    }

    insertIndividualCard() {
        const content_Individual_Cards = document.querySelector('#individual_product')
        content_Individual_Cards.insertAdjacentHTML('afterbegin', this.modelIndividualCard)

    }


    changeColorHeart() {
        const content_Individual_Cards = document.querySelector('#individual_product')
        content_Individual_Cards.addEventListener('click', (e) => {
            const isInsideFavorite = e.target.closest('.individual-favorite');
            if (isInsideFavorite) {
                const heart = e.currentTarget.querySelector('.individual-favorite > svg');
                const currentColor = heart.getAttribute('fill');
                if (currentColor === 'black') {
                    heart.setAttribute('fill', 'red');
                } else {
                    heart.setAttribute('fill', 'black');
                }
            }
        });

    }

    //create a method for creating the view of the purchases of the user
    createPurchasesView(purchases) {
        const contentPurchases = document.querySelector('#content_purchases');
        contentPurchases.innerHTML = '';
        purchases.forEach(purchase => {
            const purchaseElement = document.createElement('div');
            purchaseElement.classList.add('purchase');
            purchaseElement.innerHTML = `
                <h3>${ purchase.title }</h3>
                <p>${ purchase.description }</p>
                <p>${ purchase.price }</p>
            `;
            contentPurchases.appendChild(purchaseElement);
        });
    }


}
//---------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------------------------------------

class Category_ui {
    createDynamicCategoryNav(categories) {
        const content_Li_In_Header = document.querySelector('#list_classification')
        let modelNavHeader = "";
        categories.forEach(elements => {
            modelNavHeader +=
                `
                    <li class="dropdown-item_ul">
                        <a class="dropdown-item listener_category route" href="#_categories" data-category="${ elements }"> ${ elements } </a>
                    </li>
                    `;
            if (content_Li_In_Header) {
                return content_Li_In_Header.innerHTML = modelNavHeader;
            };
        });
    };

    displayProductsByCategory = (data) => {
        const contentCards = document.querySelector('#content_card')
        const products_Instance = new TemplateCardsHome()
        products_Instance.create_Card(data)
        contentCards.innerHTML = products_Instance.modelCard
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------

class View_Favorites {

    constructor(favorites) {
        this.favorites = favorites
        this.id = ''
        this.fav_DOM = ''
    }


    createFavoriteListUI(data) {
        console.log(data)
        const contentCardFavorite = document.querySelector('#favorites_section')
        products_Instance.create_Card(data)
        contentCardFavorite.innerHTML = products_Instance.modelCard
        this.favorites = data
        return this.favorites
    }

    deleteCardFavorite() {
        const contentFavorite = document.querySelector('#favorites_section')
        contentFavorite.addEventListener('click', (e) => {
            if (e.target.nodeName === 'path') {
                e.target.parentElement.parentElement.parentElement.remove()
            }

        })
    }

    display_FavoritesHeart(product) {
        //check color state here
        const content_Cards = document.querySelector('.main-grid')

        const cardsClass = String('.' + content_Cards.firstElementChild.classList[ 0 ])
        const cards = [ ...document.querySelectorAll(cardsClass) ]
        const select =
            cards.map(current => {

                current.firstElementChild.firstElementChild.style.color = 'black'
                //____
                const matchingProduct = product.find(item => item.id === Number(current.firstElementChild.dataset.id));
                return matchingProduct ? current : null;
            });
        this.fav_DOM = select.filter(item => item !== null)

        this.fav_DOM.map(i => i.children[ 0 ].firstElementChild).forEach(i => {

            const changueColor = () => { i.style.color === 'black' ? i.style.color = 'red' : i.style.color = 'black' }
            product === undefined ? i.style.color === 'black' : changueColor()
        })
        /* The above code is assigning the value of `this.fav_DOM` to the `heartsDom` property of the
        `products_Instance` object in JavaScript. */
        const products_Instance = new TemplateCards()
        products_Instance.heartsDom = this.fav_DOM
        //------------------------------------------------------------------------------------------------------------------------------
        return this.fav_DOM

    }
}
//---------------------------------------------------------------------------------------------------------------------------------------

class Display_Data_Firebase_User {

    constructor(dataUser) {
        this.dataUser = dataUser
    }

    displayProfilePhoto(userImg) {
        const contentImageProfile = document.querySelector('#content-img-profile');
        contentImageProfile.innerHTML = '';
        const userAvatar = userImg === undefined ? './icon/user.png' : userImg
        const imgProfile = document.createElement('IMG');
        const listenerMenu = document.createElement('A')

        imgProfile.src = userAvatar
        imgProfile.alt = 'avatar image';
        imgProfile.className = 'img-user';
        listenerMenu.className = 'link-to-user-menu'

        console.log(listenerMenu)
        listenerMenu.appendChild(imgProfile)
        contentImageProfile.appendChild(listenerMenu);
    }

    displayUserName() {
        return this.dataUser.displayName
    }

    displayUserEmail() {
        return this.dataUser.email
    }

}
//---------------------------------------------------------------------------------------------------------------------------------------
class View_cart {

    /**
     * The function creates a cart container and updates the quantity of items in the cart.
     * @param quantity - The quantity parameter is a number that represents the number of items in a
     * shopping cart.
     */
    createCartCont(quantity) {

        const counter = document.querySelector('#count_elements_at_cart')
        const content_Counter = document.querySelector('#section_cart')
        if (counter) {
            quantity > 9 ? counter.innerText = '+9' : counter.innerText = JSON.stringify(quantity)
            return content_Counter.appendChild(counter)
        }

    }

    /* The above code defines a function `model_UiCart_List` that takes in a `cart` object as a parameter.
    It then creates a new container and dynamically generates HTML elements for each item in the `cart`
    object. The generated elements include an image of the product, its title, price, and a quantity
    selector with add and subtract buttons. The function also adds a trash basket icon to the subtract
    button if the quantity of the item is 1. Finally, the function appends the generated elements to the
    `ui_Cart` section of the HTML document. */

    model_UiCart_List = (cart) => {
        if (cart === null) { return }
        const section_Content_Data = document.querySelector('#ui_Cart')

        section_Content_Data.innerHTML = ''

        //create a new container
        const container = document.createElement('div');

        //create dynamic elements

        const newCart = cart.map(item => {
            const contentTrash = document.createElement('img')
            contentTrash.src = '../../public/icon/trash_basket.svg'
            contentTrash.alt = 'trash basket'
            contentTrash.classList.add('trash_count')
            contentTrash.setAttribute('data-id', item.id);




            const content_Data = document.createElement('div');
            content_Data.classList.add('content_card____cart');
            content_Data.setAttribute('data-id', item.id);



            const content_Image_Product = document.createElement('div');
            content_Image_Product.classList.add('content_image_product_at_cart', 'content_photo');

            const img_Product = document.createElement('img');
            img_Product.classList.add('img-card____cart');
            img_Product.src = item.image;
            img_Product.alt = 'img';

            content_Image_Product.appendChild(img_Product);

            const content_Description = document.createElement('div');
            content_Description.classList.add('content_description');

            const h5 = document.createElement('h5');
            h5.textContent = item.title.slice(0, 20);
            content_Description.appendChild(h5);

            const price = document.createElement('div');
            price.classList.add('price');

            const h4 = document.createElement('h4');
            h4.textContent = `${ item.price }\u20AC`;
            price.appendChild(h4);

            const content_Select = document.createElement('div');
            content_Select.classList.add('content_select');

            const subtractBtn = document.createElement('a');
            subtractBtn.classList.add('subtract');
            subtractBtn.setAttribute('data-id', item.id);


            const countInput = document.createElement('input');
            countInput.classList.add('count', 'form-control');
            countInput.setAttribute('type', 'number');
            countInput.setAttribute('min', '0');
            countInput.setAttribute('max', '10');
            countInput.setAttribute('data-id', item.id);
            countInput.value = item.quantity;

            const addBtn = document.createElement('a');
            addBtn.classList.add('add');
            addBtn.setAttribute('data-id', item.id);
            addBtn.textContent = '+';

            content_Select.appendChild(subtractBtn);
            content_Select.appendChild(countInput);
            content_Select.appendChild(addBtn);

            content_Data.appendChild(content_Image_Product);
            content_Data.appendChild(content_Description);
            content_Data.appendChild(price);
            content_Data.appendChild(content_Select);

            section_Content_Data.appendChild(content_Data);
            item.quantity === 1 ? subtractBtn.appendChild(contentTrash) : subtractBtn.textContent = '-';

            return { ...item, content_Data };
        });

    }


    handle_Delete_Element_In_DOM(element) {
        return element.remove()
    }

}
/* This class is responsible for displaying the correct section of the page based on the hash in the url */

class Handler_Displays_Ui {

    handler_Display_(hash) {
        console.log(hash)
        if (hash === 'categories') {
            return (
                document.querySelector('#home').style.display = 'none',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'grid',
                document.querySelector('#favorites_section').style.display = 'none',
                document.querySelector('#individual_product').style.display = 'none',
                document.querySelector('#content').style.display = 'grid'
            )
        }
        if (hash === 'home') {
            return (
                document.querySelector('#home').style.display = 'grid',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#content_card').style.display = 'grid',
                document.querySelector('#favorites_section').style.display = 'none',
                document.querySelector('#individual_product').style.display = 'none',
                document.querySelector('#content').style.display = 'grid'
            )
        }
        if (hash === 'cart') {
            return (
                document.querySelector('.cart_style').style.display = 'grid',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#section_cart').style.display = 'flex',
                document.querySelector('#content').style.display = 'none',
                document.querySelector('#individual_product').style.display = 'none'

            )
        }
        if (hash === 'favorites') {

            return (
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'grid',
                document.querySelector('#individual_product').style.display = 'none',
                document.querySelector('#content').style.display = 'grid'
            )
        }
        if (hash === 'individual_product') {
            return (
                document.querySelector('#individual_product').style.display = 'grid',
                document.querySelector('#content_card').style.display = 'none',
                document.querySelector('.cart_style').style.display = 'none',
                document.querySelector('#home').style.display = 'none',
                document.querySelector('#favorites_section').style.display = 'none'
            )

        }

    }


}




/*-----||--- Special Functions ---||----- */

/**
 * This function replaces the content of an HTML element with a trash basket icon or a minus symbol
 * based on a flag parameter.
 * @param content_trash - It is an object that represents the HTML element that needs to be modified.
 * It could be a div, span, input, etc.
 * @param [flag=false] - The flag parameter is a boolean value that determines whether to replace the
 * content of the HTML element with an image of a trash basket or with a minus symbol. If flag is true,
 * the function will replace the content with an image of a trash basket, otherwise it will replace it
 * with a minus symbol.
 * @returns The function `replace_Minus_Symbol_For_Trash_Basket` returns either an HTML string
 * containing an image tag with a trash basket icon and a data-id attribute, or a hyphen symbol (-) as
 * a string, depending on the value of the `flag` parameter.
 */
const replace_Minus_Symbol_For_Trash_Basket = (content_trash, flag = false) => {

    const inputValue = content_trash.value

    if (flag === true) {
        const dataSetId = content_trash.dataset.id;
        const model_Trash_Basket =
            `<img src="./icon/trash_basket.svg" alt="trash" class='trash_count' data-id=${ dataSetId }>`;
        return content_trash.innerHTML = model_Trash_Basket;
    }
    else {
        return content_trash.innerHTML = '-'
    }

}

/**
 * The function calculates the total price and quantity of items in a shopping cart and renders it on
 * the webpage.
 * @param cart - The `cart` parameter is an array of objects representing the items in the shopping
 * cart. Each object contains properties such as `quantity` and `price` for a particular product. The
 * function calculates the total price and quantity of all items in the cart and renders it on the
 * page.
 * @returns Nothing is being returned explicitly in the `render_Total_And_Pay` function. However, if
 * the `cart` parameter is `null`, the function will return `undefined` due to the `return` statement
 * on the first line.
 */

const render_Total_And_Pay = (total_And_Quantity) => {
    if (cart === null) { return }
    const content_Model_Total = document.querySelector('#content_total')

    const render_Function = () => {
        if (content_Model_Total) {
            content_Model_Total.remove();
        }
        const $total = document.querySelector('#view_section_cart');
        const model_Total = `
        
            <aside id="content_total" class="content_total">
                <h3 class="total">Subtotal ${ parseFloat(total_And_Quantity.total.toFixed(2)) }\u20AC</h3>
                <a href="#home" class="btn_confirm_buy quantity"  id="pay_confirm">
                    Pagar pedido (${ total_And_Quantity.quantity } productos)
                </a>
            </aside>
        
        
        `;
        if ($total) {

            return $total.insertAdjacentHTML('afterbegin', model_Total);
        }

    }

    render_Function()
}

const filterProducts = () => {
    const btnSearch = document.querySelector('#btn-search')
    btnSearch.addEventListener('click', (e) => {
        const inputValue = e.target.form.firstElementChild.value
        // Here filter products
        return inputValue
    })
}
filterProducts()


if (typeof localStorage !== 'undefined') {
    const colorHeartInstance = new TemplateCards()
    colorHeartInstance.changeColorHeart()
}

export {
    Category_ui,
    TemplateCards,
    Handler_Displays_Ui,
    View_Favorites,
    Display_Data_Firebase_User,
    View_cart,
    replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay,
}
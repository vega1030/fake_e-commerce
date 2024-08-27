"use strict";




export class InsertTemplate {

    async insertTemplate(template) {
        const contentMainProduct = document.querySelector("#home")
        contentMainProduct.innerHTML = template
        console.log(contentMainProduct);
        return contentMainProduct;
    }
}


class TemplateCards {


    constructor(heartsDom) {
        this.heartsDom = heartsDom
        this.modelCard = ''
        this.modelIndividualCard = ''
        this.products = ''
    }

    /* Creating a card with the information of the product. */


    /* -------------------------------------- */


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
                    console.log('black');
                    heart.setAttribute('fill', 'red');
                } else {
                    console.log('red');
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

    displayProfilePhoto(userAvatar= '../../icon/user.png') {
        const contentImageProfile = document.querySelector('#content-img-profile');
        contentImageProfile.innerHTML = '';

        const imgProfile = document.createElement('IMG');
        const listenerMenu = document.createElement('A')

        imgProfile.src = userAvatar
        imgProfile.alt = 'avatar image';
        imgProfile.className = 'img-user';
        listenerMenu.className = 'link-to-user-menu'

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

/* This class is responsible for displaying the correct section of the page based on the hash in the url */

class Handler_Displays_Ui {

    handler_Display_(hash) {
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

    const inputValue = content_trash
    console.log(inputValue)
    console.log(content_trash)

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

/* const filterProducts = () => {
    const btnSearch = document.querySelector('#btn-search')
    btnSearch.addEventListener('click', (e) => {
        const inputValue = e.target.form.firstElementChild.value
        // Here filter products
        return inputValue
    })
} */
/* filterProducts()
 */

if (typeof localStorage !== 'undefined') {
    const colorHeartInstance = new TemplateCards()
    colorHeartInstance.changeColorHeart()
}

export {
    TemplateCards,
    Handler_Displays_Ui,
    View_Favorites,
    Display_Data_Firebase_User,
    replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay,
}
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

                
                </div>
                `;
                if (content_Data_In_DOM) {
                    return content_Data_In_DOM.innerHTML = global_Variable
                }
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
            if (content_Li_In_Header) {
                return content_Li_In_Header.innerHTML = modelNavHeader
            }
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

            container.appendChild(content_Data);
            item.quantity === 1 ? subtractBtn.appendChild(contentTrash) : subtractBtn.textContent = '-';

            return { ...item, content_Data };
        });

        section_Content_Data.appendChild(container);
    }


    handle_Delete_Element_In_DOM(element) {
        return element.remove()
    }

}


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
            `<img src="../../public/icon/trash_basket.svg" alt="trash" class='trash_count' data-id=${ dataSetId }>`;
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
const render_Total_And_Pay = (cart) => {
    if (cart === null) { return }
    const total_And_Quantity = cart.reduce((previous, current) => {

        previous.quantity = current.quantity + previous.quantity;
        previous.total += current.quantity * current.price;
        return previous

    }, { total: 0, quantity: 0 })

    const content_Model_Total = document.querySelector('#content_total')

    const render_Function = () => {

        if (content_Model_Total) {
            content_Model_Total.remove();
        }

        const $total = document.querySelector('#view_section_cart');
        const model_Total = `
          <div id="content_total" class="content_total">
            <h3 class="total">Subtotal ${ parseFloat(total_And_Quantity.total.toFixed(2)) }\u20AC</h3>
            <a href="#" class="btn_confirm_buy quantity"  id="pay_confirm">
              Pagar pedido (${ total_And_Quantity.quantity } productos)
            </a>
          </div>
        `;
        if ($total) {
            return $total.insertAdjacentHTML('afterbegin', model_Total);
        }
    }

    render_Function()
}



/* This class is responsible for displaying the correct section of the page based on the hash in the
url */

class Handler_Displays_Ui {


    /*   static reload_Page = () => {
          const reload_Handler = document.querySelector('#init')
          reload_Handler.addEventListener('click', () => {
              window.location.reload()
          })
      } */

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

/* Handler_Displays_Ui.reload_Page()
 */
const cart = new View_cart()



const products_Instance = new Product();



export {
    products_Instance,
    Category_ui,
    Product,
    Handler_Displays_Ui,
    View_Favorites,
    replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay,
    View_cart
}
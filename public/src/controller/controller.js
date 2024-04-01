'use strict'
import { loadSpinner } from '../view/functions/spinner.js';

import {
    get_All_Products,
    get_Categories,
    get_View_Products_For_Category,
    get_Single_Product
} from '../api.js'

import { keySessionStorage, keysLocalStorage } from '../constants.js'

import { Drive_Data_Cart } from '../model/classes/Cart/Drive_Data_Cart.js'
import { StorageService } from '../model/classes/storage/StorageService.js'
import { Controller_Favorites } from './classes/Controller_Favorites.js'

import { ControlIndividualProduct } from './classes/ControlIndividualProduct.js'

import { Auth } from '../services/auth.js';

import {
    Category_ui, Handler_Displays_Ui,
    View_Favorites, View_cart, replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay, Display_Data_Firebase_User,
    TemplateCards
} from "../view/view.js";

import { controllerActivityUser } from './classes/controllerActivityUser.js';

import {
    RealTimeDB
} from '../services/realtimedatabase.js'

import { controllerLoginGmail } from './classes/controllerLoginGmail.js';

import { Drive_Data_Favorites } from '../model/classes/Favorites/Drive_Data_Favorites.js'

import { TemplateCardsHome } from '../view/classes/TemplateCardsHome.js';
import { TemplateCardCart } from '../view/classes/TemplateCardCart.js';
import { AddProducts } from './classes/Cart/AddProducts.js';
import { ModifyQuantity_Add } from './classes/Cart/ModifyQuantity_Add.js';
import { ModifyQuantity_Subtract } from './classes/Cart/ModifyQuantity_Subtract.js';




const local_Storage = new StorageService()
const handler_View = new Handler_Displays_Ui()
const categories_UI = new Category_ui()
const cart_Ui = new View_cart()
//----------------------------------------------------------------	



class Control_View_Information_At_DOM {

    constructor(products = [], categories, total) {
        this.products = products
        this.single_Product
        this.categories = categories
        this.total = total
    }

    async controller_get_All_Products() {
        //spinner	
        loadSpinner(false)

        try {
            this.products = await get_All_Products()
            if (this.products.status >= 200 && this.products.status < 300) {

            }
            return this.products
        }

        catch (error) {
            console.log(error)
        }
        finally {

            loadSpinner(true)


        }
    }


    homeInit() {
        const init = document.querySelector('#_home')
        init.addEventListener('click', async () => {
            const favorites = new Controller_Favorites()
            const individualProduct = new Control_View_Information_At_DOM()
            const handler_Init_Page = new Control_View_Information_At_DOM()
            const controller_Cart_Instance = new Control_cart()
            const products_Instance = new TemplateCardsHome()
            //-----------------------------------//	
            const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
            products_Instance.create_Card(returnAllProducts)
            products_Instance.insertAllProducts()
            //-----------------------------------//	

            await favorites.returnFavoriteRealTimeAuth() //this method assign realtime db to this.favorites	


            const serviceStorage = new StorageService()

            favorites.instance_View.display_FavoritesHeart(serviceStorage.getItem(keysLocalStorage.FAVORITES))
            favorites.handler_Favorites()
            individualProduct.controllerViewIndividualProduct() //create instance of controlindividualproduct
            controller_Cart_Instance.add_Cart_Listener()



        })
    }

    async control_View_Categories() {
        loadSpinner(false)

        try {

            this.categories = await get_Categories()
            return categories_UI.createDynamicCategoryNav(this.categories)

        } catch (error) {
            console.log(error)
        }
        finally {
            loadSpinner(true)
        }

    }

    listener_Category() {
        const listener_category = document.querySelectorAll('.listener_category')
        listener_category.forEach(i => i.addEventListener('click', (e) => {
            this.send_Category(e.target.dataset.category)
        })
        )
    }

    async send_Category(category = '') {

        loadSpinner(false)
        try {
            const controller_Cart_Instance = new Control_cart()
            const handler_Init_Page = new Control_View_Information_At_DOM()
            const favorites = new Controller_Favorites()
            const result = await get_View_Products_For_Category(category)
            //Add Listeners	
            categories_UI.displayProductsByCategory(result)
            controller_Cart_Instance.add_Cart_Listener()
            favorites.handler_Favorites()
            /* The above code is defining a function called `searchCoincidentElements` that takes an array called	
            `result` as input. The function uses the `reduce` method to iterate over the `result` array and	
            compare each element's `category` property to the `category` property of each element in an array	
            returned by the `get_Favorites` method of a `favoritesStorage` object. If the	
            `category` properties match and the `category` property is not undefined and the `acc` array does	
            not already contain an element with the same `id` property as */

            const searchCoincidentElements = result.reduce((acc, i) => {
                local_Storage.getItem(keysLocalStorage.FAVORITES).forEach(elements => {
                    (i.category === elements.category &&
                        i.category !== undefined && !acc.some(el => el.id === elements.id))
                        ? acc.push(elements)
                        : null;
                });
                return acc;
            }, []);

            favorites.instance_View.display_FavoritesHeart(searchCoincidentElements)
            this.controllerViewIndividualProduct()

        }
        catch (error) {
            console.error(error)
        }
        finally {
            loadSpinner(true)

        }

    }


    controllerViewIndividualProduct() {
        const view_Element = document.querySelectorAll('.individual_product')
        view_Element.forEach((element) => {
            element.addEventListener('click', async (e) => {
                const targetHeart = e.target.parentElement.parentElement.firstElementChild.firstElementChild
                // search element father of element clicked

                /* The above code is written in JavaScript and it appears to be creating a new instance of a class
                named `ControlIndividualProduct` and then using that instance to handle a single product based on
                the dataset ID from the event target. The `handlerSingleProduct` method is being called
                asynchronously using `await`. */
                const instanceIndividualProduct = new ControlIndividualProduct()
                const product = await instanceIndividualProduct.handlerSingleProduct(e.target.dataset.id)
                const products_Instance = new TemplateCards()

                /* ---------------------- */

                /* The code provided is a mix of JavaScript and comments. It seems to be calling a method
                `uI_Individual_Card` on an object `products_Instance` with the `product` parameter, and then calling
                `insertIndividualCard` method on the same object. However, the code is not properly formatted and
                may not be valid JavaScript syntax. */
                products_Instance.heartsDom = targetHeart
                products_Instance.uI_Individual_Card(product)
                products_Instance.insertIndividualCard()

                /* ---------------------- */

            })
        })
    }
}



//------------------------------------------------------------------------------------------------------------------	
class Favorites_To_View {

    constructor() {
        this.favorites = new StorageService()
        this.instance_View = new View_Favorites()
    }

    handlerViewFavorites() {
        this.instance_View.display_FavoritesHeart(this.favorites)
    }
}



//------------------------------------------------------------------------------------------------------------------	
class Control_cart {

    constructor(total = 0, elementDom) {
        this.model = new Drive_Data_Cart()
        this.RealTimeDB = new RealTimeDB()
        this.renderCards = new TemplateCardCart()
        this.auth = new Auth()
        this.subtract = new ModifyQuantity_Subtract()
        this.add = new ModifyQuantity_Add()
        this.storage = new StorageService()
        this.addProductsInCart = new AddProducts()
        this.cart = ''
        this.elementDom = elementDom
        this.single_Product = null
        this.id = null;
        this.shouldClearCart = false;
        this.acu = 0
        this.total = 0
        this.purchase = {}
    }

    clearCart() {
        this.shouldClearCart = true;
    }

    controller_Cart() {
        const total_And_Quantity = this.model.returnCopyLocalStorage().reduce((previous, current) => {
            previous.quantity = current.quantity + previous.quantity;
            previous.total += current.quantity * current.price;
            return previous
        }, { total: 0, quantity: 0 })

        this.total = Number(total_And_Quantity.total.toFixed(2))

        this.quantity_In_Cart(this.model.returnCopyLocalStorage())

        render_Total_And_Pay(total_And_Quantity)
    };

    async send_Id_To_Api(id) {
        loadSpinner(false)

        if (id) {
            try {
                const result = await get_Single_Product(id);
                this.single_Product = result;

                const product = {
                    quantity: 1,
                    ...this.single_Product
                }
                return product
            } catch (error) {
                console.log(error);
            }
            finally {
                loadSpinner(true)
            }
        };
    };

    add_Cart_Listener() {
        const btns_Cart = document.querySelectorAll('.btn_add_to_cart')
        btns_Cart.forEach(item => item.addEventListener('click', async (e) => {
            const id = Number(e.target.id);
            const product = await this.send_Id_To_Api(id);
            return (this.model.setCartLocalStorage(this.addProductsInCart.addProductsInCart(product).cart)
                , this.controller_Cart())
        }))
    }



    /* The above code is defining an event listener for the click event on an element with the ID	
    "ui_Cart". When a click event occurs, the code checks the class name of the clicked element and	
    calls the corresponding function in the "cartHandler" object. The "cartHandler" object contains	
    functions to handle subtracting, adding, and deleting items from a shopping cart. These functions	
    update the quantity of items in the cart and call the "modify_Quantity" function. */

    assign_Events_Products() {

        const sectionCart = document.querySelector('#section_cart')
        const cart = document.querySelector('#ui_Cart');
        const listenerTarget = () => cart.addEventListener('click', (event) => {
            const target = event.target
            const cartHandler = {
                subtract: (target) => {
                    const id = target.getAttribute('data-id');
                    const input = target.nextElementSibling;
                    this.subtract.id = Number(id)
                    this.subtract.subtractProduct()
                    const quantity = this.model.returnCopyLocalStorage().find(i => i.id === Number(id)).quantity
                    input.value = Number(quantity);
                    quantity === 1 ? replace_Minus_Symbol_For_Trash_Basket(target, true) : null
                    this.controller_Cart();
                },
                
                add: (target) => {
                    const id = target.getAttribute('data-id');
                    const input = target.previousElementSibling;
                    this.add.id = Number(id)
                    this.add.addProduct()
                    const quantity = this.model.returnCopyLocalStorage().find(i => i.id === Number(id)).quantity
                    input.value = quantity;
                    quantity === 2 ? replace_Minus_Symbol_For_Trash_Basket(target.previousElementSibling.previousElementSibling, false) : null
                    this.controller_Cart();
                },
                
                trash_count: (target) => {
                    const id = target.getAttribute('data-id');
                    this.subtract.id = Number(id)
                    this.subtract.subtractProduct()
                    this.controller_Cart();
                    cart_Ui.handle_Delete_Element_In_DOM(event.target.parentElement.parentElement.parentElement);
                },

            };
            //recibe el classlist de target	
            for (const className of target.classList) {
                if (className in cartHandler) {
                    //pasa la class a cartHandler()	
                    cartHandler[ className ](target);
                    break;
                }
            }
        }

        );

        sectionCart.addEventListener('click', listenerTarget())
    }

    confirm_Pay() {
    }

    createdPurchase() {

        const purchase = {
            cart: this.cart,
            total: this.total
        }
        this.purchase = purchase
    }

    async sendPurchaseToDB() {
        try {
            const snapshotRealTimeDb = await instanceRealTimeDb.saveDataPurchase(instanceFirebaseAuth.uid, this.purchase)
            const lastPurchase = []
            lastPurchase.push(await instanceRealTimeDb.returnPurchaseRealTimeDb())
            lastPurchase.map((item, index) => {
                console.log(instanceRealTimeDb.purchase)
            })

        } catch (error) {
            console.log(error)
        } finally {
        }

    }

    sendListCartToView() {
        const sectionCart = document.querySelector('#section_cart')
        sectionCart.addEventListener('click', (e) => {
            this.renderCards.model_UiCart_List()
            this.controller_Cart()

        })
    }
    assign_Event_Btn_Pay() {
        const payEvent = document.querySelector('#view_section_cart');
        payEvent.addEventListener('click', async (event) => {
            const target = event.target;
            if (target.classList.contains('btn_confirm_buy')) {
                try {

                    const test = document.querySelector('#view_section_cart');

                } catch (error) {

                    console.error('Error:', error);

                } finally {
                    this.createdPurchase();
                    this.sendPurchaseToDB()
                    const handler_Init_Page = new Control_View_Information_At_DOM()
                    handler_Init_Page.controller_get_All_Products()

                }
            }
        });
    }



    /**	
     * This function calculates the total quantity of items in a shopping cart and returns a cart container	
     * element with the updated quantity.	
     * @param data - The `data` parameter is an array of objects, where each object represents a product in	
     * a shopping cart. Each object has a `quantity` property that represents the quantity of that product	
     * in the cart. The `control_Quantity` function calculates the total quantity of all products in the	
     * cart by sum	
     * @returns the result of calling the `createCartCont` function from the `cart_Ui` module, passing in	
     * the accumulated quantity (`acu`) as an argument.	
     */

    quantity_In_Cart(data) {

        const acu = data === undefined ? 0 : data.reduce((previous, current) => {
            return current.quantity === undefined ? previous : previous + current.quantity

        }, 0)
        cart_Ui.createCartCont(acu)
        return acu
    }






    //------------------------------------------------------------------------------------------------------------------	
    /* This code block is selecting all elements with the class "subtract" and adding a click event	
    listener to each of them. When one of these elements is clicked, it checks if the next element	
    sibling is null. If it is null, it means that the clicked element is associated with the last	
    product in the cart, and the function calls the `update_Quantity_Cart` method from the `model`	
    object, passing in the `id_Delete_Product_In_Cart` and `true` as arguments. It then calls the	
    `handle_Delete_Element_In_DOM` function from the `cart_Ui` module, passing in the	
    `element_Delete_In_DOM` as an argument to remove the corresponding product from the cart UI. If the	
    next element sibling is not null, it retrieves the `id` of the product associated with the clicked	
    element from the `data-id` attribute of the next element sibling. It then decrements the quantity	
    value of the input element that is the next element sibling of the clicked element, and updates the	
    cart with the new quantity value using the `update_Quantity_Cart` method. If the quantity value is	
    1, it replaces the trash basket icon with a minus symbol */
    //------------------------------------------------------------------------------------------------------------------	
    dynamic_Change_Symbols() {

        const btn_Add_Quantity = document.querySelectorAll('.add')
        const btns_Subtract = document.querySelectorAll('.subtract')

        /* ---------------------------------- */

        btns_Subtract.forEach(elements => {

            elements.addEventListener('click', (e) => {
                if (e.target.nextElementSibling === null) {
                    const element_Delete_In_DOM = e.target.parentElement.parentElement.parentElement
                    const id_Delete_Product_In_Cart = Number(e.target.dataset.id)
                    console.log(this.acu)
                    return cart_Ui.handle_Delete_Element_In_DOM(element_Delete_In_DOM)
                }
                this.subtract.id = Number(e.target.nextElementSibling.dataset.id)
                this.acu = Number(e.target.nextElementSibling.value)
                if (this.acu === 1) {
                    console.log(this.acu)
                    this.elementDom = elements
                    replace_Minus_Symbol_For_Trash_Basket(this.elementDom, true)

                }
                console.log(this.acu)
                e.target.nextElementSibling.value = String(this.acu)
            })
        })


        //------------------------------------------------------------------------------------------------------------------	

        /* This code block is adding event listeners to a set of elements with the class `add`. When one of	
        these elements is clicked, it retrieves the `id` of the product associated with the clicked element	
        from the `data-id` attribute of the previous sibling element. It then increments the quantity value	
        of the input element that is the previous sibling of the clicked element, and updates the cart with	
        the new quantity value using the `data_Cart.update_Quantity_Cart` method. If the quantity value is	
        2, it replaces the minus symbol with a trash basket icon using the `replace_Minus_Symbol_For_Trash_Basket`	
        function. Finally, it returns the updated cart data. */

        btn_Add_Quantity.forEach(elements => {

            elements.addEventListener('click', (e) => {

                const id = Number(e.target.previousElementSibling.dataset.id)

                if (this.acu === 2) {
                    this.elementDom = e.target.previousElementSibling.previousElementSibling
                    console.log(this.acu)
                    replace_Minus_Symbol_For_Trash_Basket(this.elementDom, false)
                }
                console.log(this.acu)

                if (this.acu === 10) {
                    console.log(this.acu)
                    e.target.previousElementSibling.disabled = true
                }
                e.target.previousElementSibling.value = String(this.acu)
            })

        })

    }

    //------------------------------------------------------------------------------------------------------------------	

    update_Quantity_Cart(id = "", flag) {
        if (flag === true) {
            console.log('update: ', flag);
            const updateCart_Minus = this.model.modelCart.map
                (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            this.model.modelCart = updateCart_Minus
            return this.cart
        }
        const updateCart_Add = this.model.modelCart.map
            (i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);
        this.model.modelCart = updateCart_Add
        return this.cart
    }

}




class Firebase_Auth {

    constructor(auth) {
        this.uid = ''
        this.favoritesController = new Controller_Favorites()
        this.auth = new controllerLoginGmail()
        this.viewUser = new Display_Data_Firebase_User()
        this.cart = new Control_cart()
    }

    async loginUser() {

        /**	
         * The function `insertLogoUser` checks if the user's photoURL is undefined and if so, assigns a	
         * default photoURL and displays it on the user's profile.	
         * @returns the result of calling the `displayProfilePhoto` method with the `user.photoURL` as an	
         * argument.	
         */

        //------------------------------------------------------------------------------	

        const insertLogoUser = (photoProfile = './icon/user.png') => {
            this.viewUser.displayProfilePhoto(photoProfile)
            if (this.auth.user) {
                return this.viewUser.displayProfilePhoto(photoProfile)
            }
        }


        insertLogoUser()

        //------------------------------------------------------------------------------	
        const buttonLogin = document.querySelector('#google-sign-in-btn')
        buttonLogin.addEventListener('click', async (e) => {
            const storage = new StorageService()

            e.preventDefault()
            try {

                if (this.auth.user != null) {
                    console.log(e.target.dataset.userState)

                    this.auth.handlerStateStorageDisconnected()
                    this.auth.user = null
                    insertLogoUser()
                    const instance_Control_Routes = new Control_Routes()
                    instance_Control_Routes.reception_Hash('#home');
                    return this.auth.user
                }
                const viewFavorites = new View_Favorites()

                await this.auth.handlerStateStorageConnected()
                insertLogoUser(this.auth.user.photoURL)
                const storageCart = storage.getItem(keysLocalStorage.CART)
                const storageFavorite = storage.getItem(keysLocalStorage.FAVORITES)
                viewFavorites.display_FavoritesHeart(storageFavorite)
                this.cart.quantity_In_Cart(storageCart)

                //------------------------------------------------------------------------------	
                //------------------------------------------------------------------------------	
            }

            catch (error) {
                console.log('error', error)
            }
            finally {
                console.log(storage.getItem(keysLocalStorage.FAVORITES))
                this.uid = storage.getSessionStorageUid(keySessionStorage.UID) || '';
                !this.auth.user ? e.target.textContent = 'Login' : e.target.textContent = 'Logout'
                e.target.dataset.userState = !this.auth.user ? 'disconnect' : 'connect'
            }

        })

    }
}


if (typeof localStorage !== 'undefined') {

    const instanceFirebaseAuth = new Firebase_Auth()
    instanceFirebaseAuth.loginUser()
    /* -------------------------------------------------------------- */
    const controller_Cart_Instance = new Control_cart()
    const storage = new StorageService()
    const auth = new Firebase_Auth()
    const handler_Init_Page = new Control_View_Information_At_DOM()
    const favorites = new Controller_Favorites()
    const products_Instance = new TemplateCardsHome()
    const individualProduct = new ControlIndividualProduct()
    /* -------------------------------------------------------------- */
    controller_Cart_Instance.sendListCartToView()
    const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
    products_Instance.create_Card(returnAllProducts)
    products_Instance.insertAllProducts(),
        handler_Init_Page.homeInit(),
        await handler_Init_Page.control_View_Categories(),
        controller_Cart_Instance.add_Cart_Listener(),
        controller_Cart_Instance.assign_Events_Products(),
        handler_Init_Page.controllerViewIndividualProduct()
    handler_Init_Page.listener_Category(),
        controller_Cart_Instance.assign_Event_Btn_Pay(),
        favorites.handler_Favorites(),
        storage.getItem(keysLocalStorage.FAVORITES).length !== 0 ? console.log('lleno') : console.log('vacio'),
        individualProduct.listenerAddCart(),
        individualProduct.listenerFavorite(),
        favorites.sendFavoriteToView()
}
//----------------------------------------------------------------	


class Control_Routes {
    //reception hash to routers	
    reception_Hash = (hash = '') => {
        const name_Hash = {
            "#individual_product": 'individual_product',
            "#home": 'home',
            "#view_section_cart": 'cart',
            "#_categories": 'categories',
            "#favorites_section": 'favorites'

        }
        //send hash to controller	
        return handler_View.handler_Display_(name_Hash[ hash ]);
    }
}

const testControllerUser = new controllerActivityUser()
testControllerUser.closeSession()

//----------------------------------------------------------------	




export {
    Control_Routes,
    Control_View_Information_At_DOM,
    Control_cart,
    loadSpinner,
    Firebase_Auth,
}	

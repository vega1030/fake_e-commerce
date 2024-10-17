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
import { Controller_Favorites } from './classes/Favorites/Controller_Favorites.js'
import { ControlIndividualProduct } from './classes/Individual_Product/ControlIndividualProduct.js'
import {
    Handler_Displays_Ui,
    View_Favorites,
    replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay, Display_Data_Firebase_User,
    TemplateCards
} from "../view/view.js";
import { controllerActivityUser } from './classes/Controller Auth/controllerActivityUser.js';
import { RealTimeDB } from '../services/realtimedatabase.js'
import { ControllerLoginGmail } from './classes/Controller Auth/controllerLoginGmail.js';
import { TemplateCardsHome } from '../view/classes/home/TemplateCardsHome.js';
import { TemplateCardCart } from '../view/classes/cart/TemplateCardCart.js';
import { AddProducts } from './classes/Cart/AddProducts.js';
import { ModifyQuantity_Add } from './classes/Cart/ModifyQuantity_Add.js';
import { ModifyQuantity_Subtract } from './classes/Cart/ModifyQuantity_Subtract.js';
import { EventManager } from '../Event Manager/EventManager.js';
import { DynamicCategories } from '../view/classes/category/DynamicCategories.js';
import { HandlerQuantityAndTotal } from './classes/Cart/HandlerQuantityAndTotal.js';
import { ControllerMainProduct } from './classes/Landing_Page/ControllerMainProduct.js';
import { MainProductView } from '../view/classes/home/MainProductView.js';
import { IndividualProduct } from '../view/classes/individual_product/individualProduct.js';
import { ModalLogin } from '../view/classes/Modal_Login/ModalLogin.js';
import { Auth } from '../services/auth.js';

const local_Storage = new StorageService()
const handler_View = new Handler_Displays_Ui()
//----------------------------------------------------------------	

export class HandlerClickFavorites {
    constructor() {
        this.eventListeners = new EventManager()
        this.instanceFavorites = new Controller_Favorites()
        this.stateUser = new ControllerLoginGmail()
    }

    async addListenerHeartFavorites() {
        this.eventListeners.addListener('click', '.favorite', (e) => {
            this.instanceFavorites.handler_Favorites(e);
        });
    };


    addFavoriteSectionListener() {
        this.eventListeners.addListener('click', '#favorites', () => {
            this.instanceFavorites.sendFavoriteToView()
        })
    }
}

export class HandlerClickPurchase {

    constructor() {
        this.eventListeners = new EventManager()
/*         this.modelPurchases = new ModelPurchases();
 */        this.saveRealtime = new RealTimeDB()
    }
    /* 
        addEventListenerPurchase() {
            this.eventListeners.addListener('click', '#pay_confirm', (e) => {
                console.log(e);
                this.saveRealtime.saveDataPurchase(this.modelPurchases.createdPurchase())
    
            })
        } */

}

export class Control_View_Information_At_DOM {

    constructor(products = [], categories, total) {
        this.products = products
        this.single_Product
        this.categories = categories
        this.total = total
        this.HandlerClickFavorites = new HandlerClickFavorites()
        this.controllerFavorites = new Controller_Favorites()
        this.favoritesView = new View_Favorites()
        this.dynamicCategories = new DynamicCategories()
        this.eventListeners = new EventManager()
        this.mainProductView = new MainProductView()
        this.controllerMainProduct = new ControllerMainProduct()


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
        this.eventListeners.addListener('click', '#_home', async (e) => {
            const individualProduct = new Control_View_Information_At_DOM()
            const handler_Init_Page = new Control_View_Information_At_DOM()
            const controller_Cart_Instance = new Control_cart()
            const products_Instance = new TemplateCardsHome()
            const listenerFavorites = new HandlerClickFavorites()
            listenerFavorites.addListenerHeartFavorites()
            //-----------------------------------//	
            const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
            products_Instance.create_Card(returnAllProducts)
            products_Instance.insertAllProducts()
            //-----------------------------------//	
            const serviceStorage = new StorageService()
            this.favoritesView.display_FavoritesHeart(serviceStorage.getItem(keysLocalStorage.FAVORITES))
            individualProduct.controllerViewIndividualProduct() //create instance of controlindividualproduct
            controller_Cart_Instance.add_Cart_Listener()
        })
    }

    async control_View_Categories() {
        loadSpinner(false)

        try {

            this.categories = await get_Categories()
            return this.dynamicCategories.createDynamicCategoryNav(this.categories)

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
            this.dynamicCategories.displayProductsByCategory(result)
            controller_Cart_Instance.add_Cart_Listener()
            this.HandlerClickFavorites.addListenerHeartFavorites()            /* The above code is defining a function called `searchCoincidentElements` that takes an array called	
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
                const products_Instance = new IndividualProduct()


                /* ---------------------- */

                /* The code provided is a mix of JavaScript and comments. It seems to be calling a method
                `uI_Individual_Card` on an object `products_Instance` with the `product` parameter, and then calling
                `insertIndividualCard` method on the same object. However, the code is not properly formatted and
                may not be valid JavaScript syntax. */
                products_Instance.heartsDom = targetHeart
                products_Instance.uI_Individual_Card(product)
                products_Instance.insertIndividualCard()
                instanceIndividualProduct.listenerAddCart()



                /* ---------------------- */

            })
        })
    }
}

export class Control_cart {

    constructor(elementDom) {
        this.model = new Drive_Data_Cart()
        this.RealTimeDB = new RealTimeDB()
        this.renderCards = new TemplateCardCart()
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
        this.eventListeners = new EventManager();
        this.totalAndQuantity = new HandlerQuantityAndTotal()

    }

    clearCart() {
        this.shouldClearCart = true;
    }



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
        this.eventListeners.addListener('click', '.btn_add_to_cart', async (e) => {
            const id = Number(e.target.id);
            const product = await this.send_Id_To_Api(id);
            const cartResponse = this.addProductsInCart.addProductsInCart(product)
            this.model.setCartLocalStorage(cartResponse.cart);
            this.totalAndQuantity.quantity_In_Cart();
        })
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
                    input.value = String(quantity);
                    quantity === 1 ? replace_Minus_Symbol_For_Trash_Basket(target, true) : null
                    this.totalAndQuantity.quantity_In_Cart();
                    this.totalAndQuantity.controllerCart_Total_Quantity()
                },

                add: (target) => {
                    const id = target.getAttribute('data-id');
                    const input = target.previousElementSibling;
                    this.add.id = Number(id)
                    this.add.addProduct()
                    const quantity = this.model.returnCopyLocalStorage().find(i => i.id === Number(id)).quantity
                    console.log(this.model.returnCopyLocalStorage());
                    input.value = String(quantity);
                    quantity === 2 ? replace_Minus_Symbol_For_Trash_Basket(target.previousElementSibling.previousElementSibling, false) : null
                    quantity === 10 ? console.log('quantity no validate value') : console.log(true);
                    this.totalAndQuantity.quantity_In_Cart();
                    this.totalAndQuantity.controllerCart_Total_Quantity()
                },

                trash_count: (target) => {
                    const id = target.getAttribute('data-id');
                    this.subtract.id = Number(id)
                    this.subtract.subtractProduct()
                    this.renderCards.handle_Delete_Element_In_DOM(event.target.parentElement.parentElement.parentElement);
                    const instance_Control_Routes = new Control_Routes()
                    this.totalAndQuantity.quantity_In_Cart();
                    this.totalAndQuantity.controllerCart_Total_Quantity()
                    this.model.returnCopyLocalStorage().length === 0 ? instance_Control_Routes.reception_Hash('#home') : null;
                },

            };

            for (const className of target.classList) {
                if (className in cartHandler) {
                    cartHandler[ className ](target);
                    break;
                }
            }
        }

        );

        sectionCart.addEventListener('click', listenerTarget())
    }


    sendListCartToView() {

        this.eventListeners.addListener('click', '#section_cart', () => {
            this.renderCards.model_UiCart_List()
            this.totalAndQuantity.controllerCart_Total_Quantity()
            const controlPurchase = new HandlerClickPurchase()
            //assign listener button of finally purchase
            controlPurchase.addEventListenerPurchase()

        })
    }


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
                    return this.renderCards.handle_Delete_Element_In_DOM(element_Delete_In_DOM)
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

}



export class Firebase_Auth {

    constructor() {
        this.uid = ''
        this.favoritesController = new Controller_Favorites()
        this.auth = new ControllerLoginGmail()
        this.viewUser = new Display_Data_Firebase_User()
        this.total_quantity = new HandlerQuantityAndTotal()
        this.addEventCartProduct = new Control_cart()
        this.eventListeners = new EventManager()
        this.profilePhoto = undefined


    }

    async insertPhoto(img) {
        return img ? this.viewUser.displayProfilePhoto(img) : this.viewUser.displayProfilePhoto()
    }
    //------------------------------------------------------------------------------	


    handlerClickLoginButtonGmail() {

        this.eventListeners.addListener('click', '#google-sign-in-btn', async (e) => {
            const storage = new StorageService()
            e.preventDefault()
            try {
                //user disconnected
                if (this.auth.user != null) {
                    console.log('disconected');
                    this.auth.handlerStateStorageDisconnected()
                    this.auth.user = null
                    this.insertPhoto()
                    const instance_Control_Routes = new Control_Routes()
                    instance_Control_Routes.reception_Hash('#home');
                    console.log('disconnected');
                    storage.removeItem('USERPHOTO')
                    return this.auth.user
                }
                //user connected
                const viewFavorites = new View_Favorites()
                await this.auth.handlerStateStorageConnected()
                storage.setItem('USERPHOTO', this.auth.user.photoURL)
                this.insertPhoto(storage.getItem('USERPHOTO'));
                const storageCart = storage.getItem(keysLocalStorage.CART)
                const storageFavorite = storage.getItem(keysLocalStorage.FAVORITES)
                viewFavorites.display_FavoritesHeart(storageFavorite)
                this.total_quantity.quantity_In_Cart(storageCart)
            }
            catch (error) {
                console.log('error', error)
            }
            finally {
                !this.auth.user ? e.target.textContent = 'Login' : e.target.textContent = 'Logout'
                e.target.dataset.userState = !this.auth.user ? 'disconnect' : 'connect'
            }
        })
    }
}
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


if (typeof localStorage !== 'undefined') {
    const instance_Control_Routes = new Control_Routes()
    instance_Control_Routes.reception_Hash('#home');
    /* -------------------------------------------------------------- */
    const instanceFirebaseAuth = new Firebase_Auth()
    /* -------------------------------------------------------------- */
    const controller_Cart_Instance = new Control_cart()
    const storage = new StorageService()
    const favorites = new Controller_Favorites()
    const products_Instance = new TemplateCardsHome()
    const individualProduct = new ControlIndividualProduct()
    const clickFavorites = new HandlerClickFavorites()
    const handler_Init_Page = new Control_View_Information_At_DOM()
    const disconnected = new Auth()
    instanceFirebaseAuth.handlerClickLoginButtonGmail()
    /* -------------------------------------------------------------- */
    /**
     * The function `userData` sets up Firebase authentication, storage, and Gmail login functionality,
     * then retrieves the current user's state and displays their profile photo if available.
     */
    const userData = async () => {
        /* The above code snippet is written in JavaScript and appears to be setting up a Firebase
        authentication instance, a storage service, and a controller for logging in with Gmail. It
        then attempts to get the current user's state using the `stateUser()` method from the
        `ControllerLoginGmail` class. */
        const userView = new Display_Data_Firebase_User()
        const storage = new StorageService()
        const control_LoginGmail = new ControllerLoginGmail()
/*         const user = await control_LoginGmail.stateUser()
 */        storage.getItem('USERPHOTO') !== undefined ? userView.displayProfilePhoto() : userView.displayProfilePhoto(storage.getItem('USERPHOTO'))

    }
    userData()
    /* -------------------------------------------------------------- */
    const userView = new Display_Data_Firebase_User()
    controller_Cart_Instance.sendListCartToView()
    const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
    products_Instance.create_Card(returnAllProducts),
        products_Instance.insertAllProducts(),
        handler_Init_Page.homeInit(),
        await handler_Init_Page.control_View_Categories(),
        controller_Cart_Instance.add_Cart_Listener(),
        controller_Cart_Instance.assign_Events_Products(),
        handler_Init_Page.controllerViewIndividualProduct(),
        handler_Init_Page.listener_Category(),
        storage.getItem(keysLocalStorage.FAVORITES).length !== 0 ? console.log('lleno') : console.log('vacio'),
        individualProduct.listenerFavorite(),
        favorites.sendFavoriteToView(),
        clickFavorites.addListenerHeartFavorites(),
        clickFavorites.addFavoriteSectionListener()

}

//----------------------------------------------------------------	
const testControllerUser = new controllerActivityUser()
testControllerUser.closeSession()
//----------------------------------------------------------------	

export {
    Control_Routes,
    loadSpinner,
}	

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
    Category_ui, products_Instance, Handler_Displays_Ui,
    View_Favorites, View_cart, replace_Minus_Symbol_For_Trash_Basket,
    render_Total_And_Pay, Display_Data_Firebase_User,
    TemplateCards
} from "../view/view.js";

import {
    RealTimeDB
} from '../services/realtimedatabase.js'

import {Drive_Data_Favorites} from '../model/classes/Favorites/Drive_Data_Favorites.js'

const local_Storage = new StorageService()
const handler_View = new Handler_Displays_Ui()
const categories_UI = new Category_ui()
const cart_Ui = new View_cart()
const authInstance = new Auth()
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
            /* const res = products_Instance.create_Card(this.products) */
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
            const handler_Init_Page = new Control_View_Information_At_DOM()
            const controller_Cart_Instance = new Control_cart()
            //-----------------------------------//	
            const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
            products_Instance.create_Card(returnAllProducts)
            products_Instance.insertAllProducts()
            //-----------------------------------//	

            await favorites.returnFavoriteRealTimeAuth() //this method assign realtime db to this.favorites	


            const serviceStorage = new StorageService()

            favorites.instance_View.display_FavoritesHeart(serviceStorage.getItem(keysLocalStorage.FAVORITES))
            favorites.handler_Favorites()
            this.handlerSingleProduct() //create instance of controlindividualproduct
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
            handler_Init_Page.handlerSingleProduct()

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
                e.target.dataset.id
                /* The above code is written in JavaScript and it appears to be creating a new instance of a class
                named `ControlIndividualProduct` and then using that instance to handle a single product based on
                the dataset ID from the event target. The `handlerSingleProduct` method is being called
                asynchronously using `await`. */
                const instanceIndividualProduct = new ControlIndividualProduct()
                const product = await instanceIndividualProduct.handlerSingleProduct(e.target.dataset.id)
                /* ---------------------- */

                /* The code provided is a mix of JavaScript and comments. It seems to be calling a method
                `uI_Individual_Card` on an object `products_Instance` with the `product` parameter, and then calling
                `insertIndividualCard` method on the same object. However, the code is not properly formatted and
                may not be valid JavaScript syntax. */
                products_Instance.uI_Individual_Card(product)
                products_Instance.insertIndividualCard()
                
                /* ---------------------- */

            })
        })
    }
}



//------------------------------------------------------------------------------------------------------------------	
class Favorites_To_View{
    
    constructor(){
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
        this.cart = ''
        this.model = new Drive_Data_Cart()
        this.RealTimeDB = new RealTimeDB()
        this.auth = new Auth()
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
        /*         if (typeof localStorage !== 'undefined') {
        } */
        // create total and quantity
        const total_And_Quantity = this.model.modelCart.reduce((previous, current) => {
            previous.quantity = current.quantity + previous.quantity;
            previous.total += current.quantity * current.price;
            return previous
        }, { total: 0, quantity: 0 })
        //---------	
        this.total = Number(total_And_Quantity.total.toFixed(2))

        cart_Ui.model_UiCart_List(this.model.modelCart)
        this.quantity_In_Cart(this.model.modelCart)
        render_Total_And_Pay(total_And_Quantity)

        const storage = new StorageService()
        storage.setItem(keysLocalStorage.CART, this.model.modelCart)



        return this.cart


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
                this.addProductsInCart(product)

            } catch (error) {
                console.log(error);
            }
            finally {
                loadSpinner(true)
            }
        };
    };

    /**
     * The function `addProductsInCart` adds products to a shopping cart, updates quantities if the product
     * already exists, and clears the cart if necessary.
     * @param paramProduct - The `paramProduct` parameter is an object that represents a product. It should
     * have the following properties:
     * @returns an object with two properties: "result" and "cart". The "result" property indicates whether
     * a product was added or updated in the cart or if all quantities are zero. The "cart" property
     * contains the updated cart after adding or updating the product.
     */
    addProductsInCart(paramProduct) {
        const storage = new StorageService()
        if (this.shouldClearCart) {
            this.model.modelCart = []
            this.shouldClearCart = false
        }
        this.model.modelCart = storage.getItem(keysLocalStorage.CART) || []
        const updatedCart = [ ...this.model.modelCart, paramProduct ];
        const updatedCartReduced = updatedCart.reduce((acc, e) => {
            const existingIndex = acc.findIndex((x) => e.id === x.id);

            if (existingIndex !== -1) {
                acc[ existingIndex ].quantity += e.quantity;
            } else {
                acc.push(e);
            }
            return acc;
        }, []);

        const isProductAddedOrUpdated = updatedCartReduced.some((product) => {

            const existingProduct = this.model.modelCart.find((p) => p.id === product.id);

            if (!existingProduct) {
                return true;
            }
            if (existingProduct.quantity !== product.quantity) {
                return true;
            }

            return false;
        });

        const allQuantitiesAreZero = updatedCartReduced.every((product) => product.quantity === 0);

        if (isProductAddedOrUpdated || allQuantitiesAreZero) {
            this.model.modelCart = updatedCartReduced;
        };

        this.model.modelCart = updatedCartReduced;

        if (typeof localStorage !== 'undefined') {
            this.controller_Cart();
        };
        console.log(this.model.modelCart)
        return { result: isProductAddedOrUpdated || allQuantitiesAreZero, cart: this.model.modelCart };
    }

    add_Cart_Listener() {
        const btns_Cart = document.querySelectorAll('.btn_add_to_cart')
        btns_Cart.forEach(item => item.addEventListener('click', (e) => {
            const id = Number(e.target.id);
            this.send_Id_To_Api(id);
            return
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
                    this.modify_Quantity();
                    console.log('subtract: ', target);
                    const id = target.getAttribute('data-id');
                    const input = target.nextElementSibling;
                    const count = parseInt(input.value, 10);
                    const newCount = Math.max(count - 1, 0);
                    input.value = newCount;
                },

                add: (target) => {
                    this.modify_Quantity();
                    const id = target.getAttribute('data-id');
                    const input = target.previousElementSibling;
                    const count = parseInt(input.value, 10);
                    const newCount = Math.min(count + 1, 10);
                    input.value = newCount;
                },

                trash_count: (target) => {
                    this.modify_Quantity();
                    const id = target.getAttribute('data-id');
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
        if (data === 0) {
            return cart_Ui.createCartCont(0)
        }
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
    modify_Quantity() {
        const btn_Add_Quantity = document.querySelectorAll('.add')
        const btns_Subtract = document.querySelectorAll('.subtract')
        btns_Subtract.forEach(elements => {
            elements.addEventListener('click', (e) => {
                if (e.target.nextElementSibling === null) {
                    const element_Delete_In_DOM = e.target.parentElement.parentElement.parentElement
                    const id_Delete_Product_In_Cart = Number(e.target.dataset.id)
                    //Update quantity	

                    this.update_Quantity_Cart(id_Delete_Product_In_Cart, true)
                    this.controller_Cart(this.model.responseCart)
                    const controller = this.controller_Cart(this.model.responseCart)
                    return cart_Ui.handle_Delete_Element_In_DOM(element_Delete_In_DOM)

                }

                const id = Number(e.target.nextElementSibling.dataset.id)
                this.acu = Number(e.target.nextElementSibling.value) - 1
                console.log(this.acu);
                if (this.acu === 1) {
                    this.elementDom = elements
                    replace_Minus_Symbol_For_Trash_Basket(this.elementDom, true)
                }

                e.target.nextElementSibling.value = String(this.acu)

                return (this.update_Quantity_Cart(id, true),
                    this.controller_Cart(this.model.responseCart)
                )
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
                this.acu = Number(e.target.previousElementSibling.value) + 1
                if (this.acu === 2) {
                    this.elementDom = e.target.previousElementSibling.previousElementSibling
                    replace_Minus_Symbol_For_Trash_Basket(this.elementDom, false)
                }
                this.update_Quantity_Cart(id, false),
                    this.controller_Cart(this.model.responseCart),
                    e.target.previousElementSibling.value = String(this.acu)
                return

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
            this.model.modelCart.setAndCopyLocalStorage(this.model.modelCart)
            return this.cart
        }
        const updateCart_Add = this.model.modelCart.map
            (i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);
        this.model.modelCart = updateCart_Add
        this.model.modelCart.setAndCopyLocalStorage(this.modelCartl)
        return this.cart
    }

}




class Firebase_Auth {

    constructor(auth) {
        this.user = {}
        this.uid = ''
        this.auth = auth
        this.viewUser = new Display_Data_Firebase_User()
    }

    async loginUser() {

        const buttonLogin = document.querySelector('#google-sign-in-btn')


        /**	
         * The function `insertLogoUser` checks if the user's photoURL is undefined and if so, assigns a	
         * default photoURL and displays it on the user's profile.	
         * @returns the result of calling the `displayProfilePhoto` method with the `user.photoURL` as an	
         * argument.	
         */
        const insertLogoUser = () => {
            if (this.user.photoURL === undefined) {
                this.user.photoURL = './icon/user.png'
                console.log(this.user.photoURL)
                return this.viewUser.displayProfilePhoto(this.user.photoURL)
            }
        }

        insertLogoUser()
        //------------------------------------------------------------------------------	

        this.viewUser.displayProfilePhoto(this.user.photoURL)

        buttonLogin.addEventListener('click', async (e) => {
            buttonLogin.disabled = true
            try {

                /* ----Login---- */

                const favorites = new Controller_Favorites()
                const cart = new Control_cart()
                const driveCart = new Drive_Data_Cart()
                const modelHandlerFavorite = new Drive_Data_Favorites()

                //------------------------------------------------------------------------------	
                const response = await authInstance.loginWithGmail()
                this.user = response
                this.viewUser.displayProfilePhoto(this.user.photoURL)

                //------------------------------------------------------------------------------	
                const handlerStateStorageConnected = async () => {
                    const realTime = new RealTimeDB()
                    const storage = new StorageService()
                    console.log('connected')
                    const dataSetState = 'connect'
                    e.target.dataset.userState = dataSetState
                    storage.setItem(keysLocalStorage.UID, this.user.uid)

                    /* ------------------------------ */
                    const resFavorites = await realTime.returnFavoritesRealTimeDb()
                    const res_Purchase = await realTime.returnPurchaseRealTimeDb(this.user.uid)
                    const resCart = await realTime.returnCartRealTimeDb()
                    /* ------------------------------ */

                    const mergedCarts = driveCart.mergeCart(resCart, storage.getItem(keysLocalStorage.CART))
                    const mergedFavorites = modelHandlerFavorite.mergeFavorites(resFavorites, storage.getItem(keysLocalStorage.FAVORITES))

                    cart.quantity_In_Cart(mergedCarts)

                    storage.setItem(keysLocalStorage.FAVORITES, mergedFavorites)
                    storage.setItem(keysLocalStorage.CART, mergedCarts)
                }

                const handlerStateStorageDisconnected = async () => {

                    /* The above code is creating instances of various classes and services in
                    JavaScript. */
                    const realTime = new RealTimeDB()
                    const storage = new StorageService();
                    const handler_Init_Page = new Control_View_Information_At_DOM();
                    const cart = new Control_cart();
                    const modelCart = new Drive_Data_Cart()
                    const favorites = new Controller_Favorites();
                    /*  ------------------------------------- */

                    console.log('disconnected')

                    instance_Control_Routes.reception_Hash('#home');
                    e.target.textContent = 'Logout';

                    realTime.saveCart(storage.getItem(keysLocalStorage.CART))
                    realTime.saveFavoritesRealTimeDb(storage.getItem(keysLocalStorage.FAVORITES))

                    const returnAllProducts = await handler_Init_Page.controller_get_All_Products();
                    products_Instance.create_Card(returnAllProducts);
                    products_Instance.insertAllProducts();

                    storage.removeItem(keysLocalStorage.FAVORITES);
                    storage.removeItem(keysLocalStorage.CART);
                    favorites.handler_Favorites();

                    handler_Init_Page.handlerSingleProduct();
                    cart.add_Cart_Listener();

                    cart.quantity_In_Cart(storage.getItem(keysLocalStorage.CART))
                    modelCart.modelCart = storage.getItem(keysLocalStorage.CART)
                    console.log(modelCart.modelCart)
                    //-----------------------------------//	

                }
                //------------------------------------------------------------------------------	
                return !this.user ? handlerStateStorageDisconnected() : handlerStateStorageConnected()

            } catch (error) {
                console.log('error', error)
            }
            finally {
                const storage = new StorageService();
                const realTime = new RealTimeDB();
                this.uid = storage.getSessionStorageUid(keySessionStorage.UID) || '';
                !this.user ? e.target.textContent = 'Login' : e.target.textContent = 'Logout'
                buttonLogin.disabled = false
                return this.user
            }
        })

        insertLogoUser()

    }
}

const instanceFirebaseAuth = new Firebase_Auth()
instanceFirebaseAuth.loginUser()


//--------------------------------------------------------------	
if (typeof localStorage !== 'undefined') {
    const controller_Cart_Instance = new Control_cart()
    const storage = new StorageService()
    const individualProduct = new ControlIndividualProduct()
    individualProduct.handlerSingleProduct()


    /*     controller_Cart_Instance.quantity_In_Cart(controller_Cart_Instance.model.returnCopyLocalStorage())
     */
    const handler_Init_Page = new Control_View_Information_At_DOM()
    const favorites = new Controller_Favorites()
    const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
    products_Instance.create_Card(returnAllProducts)
    products_Instance.insertAllProducts(),
        handler_Init_Page.homeInit()
    await handler_Init_Page.control_View_Categories()
    controller_Cart_Instance.add_Cart_Listener(),
        controller_Cart_Instance.assign_Events_Products(),
        handler_Init_Page.controllerViewIndividualProduct()
    handler_Init_Page.listener_Category(),
        controller_Cart_Instance.assign_Event_Btn_Pay(),
        /* controller_Cart_Instance.quantity_In_Cart(storage.getItem(keysLocalStorage.CART)) */
    favorites.handler_Favorites(),
/*         favorites.instance_View.display_FavoritesHeart(storage.getItem(keysLocalStorage.FAVORITES)),
 */
        individualProduct.listenerAddCart()
    individualProduct.listenerFavorite()
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



const instance_Control_Routes = new Control_Routes()

//----------------------------------------------------------------	




export {
    instance_Control_Routes,
    Control_View_Information_At_DOM,
    Control_cart,
    loadSpinner,
    Firebase_Auth,
}	

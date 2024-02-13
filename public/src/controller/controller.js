'use strict'

import {
    get_All_Products,
    get_Categories,
    get_View_Products_For_Category,
    get_Single_Product
} from '../api.js'

import { keySessionStorage, keysLocalStorage } from '../constants.js'

import { Drive_Data_Cart } from '../../src/model/classes/Drive_Data_Cart.js'
import { StorageService } from '../model/classes/StorageService.js'
import { Handler_Favorites } from '../model/classes/Handler_Favorites.js'


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

const local_Storage = new StorageService()
const handler_View = new Handler_Displays_Ui()
const categories_UI = new Category_ui()
const cart_Ui = new View_cart()
const authInstance = new Auth()
//----------------------------------------------------------------	
const loadSpinner = (flag) => {
    const overlay = document.querySelector('.overlay')
    if (overlay !== null) {
        const confirm = !flag ? overlay.style.display = 'flex' : overlay.style.display = 'none'
        const result = confirm === 'flex' ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
    }
}


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
            const favorites = new Control_Favorites()
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
            this.handlerSingleProduct()
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
            const handler_Init_Page = new Control_View_Information_At_DOM()
            const favorites = new Control_Favorites()
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


    handlerSingleProduct = () => {
        const view_Element = document.querySelectorAll('.individual_product')
        view_Element.forEach((element) => {

            element.addEventListener('click', async (e) => {
                loadSpinner(false)

                try {
                    const data_Id = Number(e.target.dataset.id)
                    const res = await get_Single_Product(data_Id)
                    products_Instance.uI_Individual_Card(res)
                    products_Instance.insertIndividualCard()

                } catch (error) {

                }
                finally {
                    loadSpinner(true)

                }

            })
        })


    }
}

class ControlIndividualProduct {

    constructor() {
        this.id = ''
        this.delegationContent = document.querySelector('#individual_product')

    }

    listenerAddCart() {
        this.delegationContent.addEventListener('click', async (e) => {
            const targetElement = e.target.classList.contains('individual_btn_add_to_cart')
            this.id = e.target.dataset.id
            const result = targetElement === true ? await controller_Cart_Instance.send_Id_To_Api(this.id) : undefined
            return result
        })
    }

    listenerFavorite() {
        const favorites = new Control_Favorites()
        this.delegationContent.addEventListener('click', async (e) => {
            const targetElement = e.target.classList.contains('pathHeart')
            const targetId = e.target.classList.value === 'pathHeart' ? e.target.dataset.id : e.target.dataset.id
            this.id = targetId

            if (this.id === undefined) {
                return this.id
            }

            if (targetElement === true) {
                favorites.id = this.id
                const res = await favorites.callingApi()
                const resList = favorites.save_And_Update_Favorites(res)
                favorites.handler_Favorites()
                return resList
            }
        })
    }
}


const controllerIndividualProduct = new ControlIndividualProduct



//------------------------------------------------------------------------------------------------------------------	

class Control_Favorites {

    constructor() {
        this.favorites = []
        this.objectFav
        this.instance_View = new View_Favorites()
        this.id = ''
        this.realTimeDb = new RealTimeDB()
        this.authFirebase = new Auth()
    }

    /* The above code is adding a click event listener to all elements with the class "favorite". When an	
    element with this class is clicked, it checks if the clicked element has a class "pathHeart". If it	
    does, it gets the ID of the parent element's parent element (two levels up) and assigns it to the	
    "id" variable. If it doesn't have the "pathHeart" class, it gets the ID of the clicked element and	
    assigns it to the "id" variable. Then, it calls a function "send_Favorite_Product_To_LocalStorage()"	
    with the "id" */
    assignUid(uid) {
        this.uid = uid
    }

    getUid() {
        return this.uid
    }


    assignDbFavorites(favorites) {
        this.favorites = favorites
    }
    getDbFavorites() {
        return this.favorites
    }

    handler_Favorites() {
        const favoriteId = document.querySelectorAll('.favorite');
        favoriteId.forEach(element => {
            element.addEventListener('click', (e) => {
                const class_List = e.target.classList.value;
                this.id = class_List === 'pathHeart' ? Number(e.target.parentElement.parentElement.dataset.id) : Number(e.target.dataset.id);
                this.callingApi()
                this.handlerResponseApi()
                this.getDbFavorites()
                loadSpinner()
            });
        });
    }

    /* The above code defines an asynchronous function called `send_Favorite_Product_To_LocalStorage`. When	
    this function is called, it first selects an HTML element with the class "overlay" and sets its	
    display property to "flex". Then, it tries to retrieve a single product using the	
    `get_Single_Product` function with an ID that is passed to the function. If successful, it saves and	
    updates the retrieved product in the favorites list using the	
    `model_Favorites.save_And_Update_Favorites` function and returns the updated favorites list. If	
    there is an error, it logs the error to the console. */

    async callingApi() {
        loadSpinner(false)


        try {
            const res = await get_Single_Product(this.id)
            return res
        }
        catch (error) {
            return error;
        }
        finally {
            loadSpinner(true)
        }

    }

    /* 
        saveFavoriteOfLocalStorage(favorites) {	
    
            this.favorites = favorites	
            return this.favorites	
        }	
    */


    async handlerResponseApi() {
        const res = await this.callingApi()
        if (res === undefined) {
            return
        }
        this.save_And_Update_Favorites(res)

    }



    //------------------------------------------------------------------------------	
    //------------------------------------------------------------------------------	

    async save_And_Update_Favorites(favoriteProduct) {
        await this.returnFavoriteRealTimeAuth(instanceFirebaseAuth.uid)
        const storageService = new StorageService()
        const id = favoriteProduct.id && favoriteProduct ? favoriteProduct.id : null;
        const index = this.favorites.findIndex(i => i.id === favoriteProduct.id);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            await this.setDataRealTimeDb()
            storageService.setItem(keysLocalStorage.FAVORITES, this.favorites)
            this.instance_View.display_FavoritesHeart(this.favorites)
            return this.favorites
        }
        else {
            this.favorites.push(favoriteProduct);
            await this.setDataRealTimeDb()
            storageService.setItem(keysLocalStorage.FAVORITES, this.favorites)
            this.instance_View.display_FavoritesHeart(this.favorites)

            return this.favorites
        }
    }

    async setDataRealTimeDb() {
        instanceFirebaseAuth.uid !== undefined ? this.realTimeDb.saveFavoritesRealTimeDb(instanceFirebaseAuth.uid, this.favorites) : console.log('Error')
        console.log(instanceFirebaseAuth.uid, ' ---- ', this.favorites)
        return
    }

    saveLocalStorage() {

    }

    async returnFavoriteRealTimeAuth(uid) {
        const dbFavorites = await this.realTimeDb.returnFavoritesRealTimeDb(uid)
        this.favorites = dbFavorites
        return this.favorites
    }


    sendFavoriteToView() {
        document.querySelector('#favorites').addEventListener('click', async () => {
            this.returnFavoriteRealTimeAuth()
            console.log(this.favorites)
            //-----------validation of the create this.favorites-------------------//	
            this.favorites.length > 0 ?
                this.objectFav = {
                    list: this.favorites,
                    validation: true
                } :
                this.objectFav = {
                    list: null,
                    validation: false
                }

            //------------------------------//	

            if (this.objectFav.validation === true) {
                const handler_Init_Page = new Control_View_Information_At_DOM()
                this.instance_View.createFavoriteListUI(this.objectFav.list)
                this.instance_View.display_FavoritesHeart(this.objectFav.list)
                this.handler_Favorites()
                this.instance_View.deleteCardFavorite()
                controller_Cart_Instance.add_Cart_Listener()
                handler_Init_Page.handlerSingleProduct()
                return this.objectFav
            }

            //------------------------------//	

            this.objectFav = {
                list: null,
                validation: false
            }
            return this.objectFav
        })
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
        if (this.shouldClearCart) {
            this.model.modelCart = []
            this.shouldClearCart = false
        }
        this.model.modelCart = JSON.parse(localStorage.getItem(keysLocalStorage.CART))||[]
        console.log('localStorage ', this.model.modelCart)
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

                const favorites = new Control_Favorites()
                const cart = new Control_cart()
                const driveCart = new Drive_Data_Cart()
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
                    console.log(storage.getItem(keysLocalStorage.UID))

                    const resFavorites = await realTime.returnFavoritesRealTimeDb(this.user.uid)
                    const res_Purchase = await realTime.returnPurchaseRealTimeDb(this.user.uid)
                    const resCart = await realTime.returnCartRealTimeDb()
                    const mergedCarts = driveCart.mergeCart(resCart, storage.getItem(keysLocalStorage.CART))
                    console.log(resCart, 'favorites ', resFavorites)


                    cart.quantity_In_Cart(mergedCarts)
                    favorites.instance_View.display_FavoritesHeart(resFavorites)
                    storage.setItem(keysLocalStorage.FAVORITES, resFavorites)
                    storage.setItem(keysLocalStorage.CART, mergedCarts)
                }

                const handlerStateStorageDisconnected = async () => {
                    const realTime = new RealTimeDB()
                    const storage = new StorageService();
                    const handler_Init_Page = new Control_View_Information_At_DOM();
                    const cart = new Control_cart();
                    const modelCart = new Drive_Data_Cart()
                    const favorites = new Control_Favorites();
                    console.log('disconnected')
                    instance_Control_Routes.reception_Hash('#home');
                    e.target.textContent = 'Logout';
                    realTime.saveCart(storage.getItem(keysLocalStorage.CART))
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

    /*     controller_Cart_Instance.quantity_In_Cart(controller_Cart_Instance.model.returnCopyLocalStorage())
     */
    const handler_Init_Page = new Control_View_Information_At_DOM()
    const favorites = new Control_Favorites()
    const returnAllProducts = await handler_Init_Page.controller_get_All_Products()
    products_Instance.create_Card(returnAllProducts)
    products_Instance.insertAllProducts(),
        handler_Init_Page.homeInit()
    await handler_Init_Page.control_View_Categories()
    controller_Cart_Instance.add_Cart_Listener(),
        controller_Cart_Instance.assign_Events_Products(),
        handler_Init_Page.handlerSingleProduct(),
        handler_Init_Page.listener_Category(),
        controller_Cart_Instance.assign_Event_Btn_Pay(),
        controller_Cart_Instance.quantity_In_Cart(storage.getItem(keysLocalStorage.CART))
    favorites.handler_Favorites(),
        /*         favorites.instance_View.display_FavoritesHeart(local_Storage.getItem(keysLocalStorage.FAVORITES)),	
         */
        controllerIndividualProduct.listenerAddCart()
    controllerIndividualProduct.listenerFavorite()
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
    Control_Favorites,
    Control_cart,
    loadSpinner,
    Firebase_Auth,
}	

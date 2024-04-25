'use strict'

import { Auth } from "../../../services/auth.js"
import { keySessionStorage, keysLocalStorage } from '../../../constants.js'
import { StorageService } from '../../../model/classes/storage/StorageService.js'
import { RealTimeDB } from '../../../services/realtimedatabase.js'
import { Controller_Favorites } from '../Favorites/Controller_Favorites.js'
import { Control_cart } from '../../controller.js'
import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js"
import { Drive_Data_Favorites } from "../../../model/classes/Favorites/Drive_Data_Favorites.js"
import { Control_View_Information_At_DOM } from '../../controller.js'
import { TemplateCardsHome } from "../../../view/classes/home/TemplateCardsHome.js"
import { Control_Routes } from '../../controller.js'
import { AddProducts } from "../Cart/AddProducts.js"


export class controllerLoginGmail {
    constructor() {
        this.auth = new Auth()
        this.user = undefined
        this.controllerCart = new AddProducts()
        this.driveCart = new Drive_Data_Cart()
    }

    async handlerStateStorageConnected() {
        /* --------__Login__--------- */
        const favorites = new Controller_Favorites()
        const modelHandlerFavorite = new Drive_Data_Favorites()

        const realTime = new RealTimeDB()
        const storage = new StorageService()
        //------------------------------------------------------------------------------	
        const response = await this.auth.loginWithGmail()
        this.user = response
        storage.setItem(keySessionStorage.UID, this.user.uid)
        /* ------------------------------ */
        const resFavorites = await realTime.returnFavoritesRealTimeDb()
        const res_Purchase = await realTime.returnPurchaseRealTimeDb()
        const resCart = await realTime.returnCartRealTimeDb()
        /* ------------------------------ */

        const mergedCarts = this.driveCart.mergeCart(resCart, this.driveCart.returnCopyLocalStorage())
        console.log(mergedCarts);

        const mergedFavorites = modelHandlerFavorite.mergeFavorites(resFavorites, storage.getItem(keysLocalStorage.FAVORITES))

        this.controllerCart.quantity_In_Cart(mergedCarts)
        storage.setItem(keysLocalStorage.FAVORITES, mergedFavorites)
        storage.setItem(keysLocalStorage.CART, mergedCarts)
    }

    async handlerStateStorageDisconnected() {
        /* The above code is creating instances of various classes and services in
        JavaScript. */
        const realTime = new RealTimeDB()
        const storage = new StorageService();
        const handler_Init_Page = new Control_View_Information_At_DOM();
        const modelCart = new Drive_Data_Cart()
        const favorites = new Controller_Favorites();
        const products_Instance = new TemplateCardsHome()
        const instance_Control_Routes = new Control_Routes()
        const controllerCart = new Control_cart()
        /*  ------------------------------------- */

        const response = await this.auth.logoutWithGmail()

        instance_Control_Routes.reception_Hash('#home');
        realTime.saveCart(storage.getItem(keysLocalStorage.CART))
        realTime.saveFavoritesRealTimeDb(storage.getItem(keysLocalStorage.FAVORITES))
        const returnAllProducts = await handler_Init_Page.controller_get_All_Products();
        products_Instance.create_Card(returnAllProducts);
        products_Instance.insertAllProducts();

        storage.removeItem(keysLocalStorage.FAVORITES);
        storage.removeItem(keysLocalStorage.CART);
        favorites.handler_Favorites();
        controllerCart.add_Cart_Listener()
        this.controllerCart.quantity_In_Cart(storage.getItem(keysLocalStorage.CART))
        modelCart.modelCart = storage.getItem(keysLocalStorage.CART)
        console.log('disconnected')
        //-----------------------------------//	

    }
}



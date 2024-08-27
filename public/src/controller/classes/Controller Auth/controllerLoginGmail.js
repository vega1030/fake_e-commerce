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
import { HandlerQuantityAndTotal } from "../Cart/HandlerQuantityAndTotal.js"
import { HandlerClickFavorites } from "../../controller.js"

export class ControllerLoginGmail {
    constructor() {
        this.auth = new Auth()
        this.user = undefined
        this.controllerCart = new AddProducts()
        this.quantityInCart_And_Total = new HandlerQuantityAndTotal()
        this.driveCart = new Drive_Data_Cart()
    }

    async stateUser() {
        const userState = await this.auth.checkUserConnection()
        this.user = userState.user
        return this.user
    }

    async handlerStateStorageConnected() {
        /* --------__Login__--------- */
        const favorites = new Controller_Favorites()
        const modelHandlerFavorite = new Drive_Data_Favorites()

        const realTime = new RealTimeDB()
        const storage = new StorageService()
        //------------------------------------------------------------------------------	
        const response = await this.auth.loginWithGmail()
        this.user = response;
        console.log('user: ', this.user);
        storage.setItem(keySessionStorage.UID, this.user.uid);
        /* ------------------------------ */
        const resFavorites = await realTime.returnFavoritesRealTimeDb()
        const res_Purchase = await realTime.returnPurchaseRealTimeDb()
        const resCart = await realTime.returnCartRealTimeDb()
        /* ------------------------------ */
        const mergedCarts = this.driveCart.mergeCart(resCart, this.driveCart.returnCopyLocalStorage())
        const mergedFavorites = modelHandlerFavorite.mergeFavorites(resFavorites, storage.getItem(keysLocalStorage.FAVORITES))
        storage.setItem(keysLocalStorage.FAVORITES, mergedFavorites)
        storage.setItem(keysLocalStorage.CART, mergedCarts)
        this.quantityInCart_And_Total.quantity_In_Cart()
    }

    async handlerStateStorageDisconnected() {
        /* The above code is creating instances of various classes and services in
        JavaScript. */
        const realTime = new RealTimeDB()
        const storage = new StorageService();
        const handler_Init_Page = new Control_View_Information_At_DOM();
        const modelCart = new Drive_Data_Cart()
        const favorites = new HandlerClickFavorites();
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
        controllerCart.add_Cart_Listener()
        this.quantityInCart_And_Total.quantity_In_Cart(storage.getItem(keysLocalStorage.CART))
        modelCart.modelCart = storage.getItem(keysLocalStorage.CART)
        this.user = response;
        favorites.addListenerHeartFavorites();
        //-----------------------------------//	

    }
}



'use strict'

import { View_Favorites } from "../../../view/view.js"
import { RealTimeDB } from "../../../services/realtimedatabase.js"
import { Auth } from "../../../services/auth.js"
import { Control_cart, loadSpinner } from "../../controller.js"
import { Drive_Data_Favorites } from "../../../model/classes/Favorites/Drive_Data_Favorites.js"
import { get_Single_Product } from '../../../api.js'
import { TemplateCardsFavorites } from "../../../view/classes/favorites/TemplateCardsFavorites.js"
import { ChangeColorHeart } from "../../../view/classes/favorites/ChangeColorHeart.js"
import { ControllerLoginGmail } from "../Controller Auth/controllerLoginGmail.js"


/* The `Controller_Favorites` class in JavaScript handles user interactions related to favorites,
including calling APIs, updating favorites, and managing view display. */
export class Controller_Favorites {

    constructor() {
        this.objectFav
        this.instance_View = new TemplateCardsFavorites()
        this.id = ''
        this.userState = new ControllerLoginGmail()
        this.realTimeDb = new RealTimeDB()
        this.authFirebase = new Auth()
        this.favorites = new Drive_Data_Favorites()
        this.changeStateHeart = new ChangeColorHeart()

    }

    /**
     * The handler_Favorites function determines the ID of the target element based on its class and then
     * calls another function.
     * @param e - The parameter `e` in the `handler_Favorites` function is typically an event object that
     * represents the event that triggered the function. It contains information about the event, such as
     * the target element that triggered the event, any data associated with the event, and other
     * properties related to the event. In
     */
    handler_Favorites(e) {
        const class_List = e !== undefined ? e.target.classList.value : undefined
        this.id = class_List === 'pathHeart' ?
            Number(e.target.parentElement.parentElement.dataset.id) :
            Number(e.target.dataset.id);
        this.handlerResponseApi()
    }

    /**
     * The `handlerResponseApi` function asynchronously handles API responses, updates favorites, and
     * displays them in the view while managing a loading spinner.
     * @returns loadSpinner(true)
     */
    async handlerResponseApi() {
        const res = await this.callingApi()
        loadSpinner(false)
        if (res === undefined) {
            return loadSpinner(true)

        }
        try {
            const instanceModelFavorites = new Drive_Data_Favorites()
            this.favorites = await instanceModelFavorites.save_And_Update_Favorites(res)
            this.handlerViewFavorites()
        }
        catch (error) {
            console.error(error)
        }
        finally {
            loadSpinner(true)

        }
    }
    /**
     * The `handlerViewFavorites` function creates a card for each item in the favorites array using the
     * `create_Card` method of the `instance_View` object.
     */
    handlerViewFavorites() {
        this.changeStateHeart.display_FavoritesHeart(this.favorites)
    }

    /**
     * The function callingApi asynchronously fetches a single product using an API, handling loading
     * spinner display before and after the API call.
     * @returns The `callingApi` function is returning the result of the API call if successful, or an
     * error object if there was an error during the API call.
     */
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

    /**
     * This async function returns the favorite real-time authentication for a given user ID.
     * @param uid - The `uid` parameter in the `returnFavoriteRealTimeAuth` function likely stands for
     * "user ID," which is used to identify a specific user in the system. It is passed to the function to
     * retrieve the favorite items associated with that particular user from the real-time database.
     * @returns The function `returnFavoriteRealTimeAuth` is returning the favorites data fetched from the
     * real-time database for the specified user ID (uid).
     */
    async returnFavoriteRealTimeAuth(uid) {
        const dbFavorites = await this.realTimeDb.returnFavoritesRealTimeDb(uid)
        this.favorites = dbFavorites
        return this.favorites
    }

    /**
     * The function `sendFavoriteToView` checks if there are favorite items, creates a template for
     * displaying them, and returns an object indicating whether there are favorites or not.
     * @returns The `sendFavoriteToView()` method returns an object `this.objectFav` which contains a
     * `list` property and a `validation` property. The `list` property will either be an array of
     * favorites from `this.favorites.favorites` or `null`, depending on whether there are favorites
     * present. The `validation` property will be `true` if there are favorites, and `
     */
    sendFavoriteToView() {
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
            const listFavorites = new TemplateCardsFavorites()
            console.log(this.objectFav.list);
            listFavorites.create_Card(this.objectFav.list)
            listFavorites.insertFavorites()
            listFavorites.display_FavoritesHeart(this.objectFav.list)
            listFavorites.deleteCardFavorite()
            return this.objectFav
        }
        //------------------------------//	

        this.objectFav = {
            list: null,
            validation: false
        }
        return this.objectFav
    }
}
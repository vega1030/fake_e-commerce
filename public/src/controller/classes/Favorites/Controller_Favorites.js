'use strict'

import { View_Favorites } from "../../../view/view.js"
import { RealTimeDB } from "../../../services/realtimedatabase.js"
import { Auth } from "../../../services/auth.js"
import { Control_cart, loadSpinner } from "../../controller.js"
import { Drive_Data_Favorites } from "../../../model/classes/Favorites/Drive_Data_Favorites.js"
import { get_Single_Product } from '../../../api.js'
import { EventManager } from "../../../Event Manager/EventManager.js"
import { TemplateCardsFavorites } from "../../../view/classes/TemplateCardsFavorites.js"



export class Controller_Favorites {
    constructor() {
        this.objectFav
        this.instance_View = new View_Favorites()
        this.id = ''
        this.realTimeDb = new RealTimeDB()
        this.authFirebase = new Auth()
        this.favorites = new Drive_Data_Favorites()

    }


    /*
     * The function `handler_Favorites()` adds event listeners to elements with the class "favorite" and
     * performs various actions when clicked */

    handler_Favorites() {
        const favoriteId = document.querySelectorAll('.favorite');
        favoriteId.forEach(element => {
            element.addEventListener('click', (e) => {
                const class_List = e.target.classList.value;
                this.id = class_List === 'pathHeart' ?
                    Number(e.target.parentElement.parentElement.dataset.id) :
                    Number(e.target.dataset.id);
                this.handlerResponseApi()
            });
        });
    }

    async handlerResponseApi() {
        const res = await this.callingApi()
        loadSpinner(false)
        if (res === undefined) {
            return loadSpinner(true)

        }
        //create try catch an finally catch the error
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
    handlerViewFavorites() {
        this.instance_View.display_FavoritesHeart(this.favorites)
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

    async returnFavoriteRealTimeAuth(uid) {
        const dbFavorites = await this.realTimeDb.returnFavoritesRealTimeDb(uid)
        this.favorites = dbFavorites
        return this.favorites
    }


    sendFavoriteToView() {

        console.log(this.favorites.favorites)
        /* This code snippet is a ternary operator that checks if the length of `this.favorites` is greater
        than 0. If the condition is true, it assigns an object to `this.objectFav` with properties `list`
        set to `this.favorites` and `validation` set to `true`. If the condition is false (i.e.,
        `this.favorites` length is not greater than 0), it assigns an object to `this.objectFav` with `list`
        set to `null` and `validation` set to `false`. 
        */
        this.favorites.favorites.length > 0 ?
            this.objectFav = {
                list: this.favorites.favorites,
                validation: true
            } :
            this.objectFav = {
                list: null,
                validation: false
            }
        //------------------------------//	
        if (this.objectFav.validation === true) {
            const listFavorites = new TemplateCardsFavorites()
            listFavorites.create_Card(this.objectFav.list)
            listFavorites.insertFavorites()
            this.instance_View.display_FavoritesHeart(this.objectFav.list)
            this.instance_View.deleteCardFavorite()
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
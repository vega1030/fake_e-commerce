'use strict'

import { StorageService } from "../../model/classes/storage/StorageService.js"
import { keysLocalStorage } from "../../constants.js"
import { View_Favorites } from "../../view/view.js"
import { RealTimeDB } from "../../services/realtimedatabase.js"
import { Auth } from "../../services/auth.js"
import { loadSpinner } from "../controller.js"
import { Drive_Data_Favorites } from "../../model/classes/Favorites/Drive_Data_Favorites.js"
import { get_Single_Product } from '../../api.js'

export class Controller_Favorites {
    constructor() {
        this.objectFav
        this.instance_View = new View_Favorites()
        this.id = ''
        this.realTimeDb = new RealTimeDB()
        this.authFirebase = new Auth()
    }

    /* --------------------------------------- */

    /*     async save_And_Update_Favorites(favoriteProduct) {
            this.favorites = this.favoritesStorage.getItem(keysLocalStorage.FAVORITES) || []
            const index = this.favorites.findIndex(i => i.id === favoriteProduct.id);
    
            if (index !== -1) {
                this.favorites.splice(index, 1);
                this.favoritesStorage.setItem(keysLocalStorage.FAVORITES, this.favorites)
                return this.favorites
            }
    
            else {
                this.favorites.push(favoriteProduct);
                this.favoritesStorage.setItem(keysLocalStorage.FAVORITES, this.favorites)
                return this.favorites
            }
        } */

    /*     mergeFavorites(favoritesFromDB, favoritesFromLocalStorage) {
            const mergedFavorites = {};
    
            const mergeArray = (array) => {
                if (!array) return;
    
                array.forEach(product => {
                    const productId = product.id;
                    mergedFavorites[ productId ] = { ...product };
                });
            };
    
            mergeArray(favoritesFromDB);
            mergeArray(Object.values(favoritesFromLocalStorage));
            const resultArray = Object.values(mergedFavorites);
            this.favorites = resultArray;
            return resultArray;
        } */

    /* --------------------------------------- */





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
        console.log(res)
        loadSpinner(false)
        if (res === undefined) {
            return loadSpinner(true)

        }
        //create try catch an finally catch the error
        try {
            const instanceModelFavorites = new Drive_Data_Favorites()
            console.log(res)
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
        document.querySelector('#favorites').addEventListener('click', async () => {
            this.returnFavoriteRealTimeAuth()
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
'use strict'

import { loadSpinner } from '../../../view/functions/spinner.js';

import {
    get_Single_Product
} from '../../../api.js'

import { Controller_Favorites } from '../Favorites/Controller_Favorites.js'
import { Drive_Data_Favorites } from '../../../model/classes/Favorites/Drive_Data_Favorites.js'
import { Control_cart } from '../../controller.js'

/* The `ControlIndividualProduct` class manages individual product actions such as adding to cart and
marking as favorite, with methods for handling single product data and user interactions. */
export class ControlIndividualProduct {

    constructor() {
        this.id = ''
        this.delegationContent = document.querySelector('#individual_product')
        this.favorite = new Controller_Favorites()
        this.handlerSaveFavorites = new Drive_Data_Favorites()
        this.controllerCart = new Control_cart()
    }

 /**
  * The function `handlerSingleProduct` asynchronously fetches a single product by its ID, displaying a
  * spinner while loading and handling any errors.
  * @param id - The `handlerSingleProduct` function is an asynchronous function that takes an `id` as a
  * parameter. Inside the function, it first calls the `loadSpinner` function with a `false` parameter
  * to stop the spinner. Then it tries to fetch a single product using the `get_Single_Product
  * @returns The `handlerSingleProduct` function is returning the result of the
  * `get_Single_Product(data_Id)` function call, which is stored in the `res` variable. This result
  * will be returned to the caller of the `handlerSingleProduct` function.
  */
    async handlerSingleProduct(id) {

        //check why this is doesn't res
        loadSpinner(false)
        try {
            const data_Id = Number(id)
            const res = await get_Single_Product(data_Id)
            return res

        } catch (error) {

        }
        finally {
            loadSpinner(true)
        }
    }

 /**
  * The `listenerAddCart` function adds a click event listener to a specific element and sends the
  * element's dataset ID to an API when a certain condition is met.
  */
    listenerAddCart() {
        this.delegationContent.addEventListener('click', async (e) => {
            const targetElement = e.target.classList.contains('individual_btn_add_to_cart')
            this.id = e.target.dataset.id
            const result = targetElement === true ? await this.controllerCart.send_Id_To_Api(this.id) : undefined
            return result
        })
    }


/**
 * The `listenerFavorite` function listens for click events on a specific element, retrieves product
 * information based on the clicked element, and saves the product to favorites if the element is a
 * heart icon.
 */
    listenerFavorite() {
        this.delegationContent.addEventListener('click', async (e) => {
            try {
                loadSpinner(false);
                const targetElement = e.target.classList.contains('pathHeart');
                const targetId = e.target.classList.value === 'pathHeart' ? e.target.dataset.id : e.target.dataset.id;
                this.id = targetId;
                const res = await get_Single_Product(this.id);
                if (this.id === undefined) {
                    return this.id;
                }
                if (targetElement === true) {
                    const res = await get_Single_Product(this.id);
                    const resList = this.handlerSaveFavorites.save_And_Update_Favorites(res);
                    return resList;
                }
            } catch (error) {
                console.log(error)
            } finally {
                loadSpinner(true);
            }

        })
    }

}
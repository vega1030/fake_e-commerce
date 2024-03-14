'use strict'

import { loadSpinner } from '../../view/functions/spinner.js';

import {
    get_Single_Product
} from '../../api.js'

import { Controller_Favorites } from '../classes/Controller_Favorites.js'
import { Drive_Data_Favorites } from '../../model/classes/Favorites/Drive_Data_Favorites.js'
import { Control_cart } from '../controller.js'

export class ControlIndividualProduct {

    constructor() {
        this.id = ''
        this.delegationContent = document.querySelector('#individual_product')
        this.favorite = new Controller_Favorites()
        this.handlerSaveFavorites = new Drive_Data_Favorites()
        this.controllerCart = new Control_cart()
    }

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

    listenerAddCart() {
        this.delegationContent.addEventListener('click', async (e) => {
            const targetElement = e.target.classList.contains('individual_btn_add_to_cart')
            this.id = e.target.dataset.id
            const result = targetElement === true ? await this.controllerCart.send_Id_To_Api(this.id) : undefined
            return result
        })
    }

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
                    console.log(res);
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
'use strict'

import { loadSpinner } from '../../view/functions/spinner.js';

import {
    get_Single_Product
} from '../../api.js'

export class ControlIndividualProduct {

    constructor() {
        this.id = ''
        this.delegationContent = document.querySelector('#individual_product')
    }

    async handlerSingleProduct(id) {
        //check why this is doesn't res
        console.log('click')
        loadSpinner(false)
        try {
            console.log('click')
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
            const result = targetElement === true ? await controller_Cart_Instance.send_Id_To_Api(this.id) : undefined
            return result
        })
    }

    listenerFavorite() {
        this.delegationContent.addEventListener('click', async (e) => {
            const targetElement = e.target.classList.contains('pathHeart');
            const targetId = e.target.classList.value === 'pathHeart' ? e.target.dataset.id : e.target.dataset.id;
            this.id = targetId;

            const res = await get_Single_Product(this.id);
            console.log('res: ', res);
            if (this.id === undefined) {
                return this.id
            }

            if (targetElement === true) {
                favorites.id = this.id
                const res = await get_Single_Product(favorites.id)
                const resList = favorites.save_And_Update_Favorites(res)
                //return resList
                favorites.handler_Favorites()
                return resList
            }
        })
    }

}
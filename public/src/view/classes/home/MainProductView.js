'use strict'

import { ControllerMainProduct } from "../../../controller/classes/Landing_Page/ControllerMainProduct.js";
import { InsertTemplate } from "../../view.js";




export class MainProductView {

    constructor() {
        this.mainProductView = new InsertTemplate()
        this.controllerMainProduct = new ControllerMainProduct()
        this.product = this.controllerMainProduct.singleProduct()
        this.templateHtml = ''
    }

    async templateMainProduct() {



        const { image } = await this.product

        const htmlProduct =
            `
            <div class=vertical-container>
               <h3>New Season</h3>
            </div>
        <aside aside class="container-main-banner" >
            <div>
            <img src=${ image } 
            alt="image main product
            class=main-image" 
            />
            </div>
            <p>
                lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
        </aside >
        `
        this.templateHtml = htmlProduct
        return this.templateHtml
    }

}
const insertProduct = new MainProductView();



insertProduct.mainProductView.insertTemplate(await insertProduct.templateMainProduct())

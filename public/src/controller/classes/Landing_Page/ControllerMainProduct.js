'use strict'
import { get_Single_Product } from '../../../api.js';

export class ControllerMainProduct {

    constructor() {
        this.mainProduct = get_Single_Product(7)
    }

    singleProduct() {
        return this.mainProduct;
    }
}

const singleProduct = new ControllerMainProduct()
console.log(await singleProduct.mainProduct); 

'use strict';

import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js";
import { UpdateQuantityCart } from "./UpdateQuantityCart.js";



export class ModifyQuantity_Subtract {

    constructor() {
        this.model = new Drive_Data_Cart()
        this.updateQuantity = new UpdateQuantityCart()
        this.id = ''
    }

    subtractProduct() {
        return this.updateQuantity.update_Quantity_Cart(this.id, true)
    }
}
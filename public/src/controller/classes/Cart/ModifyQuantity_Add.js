'use strict';

import { ModifyQuantity_Subtract } from "./ModifyQuantity_Subtract.js";

export class ModifyQuantity_Add extends ModifyQuantity_Subtract {

    addProduct() {
        this.updateQuantity.update_Quantity_Cart(this.id, false)
        return
    }
}
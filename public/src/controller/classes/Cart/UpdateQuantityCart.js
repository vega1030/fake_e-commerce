'use strict'

import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js";



export class UpdateQuantityCart {

    constructor() {
        this.model = new Drive_Data_Cart()
    }

    update_Quantity_Cart(id = "", flag) {
        if (flag === true) {

            const updateCart_Minus = this.model.returnCopyLocalStorage().map
                (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            this.model.setCartLocalStorage(updateCart_Minus)
            this.model.returnCopyLocalStorage()
            return this.model.modelCart = updateCart_Minus
        }
        
        const updateCart_Add = this.model.returnCopyLocalStorage().map
            (i => i.id === id ?
                { ...i, quantity: i.quantity <= 9 ? i.quantity + 1 : i.quantity } : i)

            .filter(i => i.quantity > 0);
        this.model.setCartLocalStorage(updateCart_Add)
        this.model.modelCart = updateCart_Add
        return this.cart
    }

}
'use strict'
import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js";
import { ViewCountCart } from "../../../view/classes/cart/ViewCountCart.js";
import { render_Total_And_Pay } from "../../../view/view.js";

export class HandlerQuantityAndTotal {

    constructor() {
        this.total = 0
        this.quantity;
        this.storage = new Drive_Data_Cart();
        this.countCartNavBar = new ViewCountCart();
    }


    /* The `quantity_In_Cart(data)` method is calculating the total quantity of items in the cart. It
    takes an array of data as input, which represents the items in the cart. It then uses the
    `reduce` method to iterate over the data array and sum up the quantities of each item. If the
    quantity of an item is undefined, it skips that item and continues with the calculation.
    Finally, it updates the cart display with the total quantity and returns the calculated total
    quantity. */

    quantity_In_Cart() {
        this.quantity = this.storage.returnCopyLocalStorage() === undefined || 0 ? 0 : this.storage.returnCopyLocalStorage().reduce((previous, current) => {
            return current.quantity === undefined ? previous : previous + current.quantity
        }, 0)
        this.countCartNavBar.createCartCont(this.quantity)
        return this.quantity
    }

    controllerCart_Total_Quantity() {

        const total_And_Quantity = this.storage.returnCopyLocalStorage().reduce((previous, current) => {
            previous.quantity = current.quantity + previous.quantity;
            previous.total += current.quantity * current.price;
            return previous
        }, { total: 0, quantity: 0 })

        this.total = Number(total_And_Quantity.total.toFixed(2))

        this.quantity_In_Cart(this.storage.returnCopyLocalStorage())

        render_Total_And_Pay(total_And_Quantity)
        return this.total
    };
}

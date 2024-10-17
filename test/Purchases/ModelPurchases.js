import { HandlerQuantityAndTotal } from "../../public/src/controller/classes/Cart/HandlerQuantityAndTotal.js"
import { Drive_Data_Cart } from "../../public/src/model/classes/Cart/Drive_Data_Cart.js"





export class ModelPurchases {

    constructor() {
        this.cart = new Drive_Data_Cart()
        this.controlCart = new HandlerQuantityAndTotal()


    }

    createdPurchase() {
        const purchase = {
            cart: this.cart.returnCopyLocalStorage(),
            total: this.controlCart.controllerCart_Total_Quantity()
        }
        return purchase

    }

    savePurchase(purchase) {
        this.purchase.push(purchase)
        console.log(this.purchase);
        return this.purchase
    }



}
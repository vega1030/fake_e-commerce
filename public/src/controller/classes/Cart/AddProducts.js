'use strict';

import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js";
import { StorageService } from "../../../model/classes/storage/StorageService.js";
import { ViewCountCart } from "../../../view/classes/cart/ViewCountCart.js";
import { render_Total_And_Pay } from "../../../view/view.js";





export class AddProducts {

    constructor() {
        this.storage = new StorageService()
        this.model = new Drive_Data_Cart()
        this.countCartNavBar = new ViewCountCart()
    }

    addProductsInCart(paramProduct) {
        if (this.shouldClearCart) {
            this.model.modelCart = []
            this.shouldClearCart = false
        }


        const updatedCart = [ ...this.model.modelCart, paramProduct ];

        const updatedCartReduced = updatedCart.reduce((acc, e) => {
            const existingIndex = acc.findIndex((x) => e.id === x.id);

            if (existingIndex !== -1) {
                const existingProduct = this.model.modelCart[ existingIndex ];
                const newQuantity = existingProduct.quantity + paramProduct.quantity >= 10 ? 10 : existingProduct.quantity + paramProduct.quantity

                existingProduct.quantity = newQuantity;
                //checkk here because acumulate values
                if (newQuantity >= 10) {
                    console.log('quantity invalid');
                    return this.model.modelCart;
                }

            } else {
                acc.push(e);
            }
            return acc;
        }, []);

        const isProductAddedOrUpdated = updatedCartReduced.some((product) => {
            const existingProduct = this.model.modelCart.find((p) => p.id === product.id);
            if (!existingProduct) {
                return true;
            }
            if (existingProduct.quantity !== product.quantity) {
                return true;
            }
            return false;
        });

        const allQuantitiesAreZero = updatedCartReduced.every((product) => product.quantity === 0);

        if (isProductAddedOrUpdated || allQuantitiesAreZero) {
            this.model.modelCart = updatedCartReduced;
        }

        return { result: isProductAddedOrUpdated || allQuantitiesAreZero, cart: this.model.modelCart };
    }

    quantity_In_Cart(data) {

        const acu = data === undefined || 0 ? 0 : data.reduce((previous, current) => {
            return current.quantity === undefined ? previous : previous + current.quantity

        }, 0)
        this.countCartNavBar.createCartCont(acu)
        return acu
    }

    controller_Cart() {
        const total_And_Quantity = this.model.returnCopyLocalStorage().reduce((previous, current) => {
            previous.quantity = current.quantity + previous.quantity;
            previous.total += current.quantity * current.price;
            return previous
        }, { total: 0, quantity: 0 })

        this.total = Number(total_And_Quantity.total.toFixed(2))

        this.quantity_In_Cart(this.model.returnCopyLocalStorage())

        render_Total_And_Pay(total_And_Quantity)
    };
}
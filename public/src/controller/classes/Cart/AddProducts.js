'use strict';

import { Drive_Data_Cart } from "../../../model/classes/Cart/Drive_Data_Cart.js";
import { StorageService } from "../../../model/classes/storage/StorageService.js";

export class AddProducts {

    constructor() {
        this.storage = new StorageService()
        this.model = new Drive_Data_Cart()
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
                acc[ existingIndex ].quantity += e.quantity;
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
        };
        this.model.modelCart = updatedCartReduced;

        console.log("🚀 ~ AddProducts ~ addProductsInCart ~ this.model.modelCart:", this.model.modelCart);
        
        return { result: isProductAddedOrUpdated || allQuantitiesAreZero, cart: this.model.modelCart };
    }

}
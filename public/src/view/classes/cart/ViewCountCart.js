'use strict'
/* The ViewCountCart class in JavaScript creates a cart container and updates the quantity of items in
the cart. */
export class ViewCountCart {

    /**
     * The function creates a cart container and updates the quantity of items in the cart.
     * @param quantity - The quantity parameter is a number that represents the number of items in a
     * shopping cart.
     */
    createCartCont(quantity) {

        const counter = document.querySelector('#count_elements_at_cart')
        const content_Counter = document.querySelector('#section_cart')
        if (counter) {
            quantity > 9 ? counter.innerText = '+9' : counter.innerText = JSON.stringify(quantity)
            return content_Counter.appendChild(counter)
        }

    }

}
'use strict'

import { TemplateCardsHome } from "../home/TemplateCardsHome.js"



export class ChangeColorHeart{


    display_FavoritesHeart(product) {
        //check color state here
        const content_Cards = document.querySelector('.main-grid')
        const cardsClass = String('.' + content_Cards.firstElementChild.classList[ 0 ])
        const cards = [ ...document.querySelectorAll(cardsClass) ]
        const select =
            cards.map(current => {

                current.firstElementChild.firstElementChild.style.color = 'black'
                //____
                const matchingProduct = product.find(item => item.id === Number(current.firstElementChild.dataset.id));
                return matchingProduct ? current : null;
            });
        this.fav_DOM = select.filter(item => item !== null)

        this.fav_DOM.map(i => i.children[ 0 ].firstElementChild).forEach(i => {

            const changeColor = () => { i.style.color === 'black' ? i.style.color = 'red' : i.style.color = 'black' }
            product === undefined ? i.style.color === 'black' : changeColor()
        })
        /* The above code is assigning the value of `this.fav_DOM` to the `heartsDom` property of the
        `products_Instance` object in JavaScript. */
        const products_Instance = new TemplateCardsHome()
        products_Instance.heartsDom = this.fav_DOM
        //------------------------------------------------------------------------------------------------------------------------------
        return this.fav_DOM

    }


}
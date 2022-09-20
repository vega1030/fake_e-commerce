'use strict';

import {
    controller_Store,
    Product
} from './controller.js';


class Card_Product extends Product {
    constructor(img){ 
        super();
    this._img = img
    }

    set img(newImg){
        this._img = newImg
    }

    get img() {
        return this._img
    }

    create_Card(product){
        const content_Cards = document.querySelector('#content_card')
        let cards = ''
        product.forEach(data=>{
            cards +=
            `
            <div class="content-sale__child">
                <img src="${data.image}" class="${data.title}"alt="" srcset="">
                <div class="content-text">
                    <h2>Promo</h4>
                    <h3>${data.title}</h3>
                    <h4>'US$',${data.price}</h4>
                        
                </div>
                <button type="button" class="btn btn-primary btn-card">COMPRAR ONLINE</button>
            </div>
            `
        content_Cards.innerHTML = cards
        })
    }
}

const cardProduct = new Card_Product

cardProduct.create_Card(controller_Store)







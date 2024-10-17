'use strict'

import { TemplateCardsHome } from "../home/TemplateCardsHome.js";

/* The DynamicCategories class creates dynamic category navigation and displays products based on the
selected category. */
export class DynamicCategories {

/* The `createDynamicCategoryNav(categories)` function is responsible for creating dynamic category
navigation based on the provided `categories` array. Here's a breakdown of what it does: */
    createDynamicCategoryNav(categories) {
        const content_Li_In_Header = document.querySelector('#list_classification')
        let modelNavHeader = "";
        categories.forEach(elements => {
            modelNavHeader +=
                `
                        <li class="dropdown-item_ul">
                            <a class="dropdown-item listener_category route" href="#_categories" data-category="${ elements }"> ${ elements } </a>
                        </li>
                        `;
            if (content_Li_In_Header) {
                return content_Li_In_Header.innerHTML = modelNavHeader;
            };
        });
    };

/* The `displayProductsByCategory` function is an arrow function that takes in a `data` parameter.
Inside the function:
1. It selects the element with the id `content_card` from the document and assigns it to the
`contentCards` constant.
2. It creates an instance of the `TemplateCardsHome` class and assigns it to the `products_Instance`
constant.
3. It calls the `create_Card` method of the `products_Instance` object, passing the `data` parameter
to create the card based on the provided data.
4. It sets the `innerHTML` of the `contentCards` element to the `modelCard` property of the
`products_Instance` object, effectively displaying the generated card content on the webpage. */
    displayProductsByCategory = (data) => {
        const contentCards = document.querySelector('#content_card')
        const products_Instance = new TemplateCardsHome()
        products_Instance.create_Card(data)
        contentCards.innerHTML = products_Instance.modelCard
    }
}


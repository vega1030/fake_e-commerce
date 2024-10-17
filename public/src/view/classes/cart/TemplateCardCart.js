'use strict'

import { StorageService } from "../../../model/classes/storage/StorageService.js";
import { keysLocalStorage } from "../../../constants.js";


/* The TemplateCardCart class in JavaScript creates a dynamic UI cart list with product items and
handles deletion of elements in the DOM. */
export class TemplateCardCart {

    constructor() {
        this.productList = new StorageService()
    }

/* The `model_UiCart_List` method in the `TemplateCardCart` class is responsible for generating a
dynamic UI cart list based on the items stored in the localStorage under the key
`keysLocalStorage.CART`. Here is a breakdown of what the method is doing: */
    model_UiCart_List = () => {
        if (this.productList.getItem(keysLocalStorage.CART) === null) { return }
        const section_Content_Data = document.querySelector('#ui_Cart')
        section_Content_Data.innerHTML = ''

        //create a new container
        const container = document.createElement('div');

        //create dynamic elements

        const newCart = this.productList.getItem(keysLocalStorage.CART).map(item => {
            const contentTrash = document.createElement('img')
            contentTrash.src = '../../public/icon/trash_basket.svg'
            contentTrash.alt = 'trash basket'
            contentTrash.classList.add('trash_count')
            contentTrash.setAttribute('data-id', item.id);




            const content_Data = document.createElement('div');
            content_Data.classList.add('content_card____cart');
            content_Data.setAttribute('data-id', item.id);



            const content_Image_Product = document.createElement('div');
            content_Image_Product.classList.add('content_image_product_at_cart', 'content_photo');

            const img_Product = document.createElement('img');
            img_Product.classList.add('img-card____cart');
            img_Product.src = item.image;
            img_Product.alt = 'img';

            content_Image_Product.appendChild(img_Product);

            const content_Description = document.createElement('div');
            content_Description.classList.add('content_description');

            const h5 = document.createElement('h5');
            h5.textContent = item.title.slice(0, 20);
            content_Description.appendChild(h5);

            const price = document.createElement('div');
            price.classList.add('price');

            const h4 = document.createElement('h4');
            h4.textContent = `${ item.price }\u20AC`;
            price.appendChild(h4);

            const content_Select = document.createElement('div');
            content_Select.classList.add('content_select');

            const subtractBtn = document.createElement('a');
            subtractBtn.classList.add('subtract');
            subtractBtn.setAttribute('data-id', item.id);


            const countInput = document.createElement('input');
            countInput.classList.add('count', 'form-control');
            countInput.setAttribute('type', 'number');
            countInput.setAttribute('min', '0');
            countInput.setAttribute('max', '10');
            countInput.setAttribute('data-id', item.id);
            countInput.value = item.quantity;

            const addBtn = document.createElement('a');
            addBtn.classList.add('add');
            addBtn.setAttribute('data-id', item.id);
            addBtn.textContent = '+';

            content_Select.appendChild(subtractBtn);
            content_Select.appendChild(countInput);
            content_Select.appendChild(addBtn);

            content_Data.appendChild(content_Image_Product);
            content_Data.appendChild(content_Description);
            content_Data.appendChild(price);
            content_Data.appendChild(content_Select);

            section_Content_Data.appendChild(content_Data);
            item.quantity === 1 ? subtractBtn.appendChild(contentTrash) : subtractBtn.textContent = '-';

            return { ...item, content_Data };
        });

    }

/**
 * The function `handle_Delete_Element_In_DOM` removes a specified element from the Document Object
 * Model (DOM).
 * @param element - The `element` parameter in the `handle_Delete_Element_In_DOM` function refers to
 * the DOM element that you want to remove from the document. This function will remove the specified
 * element from the DOM when called.
 * @returns The `remove()` method is being called on the `element`, which removes the element from the
 * DOM. The method does not return anything explicitly, so the return value would be `undefined`.
 */
    handle_Delete_Element_In_DOM(element) {
        return element.remove()
    }

}
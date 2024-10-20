export class TemplateCardsHome {


    constructor(heartsDom) {
        this.heartsDom = heartsDom
        this.modelCard = ''
        this.modelIndividualCard = ''
        this.products = ''
    }

    /* Creating a card with the information of the product. */
    create_Card(products) {
        this.products = ''
        this.modelCard = ''
        this.products = products
        let model = ''
        this.products.forEach(data => {


            //------------------
            model +=
                `
                <div class=" content-sale__child shadow-sm p-3 mb-5 bg-body-tertiary rounded" data-category="${ data.category }" data-id="${ data.id }">
                    <button  type="button" class="favorite" id=${ data.id } data-id="${ data.id }" value = "on"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path class= "pathHeart" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                    </button>
                    <div class="content_photo">
                        <img src="${ data.image }" class="${ data.title } img-cards-product" alt="" srcset="">
                    </div>
                <div class="content-text">
                    <a href="#individual_product" class="content_names view_one_element individual_product" data-id="${ data.id }">
                        ${ data.title.slice(0, 20) }
                    </a>                      
                    <h4 class= price> ${ data.price.toLocaleString('es-AR', { style: 'currency', currency: 'EUR' }) }</h4>  
                </div>
                <button class='btn_add_to_cart' id='${ data.id }'>
                Add Cart 
                </button>
                </div>
                `;
            this.modelCard = model
            return this.modelCard
        })

    }
    insertAllProducts() {
        const content_Cards = document.querySelector("#content_card");
        content_Cards ? content_Cards.innerHTML = this.modelCard : null;
    }
    
}
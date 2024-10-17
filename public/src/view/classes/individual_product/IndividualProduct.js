'use strict'


export class IndividualProduct {

    constructor() {
        this.heartsDom = ''
        this.modelIndividualCard = ''
    }

    uI_Individual_Card(product) {
        let model = ''
        this.modelIndividualCard = ''

        const colorHeart = this.heartsDom.style.color

        console.log(colorHeart)

        const coincidentElements = Number(this.heartsDom.dataset.id) === product.id

        const content_Individual_Cards = document.querySelector('#individual_product')

        content_Individual_Cards.innerHTML = ''
        //initialize color
        const initialColor = coincidentElements === undefined ? 'black' : 'red'
        //-----
        model =

            `
            <article class="content_image___individual_item ">
                <img src="${ product.image }" alt="image${ product.title }" class="image_style">
            </article>

            <aside>            
                <div class="content_title___individual_item">
                    <h1> ${ product.title.slice(0, 20) }</h1>
                </div>
                <div class='content-button-favorite' data-id="${ product.id }">
                    <button type="button" class="favorite individual-favorite" data-id="${ product.id }" value="on"> 
                        <svg data-id="${ product.id }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill=${ colorHeart } class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path data-id="${ product.id }" class="pathHeart heart-path" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                    </button>
                </div>
                <div class="content-buttons___individual_item">
                    <button type="button" data-id ="${ product.id }" class="btn btn-primary btn-card individual_btn_add_to_cart">Add Cart</button>
                </div>
                <div class="content_price___individual_item">
                    <h3>${ product.price }\u20AC</h3>
                </div>
                <div class="content_description___individual_item">
                    <p>
                        ${ product.description.slice(0, 40) }
                    </p>
                </div>
            </aside>
        `
        this.modelIndividualCard = model
        return this.modelIndividualCard
    }


    insertIndividualCard() {
        const content_Individual_Cards = document.querySelector('#individual_product')
        content_Individual_Cards.insertAdjacentHTML('afterbegin', this.modelIndividualCard)
    }

    changeColorHeart() {
        const content_Individual_Cards = document.querySelector('#individual_product')
        content_Individual_Cards.addEventListener('click', (e) => {
            const isInsideFavorite = e.target.closest('.individual-favorite');
            if (isInsideFavorite) {
                const heart = e.currentTarget.querySelector('.individual-favorite > svg');
                const currentColor = heart.getAttribute('fill');
                if (currentColor === 'black') {
                    console.log('black');
                    heart.setAttribute('fill', 'red');
                } else {
                    console.log('red');
                    heart.setAttribute('fill', 'black');
                }
            }
        });

    }

}



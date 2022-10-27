import { instance_Control_Routes } from './controller.js';

class Create_Routes {

    constructor(hash) {
        this._hash = hash;
    }

    push_Id(e = '') {
        const url = new URL(window.location)
        console.log(url);
        url.searchParams.set('page', e.target.id)
        return history.pushState({}, '', url)
    }

}

const new_Routes = new Create_Routes


window.addEventListener('hashchange', (e) => {
    console.log(location.hash);
    instance_Control_Routes.reception_Hash(location.hash);
}, false)


window.addEventListener("load", (e) => {
    window[ "_home" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "_categories" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "individual_card_product" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "cart" ].addEventListener("click", event => new_Routes.push_Id(event))
})


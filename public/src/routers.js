import { Control_Routes } from './controller/controller.js';

class Create_Routes {

    constructor(hash) {
        this._hash = hash;
    }

    push_Id(e = '') {
        const url = new URL(window.location)
        url.searchParams.set('page', e.target.id)
        return history.pushState({}, '', url)
    }

}




window.addEventListener('hashchange', (e) => {
    console.log(e)
    const instance_Control_Routes = new Control_Routes()
    console.log(e.oldURL)
    instance_Control_Routes.reception_Hash(location.hash);
    console.log(location.hash)
}, false);


window.addEventListener("load", (event) => {
    console.log(event);
    window[ "home" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "_categories" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "#individual_product" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "cart" ].addEventListener("click", event => new_Routes.push_Id(event))
    window[ "pay" ].addEventListener("click", event => new_Routes.push_Id(event))
})


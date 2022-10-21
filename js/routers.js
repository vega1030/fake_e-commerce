// const select_Tab = (id) => {
//     //remove selected class from all buttons
//     document.querySelectorAll(".route").forEach(item => item.classList.remove('selected'))

//     document.querySelectorAll("#" + id).forEach(item => item.classList.add('selected'))
// }

// const load_Content = (id) => {

//     console.log("loading content for {", id, "}");
//     const text = document.createTextNode('Content loading for/' + id + '...')

// }
console.log(window["cart"]);

const push_Id = (e = '') => {
    let id = e.target.id;
    if (id === '') {
        const url = new URL(window.location)
        url.searchParams.set('page', 'home')
        history.pushState({}, '', url)
    }
    else {
        const url = new URL(window.location)
        url.searchParams.set('page', id)
        history.pushState({}, '', url)
    }


window.addEventListener("load",(e)=>{
    console.log(e)
    window[ "home" ].addEventListener("click", event => push_Id(event))
    window[ "section_categories" ].addEventListener("click", event => push_Id(event))
    window[ "individual_card_product" ].addEventListener("click", event => push_Id(event))
    window[ "cart" ].addEventListener("click", event => push_Id(event))
})
window.addEventListener("load",push_Id("section_home"))

    // select_Tab(id)

    // document.title = id;

    // load_Content(id);


}




// window.addEventListener('popstate', (event) => {
//     console.log(event.state);
//     let stateId = event.state.id;
//     console.log("stateId= ", stateId)
//     select_Tab(stateId)
//     load_Content(stateId)
//     console.log(`location: ${ document.location }, state: ${ JSON.stringify(event.state) }`);

// })





// window.addEventListener('popstate',(event)=>{
//     console.log(`location popstate: ${document.location}, state: ${JSON.stringify(event.state)}`);
//     history.pushState({page: 1},"title 1","?page=1")
//     history.pushState({page: 2},"title 2","?page=2")
// });
// window.addEventListener("hashchange",()=>{
//     console.log(window.location.hash);
// })

// class Routes{
//     constructor(route={}) {
//         this._route = route
//     }
// }
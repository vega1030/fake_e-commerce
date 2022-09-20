'use strict'


const callFetchProducts = async (url="")=>{ 
    let response = []
    try {
        if (url === ""){
            console.error('error')
        }
        else{
            response = await fetch(url)
            const store = await response.json()
            
            return store; 
        }
    }
        catch (e){
            console.log(e)
        }
}


const products_Store = callFetchProducts('https://fakestoreapi.com/products');



export{
    products_Store
}
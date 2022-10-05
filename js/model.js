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

class Control_Data{

    save_Cart_Db(objCart){
        console.log(objCart);
        localStorage.setItem('cart',JSON.stringify(objCart))
    }

}







export{
    products_Store,
    Control_Data
}
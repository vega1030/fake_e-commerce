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

    //save data at cart

    save_Cart_Db(objCart){
        console.log(objCart);
        localStorage.setItem('cart',JSON.stringify(objCart))
    }
    //delete products at cart

    delete_Cart_db(objCart){
        if(objCart.id ===JSON.parse(localStorage.getItem('cart'))){

        }
    }


}







export{
    products_Store,
    Control_Data
}
'use strict'

import { products_Store } from "./model.js";

let controller_Store = await products_Store;

//product
class Product {
    constructor(title,category,price,description,id){
        this._title=title;
        this._category=category;
        this._price=price;
        this._description=description;
        this._id = id
    }

/* Creating a getter and setter for the title property. */

    set title(newTitle){
        this._title = newTitle
    }

    get title(){
        return this._title
    }

////********----------------------- */


/* A getter and setter for the category property. */
    set category(newCategory){
        this.category = newCategory
    }
    get category(){
        return this._category
    }

////********----------------------- */


/* A getter and setter for the price property. */
    set price(newPrice){
        this.category = newPrice
    }
    get price(){
        return this.__price
    }

////********----------------------- */


/* A getter and setter for the description property. */
    set description(newDescription){
        this.category = newDescription
    }
    get description(){
        return this.__description
    }

////********----------------------- */


}


const generate_Instance_Of_Product = (product ='')=>{
    product.forEach(iterable_Products =>{
        const instance_Product = new Product(
            iterable_Products.title,
            iterable_Products.category,
            iterable_Products.price,
            iterable_Products.description,
            iterable_Products.id)
            return instance_Product; 
    })
}
generate_Instance_Of_Product(controller_Store)



export{
    controller_Store,
    generate_Instance_Of_Product,
    Product
}
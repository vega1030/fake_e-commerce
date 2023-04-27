'use strict'

import { get_All_Products, get_Categories, get_View_Products_For_Category, get_Single_Product } from './api.js'
import { Drive_Data_Cart } from './model.js';
import { cart_Ui, Category_ui, products_Instance, Handler_Displays_Ui, View_Favorites, replace_Minus_Symbol_For_Trash_Basket } from "./view.js";

const handler_View = new Handler_Displays_Ui()
const handler_Cart_Controller = new Drive_Data_Cart()
const categories_UI = new Category_ui()


//----------------------------------------------------------------

class Control_Favorites {
   constructor(favorites) {
      this._favorites_ = favorites
   }

   async send_Favorite_Product_To_LocalStorage(id, flag) {

      if (id === '') {
         console.log('error')
      }
      else {
         const res = await calls_To_API.get_Single_Product(id)
         handler_Data_At_LocalStorage.save_Favorites(res, flag)
      }
   }
   reception_Favorite_Product(data) {
      data ? View_Favorites.display_Favorites(data) : false
   }
}

class Control_View_Information_At_DOM {

   constructor(products = [], single_Product = [], categories, total) {
      this.products = products
      this.single_Product = single_Product
      this.categories = categories
      this.total = total
   }

   async controller_get_All_Products() {
      //flag for spinner
      let flag_Load = false

      //flag_Load is the controller of load spinner
      try {

         this.products = await get_All_Products()

         const res = products_Instance.create_Card(this.products, false)
         if (!res) {

            throw new Error('Network response was not ok')
         }
      }

      catch (error) {
         console.log(error)
      }
      finally {
         flag_Load = true
         console.log(flag_Load)
      }
   }


   async control_View_Categories() {

      try {

         this.categories = await get_Categories()
         return categories_UI.createDynamicCategoryNav(this.categories)

      } catch (error) {
         console.log(error)
      }

   }

   async send_Category(category = '') {
      try {
         const result = await get_View_Products_For_Category(category)
         return products_Instance.create_Card(result, true)
      }
      catch (error) {
         console.error(error)
      }

   }

   async send_Id(id = '') {

      try {

         const res = await get_Single_Product(id)
         const product = { ...res }
         this.single_Product = [ ...this.single_Product, product ]
         return products_Instance.uI_Individual_Card(this.single_Product)

      } catch (error) {
         console.error(error)
      }

   }
}
//----------------------------------------------------------------
//-----------------------------------------------------------------------------//
const controller_Init_Page = new Control_View_Information_At_DOM()




//----------------------------------------------------------------
await controller_Init_Page.controller_get_All_Products()
await controller_Init_Page.control_View_Categories()


class Control_cart {

   constructor(total = 0, cart, elementDom) {
      this.cart = cart
      this.elementDom = elementDom
      this.single_Product = null
      this.id = null;
      

   }



   /* ------------------------------------ */

   handle_View_Products_At_Cart_ = (data = '') => {
      if (data === null) {
         console.log('error')
      }

      /* this.cart is ok  */
      this.cart = data

      cart_Ui.cart_In_Controller(this.cart)
   }

   /* ------------------------------------ */

   send_Cart_To_View = () => {
      console.log(this.cart)
      return this.cart

   }

   /* ------------------------------------ */



   /**
    * This function calculates the total quantity of items in a shopping cart and returns a cart container
    * element with the updated quantity.
    * @param data - The `data` parameter is an array of objects, where each object represents a product in
    * a shopping cart. Each object has a `quantity` property that represents the quantity of that product
    * in the cart. The `control_Quantity` function calculates the total quantity of all products in the
    * cart by sum
    * @returns the result of calling the `createCartCont` function from the `cart_Ui` module, passing in
    * the accumulated quantity (`acu`) as an argument.
    */
   control_Quantity = (data) => {
      if (!data) {
         return console.warn('cart is empty')
      }
      const acu = data === undefined ? 0 : data.reduce((previous, current) => {
         return previous + current.quantity
      }, 0)

      return cart_Ui.createCartCont(acu)
   }
   async send_Id_To_Api() {
      if (this.id) {
         const result = await get_Single_Product(this.id);
         this.single_Product = result
         handler_Cart_Controller.create_A_New_Array_Of_Object(this.single_Product)
         return this.single_Product;
      }
      return console.error('the id not exist');
   }   
   /* ------------------------------------ */

   add_Cart_Listener = () => {
      const btns_Cart = document.querySelectorAll('.btn_add_to_cart')
      const result = btns_Cart.forEach(item => item.addEventListener('click', (e) => {
         this.id = Number(e.target.id);
         this.send_Id_To_Api();
      console.log(handler_Cart_Controller.responseCart);
         return this.id;
      }))
   }




   /* The `cart_Quantity` method is a function that takes in two parameters `minus` and `add`, which are
   arrays of elements representing the minus and add buttons in the cart UI. The method then adds event
   listeners to these elements, so that when they are clicked, it updates the quantity of the
   corresponding product in the cart and updates the cart UI accordingly. */

   cart_Quantity = (minus, add) => {
      let acu = 0
      minus.forEach(elements => {

         elements.addEventListener('click', (e) => {

            if (e.target.nextElementSibling === null) {
               const element_Delete_In_DOM = e.target.parentElement.parentElement.parentElement
               const id_Delete_Product_In_Cart = e.target.dataset.id
               data_Cart.update_Quantity_Cart(parseInt(id_Delete_Product_In_Cart), true)
               return cart_Ui.handle_Delete_Element_In_DOM(element_Delete_In_DOM)
            }

            const id = Number(e.target.nextElementSibling.dataset.id)
            acu = Number(e.target.nextElementSibling.value) - 1

            if (acu === 1) {
               console.log()
               replace_Minus_Symbol_For_Trash_Basket(elements, true)
            }

            e.target.nextElementSibling.value = String(acu)

            return data_Cart.update_Quantity_Cart(parseInt(id), true)
         })

      })


      /* This code block is adding event listeners to a set of elements with the class `add`. When one of
      these elements is clicked, it retrieves the `id` of the product associated with the clicked element
      from the `data-id` attribute of the previous sibling element. It then increments the quantity value
      of the input element that is the previous sibling of the clicked element, and updates the cart with
      the new quantity value using the `data_Cart.update_Quantity_Cart` method. If the quantity value is
      2, it replaces the minus symbol with a trash basket icon using the `replace_Minus_Symbol_For_Trash_Basket`
      function. Finally, it returns the updated cart data. */

      add.forEach(elements => {

         elements.addEventListener('click', (e) => {
            const id = Number(e.target.previousElementSibling.dataset.id)
            acu = Number(e.target.previousElementSibling.value) + 1
            if (acu === 2) {
               this.elementDom = e.target.previousElementSibling.previousElementSibling
               replace_Minus_Symbol_For_Trash_Basket(elements, false)
            }
            e.target.previousElementSibling.value = String(acu)
            return data_Cart.update_Quantity_Cart(parseInt(id), false)
         })

      })

   }

}

const controller_Cart_Instance = new Control_cart()
controller_Cart_Instance.add_Cart_Listener()

/* separar la asignacion de la rederizacion */







//----------------------------------------------------------------

class Control_Routes {
   //reception hash to routers
   reception_Hash = (hash = '') => {
      console.log(hash);
      const name_Hash = {
         "#individual_product": 'individual_product',
         "#home": 'home',
         "#section_cart": 'cart',
         "#_categories": 'categories',
         "#favorites_section": 'favorites'

      }
      //send hash to controller
      return handler_View.handler_Display_(name_Hash[ hash ]);
   }

}

const instance_Control_Routes = new Control_Routes()




//----------------------------------------------------------------




export {
   instance_Control_Routes,
   Control_View_Information_At_DOM,
   Control_Favorites,
   Control_cart,
}
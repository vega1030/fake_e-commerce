'use strict'

import { get_All_Products, get_Categories, get_View_Products_For_Category, get_Single_Product } from './api.js'
import { Drive_Data_Cart, Call_Api_LocalStorage } from './model.js';
import {
   Category_ui, products_Instance, Handler_Displays_Ui, View_Favorites, View_cart, replace_Minus_Symbol_For_Trash_Basket, render_Total_And_Pay,
} from "./view.js";

const handler_View = new Handler_Displays_Ui()
/* const handler_Cart_Model = new Drive_Data_Cart()
 */const categories_UI = new Category_ui()
const api_LocalStorage = new Call_Api_LocalStorage()
const cart_Ui = new View_cart()


//----------------------------------------------------------------

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

   listener_Category() {
      const listener_category = document.querySelectorAll('.listener_category')
      listener_category.forEach(i => i.addEventListener('click', (e) => {
         console.log(e.target.href)
         return this.send_Category(e.target.id)
      })
      )
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
const handler_Init_Page = new Control_View_Information_At_DOM()
await handler_Init_Page.controller_get_All_Products()
await handler_Init_Page.control_View_Categories()
handler_Init_Page.listener_Category()
//-----------------------------------------------------------------------------//

class Control_cart {

   constructor(total = 0, elementDom) {
      this.cart
      this.elementDom = elementDom
      this.single_Product = null
      this.id = null;
      this.model = new Drive_Data_Cart()
      this.get_Cart_Data_LocalStorage()
   }


   controller_Cart(cart) {
      return this.quantity_In_Cart(cart);

   };


   get_Cart_Data_LocalStorage = () => {
      this.model.send_Cart_LocalStorage()

      return this.model.send_Cart_LocalStorage()
   }

   send_Id_To_Api = async (id) => {
      if (id) {

         const result = await get_Single_Product(id);
         this.single_Product = result;
         this.model.create_A_New_Array_Of_Object(this.single_Product);
         return (this.controller_Cart(this.model.responseCart),
            cart_Ui.model_UiCart_List(this.model.responseCart))
      };
      return console.error('the id not exist');
   };

   add_Cart_Listener = () => {
      const btns_Cart = document.querySelectorAll('.btn_add_to_cart')
      btns_Cart.forEach(item => item.addEventListener('click', (e) => {
         const id = Number(e.target.id);
         return this.send_Id_To_Api(id);;
      }))
   }



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

   quantity_In_Cart = (data) => {
      render_Total_And_Pay(data)

      if (!data) {
         return console.warn('cart is empty')
      }
      const acu = data === undefined ? 0 : data.reduce((previous, current) => {
         return previous + current.quantity
      }, 0)

      return cart_Ui.createCartCont(acu)
   }




   /* This is a method in the `Control_cart` class that adds a click event listener to the `#section_cart`
   element in the DOM. When the element is clicked, it checks the value of the `flag` parameter. If
   `flag` is `false`, it calls the `model_UiCart_List` method from the `cart_Ui` module, passing in the
   cart data retrieved from the local storage using the `api_LocalStorage.get_Cart()` method. If `flag`
   is not `false`, it calls the `model_UiCart_List` method from the `cart_Ui` module, passing in the
   cart data stored in the `responseCart` property of the `Control_cart` instance. The purpose of this
   method is to update the cart UI with the latest cart data when the `#section_cart` element is
   clicked. */

   /* ------------------------------------ */





   /* The `cart_Quantity` method is a function that takes in two parameters `minus` and `add`, which are
   arrays of elements representing the minus and add buttons in the cart UI. The method then adds event
   listeners to these elements, so that when they are clicked, it updates the quantity of the
   corresponding product in the cart and updates the cart UI accordingly. */



   modify_Quantity = () => {
      const btn_Add_Quantity = document.querySelectorAll('.add')
      let acu = 0
      //--------------------------------------------------------------
      /* This code block is selecting all elements with the class "subtract" and adding a click event
      listener to each of them. When one of these elements is clicked, it checks if the next element
      sibling is null. If it is null, it means that the clicked element is associated with the last
      product in the cart, and the function calls the `update_Quantity_Cart` method from the `model`
      object, passing in the `id_Delete_Product_In_Cart` and `true` as arguments. It then calls the
      `handle_Delete_Element_In_DOM` function from the `cart_Ui` module, passing in the
      `element_Delete_In_DOM` as an argument to remove the corresponding product from the cart UI. If the
      next element sibling is not null, it retrieves the `id` of the product associated with the clicked
      element from the `data-id` attribute of the next element sibling. It then decrements the quantity
      value of the input element that is the next element sibling of the clicked element, and updates the
      cart with the new quantity value using the `update_Quantity_Cart` method. If the quantity value is
      1, it replaces the trash basket icon with a minus symbol */
      const btns_Subtract = document.querySelectorAll('.subtract')
      btns_Subtract.forEach(elements => {
         elements.addEventListener('click', (e) => {

            console.log(elements.nextElementSibling)

            /* The above code is checking if the next element sibling of the target element is null. If
            it is null, it retrieves the parent element of the parent element of the target element
            and assigns it to a variable. It also retrieves the ID of the product to be deleted from
            the dataset of the target element and assigns it to a variable. Then it updates the
            quantity of the product in the cart by calling a method of the model object and passing
            the ID of the product and a boolean value as arguments. After that, it calls a method of
            the controller object and passes the responseCart property of the model */

            if (e.target.nextElementSibling === null) {
               const element_Delete_In_DOM = e.target.parentElement.parentElement.parentElement
               const id_Delete_Product_In_Cart = Number(e.target.dataset.id)
               //Update quantity

               this.model.update_Quantity_Cart(id_Delete_Product_In_Cart, true)
               this.controller_Cart(this.model.responseCart)

               return cart_Ui.handle_Delete_Element_In_DOM(element_Delete_In_DOM)

            }

            const id = Number(e.target.nextElementSibling.dataset.id)
            console.log(e.target.nextElementSibling.value);
            acu = Number(e.target.nextElementSibling.value) - 1
            if (acu === 1) {
               this.elementDom = elements
               replace_Minus_Symbol_For_Trash_Basket(this.elementDom, true)
            }

            e.target.nextElementSibling.value = String(acu)
            this.confirm_Pay()
            return (this.model.update_Quantity_Cart(id, true),
               this.controller_Cart(this.model.responseCart)
            )
         })
      })


      //--------------------------------------------------------------
      /* This code block is adding event listeners to a set of elements with the class `add`. When one of
      these elements is clicked, it retrieves the `id` of the product associated with the clicked element
      from the `data-id` attribute of the previous sibling element. It then increments the quantity value
      of the input element that is the previous sibling of the clicked element, and updates the cart with
      the new quantity value using the `data_Cart.update_Quantity_Cart` method. If the quantity value is
      2, it replaces the minus symbol with a trash basket icon using the `replace_Minus_Symbol_For_Trash_Basket`
      function. Finally, it returns the updated cart data. */

      btn_Add_Quantity.forEach(elements => {
         elements.addEventListener('click', (e) => {
            this.confirm_Pay()
            const id = Number(e.target.previousElementSibling.dataset.id)
            acu = Number(e.target.previousElementSibling.value) + 1
            if (acu === 2) {
               this.elementDom = e.target.previousElementSibling.previousElementSibling
               replace_Minus_Symbol_For_Trash_Basket(this.elementDom, false)
               this.confirm_Pay()
            }
            return (
               this.model.update_Quantity_Cart(id, false),
               this.controller_Cart(this.model.responseCart),
               e.target.previousElementSibling.value = String(acu)
            )
         })

      })

   }

   confirm_Pay = () => {
      const btn_ConfirmPay = document.querySelector('#pay_confirm')
      btn_ConfirmPay.addEventListener('click', (e) => {
         alert('tu compra esta lista')
      })

   }

   //--------------------------------------------------------------
}



const controller_Cart_Instance = new Control_cart()

controller_Cart_Instance.quantity_In_Cart(controller_Cart_Instance.get_Cart_Data_LocalStorage())
controller_Cart_Instance.add_Cart_Listener()
cart_Ui.model_UiCart_List(controller_Cart_Instance.get_Cart_Data_LocalStorage())




document.querySelector('#cart').addEventListener('click', () => {
   controller_Cart_Instance.modify_Quantity()
   controller_Cart_Instance.confirm_Pay()
})



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


//----------------------------------------------------------------


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

const view_Element = document.querySelectorAll('.view_one_element')
view_Element.forEach((element) => {
    element.addEventListener('click', (e) => {
        const data_Id = Number(element.dataset.id)
        console.log(e.target.parentElement.attributes.href)
        return controller.send_Id(data_Id)

    })
})

//----------------------------------------------------------------




export {
   instance_Control_Routes,
   Control_View_Information_At_DOM,
   Control_Favorites,
   Control_cart,
}
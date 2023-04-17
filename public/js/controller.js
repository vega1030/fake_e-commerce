'use strict'

import { calls_To_API, data_Cart, handler_Data_At_LocalStorage } from "./model.js";
import { get_All_Products, get_Categories, get_View_Products_For_Category, get_Single_Product } from './api.js'
import { View_cart, Category_ui, products_Instance, Handler_Displays_Ui, Product, View_Favorites } from "./view.js";


const handler_View = new Handler_Displays_Ui()

const view_Cart = new View_cart()

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

   constructor(products = [], single_Product = [], categories) {
      this.products = products
      this.single_Product = single_Product
      this.categories = categories

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

class Control_cart {

   constructor(total = 0) {
      this.total = total
   }

   handle_Id_Cart(idElement = '', flag) {

      if (idElement === '' && flag === null) {
         console.log('error');
      }
      else {
         data_Cart.save_Data_Into_Cart(idElement)
      }
   }

   handle_Id_Cart_delete(id) {
      if (id === '') {
         console.log('error')
      }
      else {
         data_Cart.delete_Product_At_Cart(id)
      }
   }

   calculate_Total_Cart(data = 0) {
      this.total = data === 0 ? null : data.reduce((previous, current) => {
         const total = (current.price * current.quantity) + previous

         this.total = total
         view_Cart.render_Total(this.total)
      }, 0).toFixed(2)

      return Number(this.total)

   }

   handle_View_Products_At_Cart(data = '') {
      if (data === null) {
         console.log('error')
      }
      this.total = data === 0 ? null : data.reduce((previous, current) => {
         return (current.price * current.quantity) + previous
      }, 0)
      return view_Cart.model_UiCart_List(data, this.total)

   }

   control_Data_For_Cart(data) {
      const acu = data === null ? 0 : data.reduce((previous, current) => {
         return previous + current.quantity
      }, 0)
      return view_Cart.createCartCont(acu)
   }

}


//----------------------------------------------------------------

class Control_Routes {
   //reception hash to routers
   reception_Hash(hash = '') {
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
const controller_Cart = new Control_cart()
const controller = new Control_View_Information_At_DOM()
const controller_Favorites = new Control_Favorites()

await controller.controller_get_All_Products()
await controller.control_View_Categories()

export {
   instance_Control_Routes,
   controller,
   controller_Favorites,
   controller_Cart
}
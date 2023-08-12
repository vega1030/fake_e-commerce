'use strict'

import { get_All_Products, get_Categories, get_View_Products_For_Category, get_Single_Product } from './api.js'
import { keysLocalStorage } from './constants.js'
import { Drive_Data_Cart, StorageService, Handler_Favorites } from './model.js';

import {
   Category_ui, products_Instance, Handler_Displays_Ui,
   View_Favorites, View_cart, replace_Minus_Symbol_For_Trash_Basket,
   render_Total_And_Pay, Product
} from "./view.js";
const local_Storage = new StorageService()
const handler_View = new Handler_Displays_Ui()
const categories_UI = new Category_ui()
const cart_Ui = new View_cart()
const modelFavorites = new Handler_Favorites()
const productsView = new Product()


//----------------------------------------------------------------
const loadSpinner = (flag) => {
   const overlay = document.querySelector('.overlay')
   if (overlay !== null) {
      return !flag ? overlay.style.display = 'flex' : overlay.style.display = 'none'
   }
}



class Control_View_Information_At_DOM {

   constructor(products = [], categories, total) {
      this.products = products
      this.single_Product
      this.categories = categories
      this.total = total
   }

   async controller_get_All_Products() {
      //spinner
      loadSpinner(false)

      try {
         this.products = await get_All_Products()
         if (this.products.status >= 200 && this.products.status < 300) {

         }
         const res = products_Instance.create_Card(this.products)
         if (!res) {

            throw new Error('Network response was not ok')
         }
      }

      catch (error) {
         console.log(error)
      }
      finally {
         loadSpinner(true)
         document.body.style.overflow = 'auto';

      }
   }


   async control_View_Categories() {
      loadSpinner(false)

      try {

         this.categories = await get_Categories()
         return categories_UI.createDynamicCategoryNav(this.categories)

      } catch (error) {
         console.log(error)
      }
      finally {
         loadSpinner(true)
      }

   }

   listener_Category() {
      const listener_category = document.querySelectorAll('.listener_category')
      listener_category.forEach(i => i.addEventListener('click', (e) => {
         this.send_Category(e.target.dataset.category)

      })
      )
   }

   async send_Category(category = '') {

      loadSpinner(false)


      try {
         const result = await get_View_Products_For_Category(category)
         //Add Listeners
         categories_UI.displayProductsByCategory(result)
         controller_Cart_Instance.add_Cart_Listener()
         favorites.handler_Favorites()
         handler_Init_Page.handlerSingleProduct()

         /* The above code is defining a function called `searchCoincidentElements` that takes an array called
         `result` as input. The function uses the `reduce` method to iterate over the `result` array and
         compare each element's `category` property to the `category` property of each element in an array
         returned by the `get_Favorites` method of a `favoritesStorage` object. If the
         `category` properties match and the `category` property is not undefined and the `acc` array does
         not already contain an element with the same `id` property as */

         const searchCoincidentElements = result.reduce((acc, i) => {
            local_Storage.getItem(keysLocalStorage.FAVORITES).forEach(elements => {
               (i.category === elements.category &&
                  i.category !== undefined && !acc.some(el => el.id === elements.id))
                  ? acc.push(elements)
                  : null;
            });
            return acc;
         }, []);

         favorites.instance_View.display_FavoritesHeart(searchCoincidentElements)

      }
      catch (error) {
         console.error(error)
      }
      finally {
         loadSpinner(true)

      }

   }


   handlerSingleProduct = () => {
      const view_Element = document.querySelectorAll('.individual_product')
      loadSpinner(false)
      view_Element.forEach((element) => {

         element.addEventListener('click', async (e) => {

            try {
               const data_Id = Number(e.target.dataset.id)
               const res = await get_Single_Product(data_Id)
               products_Instance.uI_Individual_Card(res)

            } catch (error) {

            }
            finally {
               loadSpinner(true)

            }

         })
      })


   }

   handlerHeroImageCarrousel = async () => {
      try {
         const res = await get_All_Products()

         const id_SelectsElements = [ 3, 14, 19 ]

         const products = res.reduce((acc, i) => {
            id_SelectsElements.filter(num => {
               num === i.id ? acc.push(i) : false

            })
            return acc
         }, [])
         if (typeof localStorage !== 'undefined') {
            products_Instance.heroCarrouselImage(products);
         }
      } catch (error) {
         console.error(error);
      };
   }

}

class ControlIndividualProduct {

   constructor() {
      this.id = ''
      this.delegationContent = document.querySelector('#individual_product')

   }

   listenerAddCart() {
      this.delegationContent.addEventListener('click', async (e) => {
         this.id = e.target.dataset.id
         const result = this.id === undefined ? undefined : await controller_Cart_Instance.send_Id_To_Api(this.id)
         return result
      })


   }
   listenerFavorite() {

      this.delegationContent.addEventListener('click', async (e) => {
         const targetId = e.target.classList.value === 'pathHeart' ? e.target.dataset.id : e.target.dataset.id
         this.id = targetId
         if (this.id === undefined) {
            return this.id
         }

         favorites.id = this.id
         const res = await favorites.callingApi()
         const resList = favorites.save_And_Update_Favorites(res)
         console.log(resList);
         return resList
      })
   }
}


const controllerIndividualProduct = new ControlIndividualProduct



//----------------------------------------------------------------

class Control_Favorites {
   constructor() {
      this.favorites = []
      this.instance_View = new View_Favorites()
      this.id = ''
   }

   /* The above code is adding a click event listener to all elements with the class "favorite". When an
   element with this class is clicked, it checks if the clicked element has a class "pathHeart". If it
   does, it gets the ID of the parent element's parent element (two levels up) and assigns it to the
   "id" variable. If it doesn't have the "pathHeart" class, it gets the ID of the clicked element and
   assigns it to the "id" variable. Then, it calls a function "send_Favorite_Product_To_LocalStorage()"
   with the "id" */

   handler_Favorites() {
      const favoriteId = document.querySelectorAll('.favorite');
      favoriteId.forEach(element => {
         element.addEventListener('click', (e) => {

            const class_List = e.target.classList.value;
            this.id = class_List === 'pathHeart' ? Number(e.target.parentElement.parentElement.dataset.id) :
               Number(e.target.dataset.id);
            this.send_Favorite_Product_To_LocalStorage()
            this.callingApi()

         });

      });
   }

   /* The above code defines an asynchronous function called `send_Favorite_Product_To_LocalStorage`. When
   this function is called, it first selects an HTML element with the class "overlay" and sets its
   display property to "flex". Then, it tries to retrieve a single product using the
   `get_Single_Product` function with an ID that is passed to the function. If successful, it saves and
   updates the retrieved product in the favorites list using the
   `model_Favorites.save_And_Update_Favorites` function and returns the updated favorites list. If
   there is an error, it logs the error to the console. */

   async callingApi() {
      loadSpinner(false)


      try {
         const res = await get_Single_Product(this.id)
         return res
      }
      catch (error) {
         return error;
      }
      finally {
         loadSpinner(true)
      }

   }


   async send_Favorite_Product_To_LocalStorage() {
      const res = await this.callingApi()
      if (res === undefined) {
         return
      }
      const favorite = this.save_And_Update_Favorites(res)
      this.favorites = favorite
      this.instance_View.display_FavoritesHeart(this.favorites)
      return this.favorites
   }

   //------------------------------------------------------------------------------
   //------------------------------------------------------------------------------

   save_And_Update_Favorites = (favoriteProduct) => {
      const id = favoriteProduct.id && favoriteProduct ? favoriteProduct.id : null;
      if (typeof localStorage !== 'undefined') {
         this.favorites = local_Storage.getItem(keysLocalStorage.FAVORITES) || [];
      }
      const index = this.favorites.findIndex(i => i.id === favoriteProduct.id);

      if (index !== -1) {
         this.favorites.splice(index, 1);
      }
      else {
         this.favorites.push(favoriteProduct);
      }
      if (typeof localStorage !== 'undefined') {
         local_Storage.setItem(keysLocalStorage.FAVORITES, this.favorites);
      }
      return this.favorites;
   }

}

//-----------------------------------------------------------------------------//

//-----------------------------------------------------------------------------//

const favorites = new Control_Favorites()

class Control_cart {

   constructor(total = 0, elementDom) {
      this.cart_Model = []
      this.cart_Model = local_Storage.getItem(keysLocalStorage.CART)
      this.elementDom = elementDom
      this.single_Product = null
      this.id = null;
      this.shouldClearCart = false;
      this.model = new Drive_Data_Cart()
      this.acu = 0
   }



   clearCart() {
      this.shouldClearCart = true;
   }

   controller_Cart(cart = '') {
      if (typeof localStorage !== 'undefined') {
         this.cart_Model = cart
         cart_Ui.model_UiCart_List(this.cart_Model)
         this.model.setAndCopyLocalStorage(this.cart_Model)
         this.quantity_In_Cart(this.cart_Model)
         render_Total_And_Pay(this.cart_Model)

         return this.cart_Model
      }
      return this.cart_Model

   };

   send_Id_To_Api = async (id) => {
      loadSpinner(false)

      if (id) {

         try {
            const result = await get_Single_Product(id);
            this.single_Product = result;

            const product = {
               quantity: 1,
               ...this.single_Product
            }
            this.addProductsInCart(product)

         } catch (error) {
            console.log(error);
            console.error('the id not exist');
         }
         finally {
            loadSpinner(true)
         }
      };
   };

   addProductsInCart = (paramProduct) => {
      if (this.shouldClearCart) {
         this.cart_Model = []
         this.shouldClearCart = false
      }
      const updatedCart = [ ...this.cart_Model, paramProduct ];

      const updatedCartReduced = updatedCart.reduce((acc, e) => {
         const existingIndex = acc.findIndex((x) => e.id === x.id);

         if (existingIndex !== -1) {
            acc[ existingIndex ].quantity += e.quantity;
         } else {
            acc.push(e);
         }
         return acc;
      }, []);

      const isProductAddedOrUpdated = updatedCartReduced.some((product) => {

         const existingProduct = this.cart_Model.find((p) => p.id === product.id);

         if (!existingProduct) {
            return true;
         }
         if (existingProduct.quantity !== product.quantity) {
            return true;
         }

         return false;
      });
      const allQuantitiesAreZero = updatedCartReduced.every((product) => product.quantity === 0);
      if (isProductAddedOrUpdated || allQuantitiesAreZero) {
         this.cart_Model = updatedCartReduced;
      }

      if (typeof localStorage !== 'undefined') {

         this.controller_Cart(this.cart_Model)
      }
      this.cart_Model = updatedCartReduced;

      return { result: isProductAddedOrUpdated || allQuantitiesAreZero, cart: this.cart_Model };
   }

   add_Cart_Listener = () => {
      const btns_Cart = document.querySelectorAll('.btn_add_to_cart')
      btns_Cart.forEach(item => item.addEventListener('click', (e) => {
         const id = Number(e.target.id);
         return this.send_Id_To_Api(id);;
      }))
   }



   /* The above code is defining an event listener for the click event on an element with the ID
   "ui_Cart". When a click event occurs, the code checks the class name of the clicked element and
   calls the corresponding function in the "cartHandler" object. The "cartHandler" object contains
   functions to handle subtracting, adding, and deleting items from a shopping cart. These functions
   update the quantity of items in the cart and call the "modify_Quantity" function. */

   assign_Events_Products = () => {

      const sectionCart = document.querySelector('#section_cart')

      const cart = document.querySelector('#ui_Cart');

      const listenerTarget = () => cart.addEventListener('click', (event) => {
         const target = event.target

         const cartHandler = {

            subtract: (target) => {
               this.modify_Quantity();
               console.log('subtract: ', target);
               const id = target.getAttribute('data-id');
               const input = target.nextElementSibling;
               const count = parseInt(input.value, 10);
               const newCount = Math.max(count - 1, 0);
               input.value = newCount;
            },

            add: (target) => {
               this.modify_Quantity();
               console.log(target);
               const id = target.getAttribute('data-id');
               const input = target.previousElementSibling;
               const count = parseInt(input.value, 10);
               const newCount = Math.min(count + 1, 10);
               input.value = newCount;
            },

            trash_count: (target) => {
               this.modify_Quantity();
               const id = target.getAttribute('data-id');
            },

         };
         //recibe el classlist de target
         for (const className of target.classList) {
            console.log(className);
            if (className in cartHandler) {
               //pasa la class a cartHandler()
               cartHandler[ className ](target);
               break;
            }
         }
      }

      );

      sectionCart.addEventListener('click', listenerTarget())
   }

   confirm_Pay = () => {

      alert('alert');

   }


   assign_Event_Btn_Pay = () => {
      const payEvent = document.querySelector('#view_section_cart')
      payEvent.addEventListener('click', (event) => {
         const target = event.target
         if (target.classList.contains('btn_confirm_buy')) {
            this.confirm_Pay()
         }
      })
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
      if (!data) {
         return 0
      }
      const acu = data === undefined ? 0 : data.reduce((previous, current) => {
         return current.quantity === undefined ? previous : previous + current.quantity

      }, 0)
      cart_Ui.createCartCont(acu)
      return acu
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

   modify_Quantity = () => {

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


      const btn_Add_Quantity = document.querySelectorAll('.add')
      const btns_Subtract = document.querySelectorAll('.subtract')
      btns_Subtract.forEach(elements => {
         elements.addEventListener('click', (e) => {
            console.log(false);
            if (e.target.nextElementSibling === null) {
               console.log(true);
               const element_Delete_In_DOM = e.target.parentElement.parentElement.parentElement
               const id_Delete_Product_In_Cart = Number(e.target.dataset.id)
               //Update quantity

               this.update_Quantity_Cart(id_Delete_Product_In_Cart, true)
               this.controller_Cart(this.model.responseCart)
               const controller = this.controller_Cart(this.model.responseCart)
               console.log(controller);
               return cart_Ui.handle_Delete_Element_In_DOM(element_Delete_In_DOM)

            }

            const id = Number(e.target.nextElementSibling.dataset.id)
            this.acu = Number(e.target.nextElementSibling.value) - 1
            console.log(this.acu);
            if (this.acu === 1) {
               this.elementDom = elements
               replace_Minus_Symbol_For_Trash_Basket(this.elementDom, true)
            }

            e.target.nextElementSibling.value = String(this.acu)

            return (this.update_Quantity_Cart(id, true),
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
            const id = Number(e.target.previousElementSibling.dataset.id)
            this.acu = Number(e.target.previousElementSibling.value) + 1
            console.log('acu add: ', this.acu);
            if (this.acu === 2) {
               this.elementDom = e.target.previousElementSibling.previousElementSibling
               replace_Minus_Symbol_For_Trash_Basket(this.elementDom, false)
            }
            this.update_Quantity_Cart(id, false),
               this.controller_Cart(this.model.responseCart),
               e.target.previousElementSibling.value = String(this.acu)
            return

         })

      })

   }

   update_Quantity_Cart = (id = "", flag) => {
      if (flag === true) {
         console.log('update: ', flag);
         const updateCart_Minus = this.cart_Model.map
            (i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
         this.cart_Model = updateCart_Minus
         this.model.setAndCopyLocalStorage(this.cart_Model)
         return this.cart_Model
      }
      const updateCart_Add = this.cart_Model.map
         (i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i).filter(i => i.quantity > 0);
      this.cart_Model = updateCart_Add
      this.model.setAndCopyLocalStorage(this.cart_Model)
      return this.cart_Model
   }

}

const handler_Init_Page = new Control_View_Information_At_DOM()
const controller_Cart_Instance = new Control_cart()

//--------------------------------------------------------------
if (typeof localStorage !== 'undefined') {
   await handler_Init_Page.controller_get_All_Products()
   await handler_Init_Page.control_View_Categories()
   controller_Cart_Instance.add_Cart_Listener(),
      controller_Cart_Instance.assign_Events_Products(),
      handler_Init_Page.handlerSingleProduct(),
      handler_Init_Page.listener_Category(),
      controller_Cart_Instance.assign_Event_Btn_Pay(),
      favorites.handler_Favorites(),
      favorites.send_Favorite_Product_To_LocalStorage(),
      favorites.instance_View.display_FavoritesHeart(local_Storage.getItem(keysLocalStorage.FAVORITES)),
      controller_Cart_Instance.controller_Cart(local_Storage.getItem(keysLocalStorage.CART))
   handler_Init_Page.handlerHeroImageCarrousel()
   controllerIndividualProduct.listenerAddCart()
   controllerIndividualProduct.listenerFavorite()
}
//----------------------------------------------------------------


class Control_Routes {
   //reception hash to routers
   reception_Hash = (hash = '') => {
      const name_Hash = {
         "#individual_product": 'individual_product',
         "#home": 'home',
         "#view_section_cart": 'cart',
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
   loadSpinner
}
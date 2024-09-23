import { assert, expect } from 'chai';
import { LocalStorage } from 'node-localstorage';
import { createRequire } from 'module';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { it, describe } from 'mocha';
import { storageMock } from './storageMock.js';
import { Drive_Data_Cart } from '../public/src/model/classes/Cart/Drive_Data_Cart.js';
import { AddProducts } from '../public/src/controller/classes/Cart/AddProducts.js';
import { keysLocalStorage } from '../public/src/constants.js';
import { Drive_Data_Favorites } from '../public/src/model/classes/Favorites/Drive_Data_Favorites.js';


const require = createRequire(import.meta.url)

const testLocalStorage = new LocalStorage('./scratch');
const consoleWarnStub = sinon.stub(console, 'warn');
afterEach(() => {
  consoleWarnStub.resetHistory();
});

const { document } = new JSDOM('<html><body></body></html>').window;
globalThis.document = document;
globalThis.window = document.defaultView;



describe('----Method quantity_In_Cart----', () => {


  it('should return 0 if data is not provided', () => {
    const testCart = new AddProducts()

    //Arrange
    const data = undefined
    //Act

    const result = testCart.quantity_In_Cart(data)
    //Assert
    expect(result).to.equal(0)
  })
  it('should calculate the total quantity and update localStorage', () => {
    const testCart = new AddProducts()

    // Arrange
    const data = [
      { quantity: 2 },
      { quantity: 3 },
      { quantity: 1 },
    ];
    const expectedTotal = 6;

    // Act
    const result = testCart.quantity_In_Cart(data);
    // Assert
    expect(result).to.equal(expectedTotal);
    testLocalStorage.setItem('result', result)

    expect(testLocalStorage.getItem('result')).to.equal('6')

    // Add any additional assertions based on your implementation
  })
  it('should calculate the total quantity with one quantity is undefined and update localStorage', () => {
    const testCart = new AddProducts()

    // Arrange
    const data = [
      { quantity: 2 },
      { quantity: 15 },
      { quantity: 2 },
      { quantity: 10 },
      { quantity: 3 },
      { quantity: undefined },
    ];
    const expectedTotal = 32;

    // Act
    const result = testCart.quantity_In_Cart(data);
    // Assert
    expect(result).to.equal(expectedTotal);
    testLocalStorage.setItem('result', result)
    expect(testLocalStorage.getItem('result')).to.equal('32')

    // Add any additional assertions based on your implementation
  })

})

describe('----Method addProductsInCart----', () => {

  let storage

  beforeEach(() => {
    storage = storageMock()
  })

  it('should add a product to the cart', () => {
    const testCart = new AddProducts()

    testLocalStorage.clear()
    storage.removeItem(keysLocalStorage.CART)

    const paramProduct = { id: 1, quantity: 2 };
    const result = testCart.addProductsInCart(paramProduct);

    /* SAVE ITEMS IN node-localStorage and mock-localStorage */
    testLocalStorage.setItem(keysLocalStorage.CART, JSON.stringify(result.cart))
    storage.setItem(keysLocalStorage.CART, JSON.stringify(result.cart))
    /* ---------------------------------------------------- */
    //new id into the cart
    expect(result.result).to.be.true;
    expect(testLocalStorage.getItem(keysLocalStorage.CART)).to.deep.equal(JSON.stringify([ { id: 1, quantity: 2 } ]));

    /* Clean storage */
    testLocalStorage.clear()
    /* ----------- */

  });


  it('should update cart with a different id', () => {
    const testCart = new AddProducts()

    /* Clean storage */
    storage.removeItem(keysLocalStorage.CART)
    /* ----------- */

    const productId_2 = { id: 2, quantity: 1 }
    const productId3 = { id: 9, quantity: 1 }

    const res2 = testCart.addProductsInCart(productId_2)
    const res3 = testCart.addProductsInCart(productId3)

    /* Saving data */
    testLocalStorage.setItem(keysLocalStorage.CART, JSON.stringify(res3.cart))
    storage.setItem(keysLocalStorage.CART, res3.cart)
    /* ----------- */

    expect(testLocalStorage.getItem(keysLocalStorage.CART)).
      to.deep.equal(JSON.stringify([
        { id: 2, quantity: 1 },
        { id: 9, quantity: 1 }
      ]))
    // new id into the cart
    expect(res3.result).to.be.true;

    testLocalStorage.clear()
  })


  it('should update the quantity of an existing product in the cart', () => {
    const testCart = new AddProducts()
    const existingProduct = { id: 6, quantity: 1 };
    const paramProduct = { id: 6, quantity: 2 };
    const paramProduct2 = { id: 6, quantity: 3 };

    const finalRes = testCart.addProductsInCart(existingProduct);
    const res = testCart.addProductsInCart(paramProduct);
    const res1 = testCart.addProductsInCart(paramProduct2);
    testLocalStorage.setItem(keysLocalStorage.CART, JSON.stringify(res1.cart));
    expect(testLocalStorage.getItem(keysLocalStorage.CART)).to.deep.equal(JSON.stringify([ { id: 6, quantity: 6 } ]));

    //new id into the cart
    expect(res1.result).to.be.false;

  });



  it('should not update the cart if product quantity is 0', () => {
    const testCart = new AddProducts()
    const existingProduct = { id: 1, quantity: 1 };
    const paramProduct = { id: 1, quantity: 0 };

    const result = testCart.addProductsInCart(existingProduct);
    const finalResult = testCart.addProductsInCart(paramProduct);
    testLocalStorage.setItem(keysLocalStorage.CART, JSON.stringify(finalResult.cart));
    expect(testLocalStorage.getItem(keysLocalStorage.CART)).to.deep.equal(JSON.stringify([ { id: 1, quantity: 1 } ]));
    //new id into the cart    
    expect(finalResult.result).to.be.false;
    testLocalStorage.clear()

  });


})

describe('merge arrays Drive Data Cart', () => {
  it('merged the arrays. The array of localStorage and the array of RealTime ', () => {
    const testDataCart = new Drive_Data_Cart();

    // Definir los datos de prueba
    const cartFromDB = [
      { id: 1, quantity: 10 },
      { id: 6, quantity: 1 },
      { id: 4, quantity: 2 },
      { id: 8, quantity: 1 },
      { id: 10, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 5, quantity: 3 },
      { id: 9, quantity: 3 }
    ];

    const cartFromLocalStorage = [
      { id: 9, quantity: 3 },
      { id: 1, quantity: 5 },
      { id: 2, quantity: 2 },
      { id: 4, quantity: 10 },
      { id: 10, quantity: 3 },

    ];

    const finalArray = [
      { id: 1, quantity: 10 },
      { id: 6, quantity: 1 },
      { id: 4, quantity: 10 },
      { id: 8, quantity: 1 },
      { id: 10, quantity: 4 },
      { id: 2, quantity: 4 },
      { id: 5, quantity: 3 },
      { id: 9, quantity: 6 }
    ]
    const result = testDataCart.mergeCart(cartFromDB, cartFromLocalStorage);
    console.log('result ', result);
    // Assert
    expect(result).to.deep.equal(finalArray);
  });
  it('merged the arrays. The array of localStorage and the array of RealTime with an undefined and null element', () => {
    const cartFromDB = [
      { id: 1, quantity: 10 },
      { id: 6, quantity: 1 },
      { id: 4, quantity: 2 },
      { id: 8, quantity: 1 },
      { id: 10, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 5, quantity: 3 },
      { id: 9, quantity: 3 },
      undefined
    ];

    const cartFromLocalStorage = [
      { id: 9, quantity: 3 },
      { id: 1, quantity: 5 },
      { id: 2, quantity: 2 },
      { id: 4, quantity: 10 },
      { id: 10, quantity: 3 },
      null
    ];

    const finalArray = [
      { id: 1, quantity: 10 },
      { id: 6, quantity: 1 },
      { id: 4, quantity: 10 },
      { id: 8, quantity: 1 },
      { id: 10, quantity: 4 },
      { id: 2, quantity: 4 },
      { id: 5, quantity: 3 },
      { id: 9, quantity: 6 }
    ]

  });

});


describe('----Method save_And_Update_Favorites----', () => {

  it('should create favorite list', () => {


    const testFavorites = new Drive_Data_Favorites()

    const product1 = {
      id: 4,
      name: 'Producto 4',
      price: 100,
      img: 'img/product4.jpg',
      description: 'Descripción del producto 4',
      quantity: 1
    }

    const product2 = {
      id: 2,
      name: 'Producto 2',
      price: 300,
      img: 'img/product2.jpg',
      description: 'Descripción del producto 2',
      quantity: 1
    }

    const product3 = {
      id: 3,
      name: 'Producto 3',
      price: 400,
      img: 'img/product3.jpg',
      description: 'Descripción del producto 3',
      quantity: 1
    }

    const resFavorites =
      [
        {
          id: 4,
          name: 'Producto 4',
          price: 100,
          img: 'img/product4.jpg',
          description: 'Descripción del producto 4',
          quantity: 1
        },
        {
          id: 2,
          name: 'Producto 2',
          price: 300,
          img: 'img/product2.jpg',
          description: 'Descripción del producto 2',
          quantity: 1
        },
        {
          id: 3,
          name: 'Producto 3',
          price: 400,
          img: 'img/product3.jpg',
          description: 'Descripción del producto 3',
          quantity: 1
        }
      ]


    const result = testFavorites.save_And_Update_Favorites(product1)
    const result2 = testFavorites.save_And_Update_Favorites(product2)
    const result3 = testFavorites.save_And_Update_Favorites(product3)
    testLocalStorage.setItem(keysLocalStorage.FAVORITES, JSON.stringify(result3))
    expect(testLocalStorage.getItem(keysLocalStorage.FAVORITES)).to.deep.equal(JSON.stringify(resFavorites));


    testLocalStorage.clear()


  });

  it('should dislike one favorite product', () => {

    const testFavorites = new Drive_Data_Favorites()

    const product1 = {
      id: 4,
      name: 'Producto 4',
      price: 100,
      img: 'img/product4.jpg',
      description: 'Descripción del producto 4',
      quantity: 1
    }

    const product2 = {
      id: 2,
      name: 'Producto 2',
      price: 300,
      img: 'img/product2.jpg',
      description: 'Descripción del producto 2',
      quantity: 1
    }

    const product3 = {
      id: 3,
      name: 'Producto 3',
      price: 400,
      img: 'img/product3.jpg',
      description: 'Descripción del producto 3',
      quantity: 1
    }

    const newResFavorites =
      [
        {
          id: 2,
          name: 'Producto 2',
          price: 300,
          img: 'img/product2.jpg',
          description: 'Descripción del producto 2',
          quantity: 1
        },
        {
          id: 3,
          name: 'Producto 3',
          price: 400,
          img: 'img/product3.jpg',
          description: 'Descripción del producto 3',
          quantity: 1
        }
      ]


    const result2 = testFavorites.save_And_Update_Favorites(product2)
    const result3 = testFavorites.save_And_Update_Favorites(product3)
    const result = testFavorites.save_And_Update_Favorites(product1)
    const final_result = testFavorites.save_And_Update_Favorites(product1)

    testLocalStorage.setItem(keysLocalStorage.FAVORITES, JSON.stringify(final_result))
    expect(testLocalStorage.getItem(keysLocalStorage.FAVORITES)).to.deep.equal(JSON.stringify(newResFavorites));




  });
})
//-------------------------//


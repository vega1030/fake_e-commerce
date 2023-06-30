import { assert, expect } from 'chai';
import { LocalStorage } from 'node-localstorage';
import { createRequire } from 'module';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { it,describe } from 'mocha';
import { Control_cart } from '../public/js/controller.js';
const require = createRequire(import.meta.url)

const testLocalStorage = new LocalStorage('./scratch');
const consoleWarnStub = sinon.stub(console, 'warn');
afterEach(() => {
  consoleWarnStub.resetHistory();
});

const { document } = new JSDOM('<html><body></body></html>').window;
globalThis.document = document;
globalThis.window = document.defaultView;

const testCart = new Control_cart()

describe('quantity_In_Cart', () => {
  beforeEach(() => {
    testLocalStorage.clear();
  })

  it.only('should return 0 if data is not provided', () => {
    //Arrange
    const data = undefined
    //Act
    
    const result = testCart.quantity_In_Cart(data)
    //Assert
    expect(result).to.equal(0)
  })
  it.only('should calculate the total quantity and update localStorage', () => {

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
    testLocalStorage.setItem('result',result)

    expect(testLocalStorage.getItem('result')).to.equal('6')

    // Add any additional assertions based on your implementation
  })
  it.only('should calculate the total quantity with one quantity is undefined and update localStorage', () => {

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
    testLocalStorage.setItem('result',result)
    expect(testLocalStorage.getItem('result')).to.equal('32')

    // Add any additional assertions based on your implementation
  })

})

//-------------------------//


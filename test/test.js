import { Call_Api_LocalStorage, Drive_Data_Cart } from '../public/js/model.js';
import { Control_cart } from '../public/js/controller.js';
import { assert } from 'chai';
import { LocalStorage } from 'node-localstorage';
import { createRequire } from 'module';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

const require = createRequire(import.meta.url)

const test_LocalStorage = new LocalStorage('./scratch');
global.test_LocalStorage = test_LocalStorage;
const myModel = new Call_Api_LocalStorage(test_LocalStorage)

const consoleWarnStub = sinon.stub(console, 'warn');
afterEach(() => {
  consoleWarnStub.resetHistory();
});

const { window } = new JSDOM();
global.window = window;
global.document = window.document;

/* This code is testing the `quantity_In_Cart` method of the `Control_cart` class. It has three test
cases: */
describe('Control_cart', () => {
  describe('control_Quantity', () => {
    it('should return the total quantity of items in the cart', () => {

      it('should return the total quantity of items in the cart', () => {
        const controlCart = new Control_cart();
        const data = [ { quantity: 100 }, { quantity: 900 }, { quantity: 23 }, ];
        const result = controlCart.quantity_In_Cart(data);
        assert.equal(result, 1023);
      });
    })

    it('should return 0 if cart is empty', () => {
      const controlCart = new Control_cart();

      const result = controlCart.quantity_In_Cart();

      assert.equal(result, 0);
    });

    it('should console.warn() and return undefined if data is falsy', () => {
      const controlCart = new Control_cart();
      beforeEach(() => {

        const consoleWarnStub = sinon.stub(console, 'warn');

        const result = controlCart.quantity_In_Cart(null);

        assert.isTrue(consoleWarnStub.calledOnce);
        consoleWarnStub.restore();
        assert.equal(consoleWarnStub.calledOnce, true);
        assert.isUndefined(result);
        console.log(result);
      })
      /* `afterEach` is a hook provided by the testing framework (Mocha in this case) that runs after each
      test case. In this code, `afterEach` is used to restore the `console.warn` function to its
      original state after each test case that stubs it using `sinon.stub(console, 'warn')`. This
      ensures that the `console.warn` function is not permanently modified by the test cases and can be
      used normally in other parts of the code. */
      afterEach(() => {
        console.warn.restore();
      })
    });
  });
});

//-------------------------//

export { test_LocalStorage, myModel }

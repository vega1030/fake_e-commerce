import { assert } from 'chai';
import { Control_cart } from '../public/js/controller.js';

describe('Control_cart', () => {
  describe('control_Quantity', () => {
    it('should return the total quantity of items in the cart', () => {
      const controlCart = new Control_cart();

      // Supongamos que esta es la data que pasaremos al método control_Quantity
      const data = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
        { id: 3, quantity: 4 },
      ];

      // Llamamos al método control_Quantity con la data de prueba
      const result = controlCart.quantity_In_Cart(data);

      // Comprobamos que el resultado sea el esperado
      assert.equal(result, 7);
    });

    it('should return 0 if cart is empty', () => {
      const controlCart = new Control_cart();

      // Llamamos al método control_Quantity sin pasar data
      const result = controlCart.quantity_In_Cart();

      // Comprobamos que el resultado sea 0
      assert.equal(result, 0);
    });

    it('should console.warn() and return undefined if data is falsy', () => {
      const controlCart = new Control_cart();

      // Llamamos al método control_Quantity con data falsy
      const result = controlCart.quantity_In_Cart(null);

      // Comprobamos que el método haya llamado a console.warn()
      assert.equal(console.warn.calledOnce, true);

      // Comprobamos que el resultado sea undefined
      assert.isUndefined(result);
    });
  });
});

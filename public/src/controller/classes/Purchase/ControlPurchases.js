/* import { ModelPurchases } from '../../../../../test/Purchases/modelPurchases.js';
import { Auth } from '../../../services/auth.js';
import { RealTimeDB } from '../../../services/realtimedatabase.js';


export class ControlPurchases {

    constructor() {
        this.modelPurchases = new ModelPurchases();
        this.auth = new Auth();
        this.realtimeDb = new RealTimeDB();
    }


    returnPurchasesFirebase() {
        console.log(this.auth);
        this.realtimeDb.returnPurchaseRealTimeDb(this.auth);
    }
    //create a method to return purchase and displaying in view
    returnPurchases() {
        this.realtimeDb.returnPurchaseRealTimeDb(this.auth)
    }

}
 */
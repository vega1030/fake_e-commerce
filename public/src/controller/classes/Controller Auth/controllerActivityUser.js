
export class controllerActivityUser {

    //create a new controller to handle the user activity with setTimeOut to close session, Display the result with console.log
    constructor() {
        this.timeOut = 0
    }

    closeSession() {


        this.timeOut = setTimeout(() => {
            console.log('Session closed')
        }, 10000);
    }
    stopSession() {
        clearTimeout(this.timeOut)
        console.log('Session stopped')
    }

}
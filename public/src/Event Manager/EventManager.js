'use strict'

//create a new class to handle the event manager
export class EventManager {

    constructor() {
        this.events = {}
    }


    addListener(event, selector, callback) {
        if (!this.events[ event ]) {
            this.events[ event ] = []
        }
        this.events[ event ].push({ selector, callback })

        const elements = selector.startsWith('#') ? [document.getElementById(selector.slice(1))] : document.querySelectorAll(selector);
        if (elements.length===1 && elements[0]===null) return 
        elements.forEach(element=>{
            element.addEventListener(event,callback)
        })
    }

    //create a new method to remove an event listener
    removeListener(event, callback) {
        if (!this.events[ event ]) {
            return
        }
        this.events[ event ] = this.events[ event ].filter(cb => cb !== callback)
    }

    //create a new method to trigger an event
    triggerEvent(event) {
        const listeners = this.events[ event ] || [];
        listeners.forEach(({ querySelector, callback }) => {
            const elements = document.querySelectorAll(querySelector);
            elements.forEach(element => {
                element.addEventListener(event, callback);
            });
        });
    }
}

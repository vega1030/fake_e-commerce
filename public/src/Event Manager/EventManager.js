'use strict'

//create a new class to handle the event manager
export class EventManager {

    constructor() {
        this.events = {}
    }

/**
 * The `addListener` function adds event listeners to specified elements based on the event type and
 * selector provided.
 * @param event - The `event` parameter represents the type of event that the listener will be
 * listening for, such as "click", "mouseover", "keydown", etc.
 * @param selector - The `selector` parameter in the `addListener` method is a string that represents a
 * CSS selector used to target one or more elements in the DOM to which the event listener will be
 * attached. It can be an element ID (prefixed with `#`) or a class name, tag name, or
 * @param callback - The `callback` parameter in the `addListener` method is a function that will be
 * executed when the specified event occurs on the selected elements. It is the action or behavior that
 * you want to associate with the event.
 * @returns If the `elements` array contains only one element and that element is `null`, the function
 * will return without adding an event listener.
 */

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

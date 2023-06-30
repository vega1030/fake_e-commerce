function localStorageMock() {
    let storage = {}

    return {
        setItem: function (key, value) {
            storage[ key ] = value || '';
        },
        getItem: function (key) {
            return key in storage ? storage[ key ] : null
        },
        removeItem: function (key) {
            delete storage[ key ]
        },
        clear() {
            storage = {};
        },
    };
}
export{localStorageMock}
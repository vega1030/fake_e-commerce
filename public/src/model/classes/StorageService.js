'use strict'

export class StorageService {
    setItem(key, value) {
        const setValue = JSON.stringify(value)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, setValue);
        }
    }

    getItem(key) {
        if (typeof localStorage !== 'undefined') {
            const value = JSON.parse(localStorage.getItem(key)) || []
            return value
        }
        return []
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }
}


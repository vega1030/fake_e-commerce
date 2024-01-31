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

    sessionStorageUid(key, value) {
        sessionStorage.setItem(key, value)
    }

    getSessionStorageUid(key) {
        return sessionStorage.getItem(key)
    }
    sessionStorageToken(key,value){
        sessionStorage.setItem(key,value)
    }
    getSessionStorageToken(key){
        return sessionStorage.getItem(key)
    }
}


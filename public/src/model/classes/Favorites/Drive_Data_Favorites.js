'use strict'
import { StorageService } from "../storage/StorageService.js"
import { keysLocalStorage } from "../../../constants.js"


export class Drive_Data_Favorites {

    constructor() {
        this.favorites = []
        this.storageService = new StorageService()
        this.favorites = this.storageService.getItem(keysLocalStorage.FAVORITES)|| []
    }

     save_And_Update_Favorites(favoriteProduct) {
        const index = this.favorites.findIndex(i => i.id === favoriteProduct.id);

        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.storageService.setItem(keysLocalStorage.FAVORITES, this.favorites)
            return this.favorites
        }

        else {
            this.favorites.push(favoriteProduct);
            this.storageService.setItem(keysLocalStorage.FAVORITES, this.favorites)
            return this.favorites
        }
    }

    mergeFavorites(favoritesFromDB, favoritesFromLocalStorage) {
        const mergedFavorites = {};

        const mergeArray = (array) => {
            if (!array) return;

            array.forEach(product => {
                const productId = product.id;
                mergedFavorites[ productId ] = { ...product };
            });
        };

        mergeArray(favoritesFromDB);
        mergeArray(Object.values(favoritesFromLocalStorage));
        const resultArray = Object.values(mergedFavorites);
        this.favorites = resultArray;
        return resultArray;
    }
}
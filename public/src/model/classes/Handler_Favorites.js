'use strict'

import { StorageService } from "../classes/StorageService.js"
import { keysLocalStorage } from "../../constants.js"

export class Handler_Favorites {
    constructor() {
        this.favoritesStorage = new StorageService()
        this.favorites

    }

    async save_And_Update_Favorites(favoriteProduct) {
        console.log(favoriteProduct)
        this.favorites = this.favoritesStorage.getItem(keysLocalStorage.FAVORITES) || []
        const index = this.favorites.findIndex(i => i.id === favoriteProduct.id);

        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.favoritesStorage.setItem(keysLocalStorage.FAVORITES, this.favorites)
            return this.favorites
        }

        else {
            this.favorites.push(favoriteProduct);
            this.favoritesStorage.setItem(keysLocalStorage.FAVORITES, this.favorites)
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
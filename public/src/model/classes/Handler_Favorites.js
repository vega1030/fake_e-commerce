'use strict'

export class Handler_Favorites {
    constructor() {
        this.favorites = []
    }


    saveFavorites(favorite){
        this.favorites = favorite
    }

    sendFavorites(){
        return this.favorites
    }

}
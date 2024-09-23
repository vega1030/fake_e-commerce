'use strict'


const keysLocalStorage = {
    FAVORITES: 'favorites',
    CART: 'cart',
}

const keySessionStorage = {
    UID: 'uid',
    TOKEN: 'token',
    PROFILE_PHOTO: 'profile_photo',
    USER_NAME: 'user_name',

}

const URL_API = {
    ALL_PRODUCTS: 'https://fakestoreapi.com/products',
    GET_CATEGORIES: 'https://fakestoreapi.com/products/categories',
    GET_PRODUCTS_BY_CATEGORY: (category) => `https://fakestoreapi.com/products/category/${ category }`,
    GET_PRODUCT: (id) => `https://fakestoreapi.com/products/${ Number(id) }`
}

const sections = {
    FAVORITES: 'Your favorites',
    CART: 'Your cart',
    ALL_PRODUCTS: 'All products',
}

export { keysLocalStorage, URL_API, sections, keySessionStorage }
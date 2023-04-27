'use strict'

/**
 * This function retrieves all products from a fake store API using async/await and returns the result
 * as a JSON object.
 * @returns The function `get_All_Products` is returning a Promise that resolves to an array of objects
 * representing all the products from the fakestoreapi.com.
 */
const get_All_Products = async () => {
    try {

        const url_view_all_products = 'https://fakestoreapi.com/products'
        const result = await fetch(url_view_all_products)
        const res = await result.json()
        return res

    } catch (e) {
        console.log(e)
    }

}

/**
 * This function retrieves a list of categories from a fake store API using asynchronous JavaScript.
 * @returns The function `get_Categories` is returning a promise that resolves to an array of strings
 * representing the categories of products available on the fakestoreapi.com website.
 */
const get_Categories = async () => {
    try {
        const url_view_all_categories = 'https://fakestoreapi.com/products/categories'
        const result = await fetch(url_view_all_categories)
        const res = await result.json()
        return res
    }
    catch (error) {
        console.log(error);
    }
}
/**
 * This function retrieves a list of products from the fakestoreapi.com based on a specified category.
 * @param category - The category parameter is a string that represents the category of products that
 * we want to retrieve from the fakestoreapi.com. For example, if we want to retrieve all products in
 * the "electronics" category, we would pass "electronics" as the category parameter to the
 * get_View_Products_For_Category function
 * @returns a Promise that resolves to an array of product objects from the Fake Store API that belong
 * to the specified category.
 */

const get_View_Products_For_Category = async (category) => {

    const url = `https://fakestoreapi.com/products/category/${ category }`
    try {
        const result = await fetch(url)
        const res = await result.json()
        return res

    } catch (error) {
        console.log(error);
    }

}

/**
 * This is an asynchronous function that retrieves a single product from a fake store API based on the
 * provided ID.
 * @param id - The `id` parameter is a number that represents the unique identifier of a product in the
 * fakestoreapi.com database. The function `get_Single_Product` uses this parameter to construct a URL
 * and fetch the corresponding product data from the API.
 * @returns a Promise that resolves to the JSON data of a single product from the fakestoreapi.com,
 * based on the provided `id`. If the `id` is an empty string, the function logs an error message to
 * the console and does not return anything.
 */

const get_Single_Product = async (id) => {
    const url = `https://fakestoreapi.com/products/${ Number(id) }`
    try {
        if (id == '') {
            console.log('error');
        }
        else {
            const result = await fetch(url)
            const res =  await result.json()
            return res
        }

    } catch (error) {
        console.log(error);
    }
}


/* `await get_All_Products()` is calling the `get_All_Products` function, which retrieves all products
from a fake store API using async/await and returns the result as a JSON object. The `await` keyword
is used to wait for the function to complete and return a value before moving on to the next line of
code. */
await get_All_Products()


/* `await get_Categories()` is calling the `get_Categories` function, which retrieves a list of
categories from a fake store API using asynchronous JavaScript. The `await` keyword is used to wait
for the function to complete and return a value before moving on to the next line of code. */
await get_Categories()


export { get_All_Products, get_Categories, get_View_Products_For_Category, get_Single_Product }
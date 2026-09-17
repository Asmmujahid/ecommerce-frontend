import axiosInstance from "../../api/axios";

const BASE_URL = "/admin/products";

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
|
| Supported filters:
|
| search
| category
| brand
| status
| featured
| stock
| owner_type
|
*/
const getProducts = async (filters = {}) => {
    const params = Object.fromEntries(
        Object.entries(filters).filter(
            ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );

    const response = await axiosInstance.get(
        BASE_URL,
        {
            params,
        }
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/
const getProduct = async (id) => {
    const response = await axiosInstance.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/
const createProduct = async (productData) => {
    const response = await axiosInstance.post(
        BASE_URL,
        productData
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/
const updateProduct = async ({
    id,
    productData,
}) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        productData
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/
const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/
const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;

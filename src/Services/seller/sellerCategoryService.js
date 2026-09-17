import axiosInstance from "../../api/axios";

/*
|--------------------------------------------------------------------------
| Seller Category Service
|--------------------------------------------------------------------------
| Used for fetching categories while creating/editing products
|--------------------------------------------------------------------------
*/

const BASE_URL = "/seller/categories";

/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
*/

export const getSellerCategories = async () => {
    const response = await axiosInstance.get(BASE_URL);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Category
|--------------------------------------------------------------------------
*/

export const getSellerCategory = async (id) => {
    const response = await axiosInstance.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Export Service
|--------------------------------------------------------------------------
*/

const sellerCategoryService = {
    getSellerCategories,
    getSellerCategory,
};

export default sellerCategoryService;
import axiosInstance from "../../api/axios";

/*
|--------------------------------------------------------------------------
| Seller Brand Service
|--------------------------------------------------------------------------
*/

const BASE_URL = "/seller/brands";

/*
|--------------------------------------------------------------------------
| Get All Brands
|--------------------------------------------------------------------------
*/

export const getSellerBrands = async () => {
    const response = await axiosInstance.get(BASE_URL);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Brand
|--------------------------------------------------------------------------
*/

export const getSellerBrand = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);

    return response.data;
};

const sellerBrandService = {
    getSellerBrands,
    getSellerBrand,
};

export default sellerBrandService;
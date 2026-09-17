import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/brands";

// Get All Brands
const getBrands = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

// Get Single Brand
const getBrand = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

// Create Brand
const createBrand = async (brandData) => {
    const response = await axiosInstance.post(BASE_URL, brandData);
    return response.data;
};

// Update Brand
const updateBrand = async ({ id, brandData }) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        brandData
    );

    return response.data;
};

// Delete Brand
const deleteBrand = async (id) => {
    const response = await axiosInstance.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

const brandService = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
};

export default brandService;
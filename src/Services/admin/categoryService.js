import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/categories";

const getCategories = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

const getCategory = async (id) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

const createCategory = async (categoryData) => {
    const response = await axiosInstance.post(BASE_URL, categoryData);
    return response.data;
};

const updateCategory = async ({ id, categoryData }) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        categoryData
    );

    return response.data;
};

const deleteCategory = async (id) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};

const categoryService = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;
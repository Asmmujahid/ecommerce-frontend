import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/banners";

const bannerService = {
    // Get all banners
    getBanners: async () => {
        const response = await axiosInstance.get(BASE_URL);
        return response.data;
    },

    // Get single banner
    getBanner: async (id) => {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Create banner
    createBanner: async (bannerData) => {
        const response = await axiosInstance.post(BASE_URL, bannerData);
        return response.data;
    },

    // Update banner
    updateBanner: async (id, bannerData) => {
        const response = await axiosInstance.put(
            `${BASE_URL}/${id}`,
            bannerData
        );

        return response.data;
    },

    // Delete banner
    deleteBanner: async (id) => {
        const response = await axiosInstance.delete(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },
};

export default bannerService;
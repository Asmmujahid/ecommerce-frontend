import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

const BASE_URL = "/admin/reviews";

const reviewService = {
    // ===============================
    // Get All Reviews
    // ===============================
    getReviews: async () => {
        const response = await axiosInstance.get(BASE_URL);
        return response.data;
    },

    // ===============================
    // Get Single Review
    // ===============================
    getReview: async (id) => {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // ===============================
    // Update Review
    // ===============================
    updateReview: async (id, reviewData) => {
        const response = await axiosInstance.put(
            `${BASE_URL}/${id}`,
            reviewData
        );

        return response.data;
    },

    // ===============================
    // Delete Review
    // ===============================
    deleteReview: async (id) => {
        const response = await axiosInstance.delete(
            `${BASE_URL}/${id}`
        );

        return response.data;
    },
};

export default reviewService;
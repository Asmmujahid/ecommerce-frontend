import api from "../../api/axios";

const sellerReviewService = {
    /**
     * Get all reviews for seller products
     * GET /api/seller/reviews
     */
    async getReviews() {
        try {
            const response = await api.get("/seller/reviews");
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Get single review
     * GET /api/seller/reviews/{id}
     */
    async getReview(id) {
        try {
            const response = await api.get(`/seller/reviews/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default sellerReviewService;
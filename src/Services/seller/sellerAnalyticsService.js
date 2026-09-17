import api from "../../api/axios";

const sellerAnalyticsService = {
    /**
     * Get seller analytics dashboard
     * GET /api/seller/analytics
     */
    async getAnalytics() {
        try {
            const response = await api.get("/seller/analytics");

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default sellerAnalyticsService;
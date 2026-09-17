import axiosInstance from "../../api/axios";

// ==========================================
// Customer Dashboard Service
// ==========================================

const BASE_URL = "/customer/dashboard";

const dashboardService = {
    /**
     * Get customer dashboard data
     *
     * API:
     * GET /api/customer/dashboard
     *
     * Returns:
     * - customer
     * - statistics
     * - recent_orders
     * - recent_notifications
     */
    getDashboard: async () => {
        try {
            const response = await axiosInstance.get(BASE_URL);

            return response.data;
        } catch (error) {
            console.error(
                "Customer Dashboard API Error:",
                error.response?.data || error.message
            );

            throw error;
        }
    },
};

export default dashboardService;
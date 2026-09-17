import api from "../../api/axios";
import API from "../../api/endpoints";

const dashboardService = {
    /**
     * Get Admin Dashboard Statistics
     * GET /api/admin/dashboard
     */
    getDashboard() {
        return api.get(API.ADMIN_DASHBOARD);
    },
};

export default dashboardService;
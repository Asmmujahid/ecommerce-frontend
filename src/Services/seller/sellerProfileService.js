import api from "../../api/axios";

const sellerProfileService = {
    /**
     * Get seller profile
     * GET /api/seller/profile
     */
    async getProfile() {
        try {
            const response = await api.get("/seller/profile");
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update seller profile
     * PUT /api/seller/profile
     */
    async updateProfile(profileData) {
        try {
            const response = await api.put(
                "/seller/profile",
                profileData
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Change seller password
     * POST /api/seller/change-password
     */
    async changePassword(passwordData) {
        try {
            const response = await api.post(
                "/seller/change-password",
                passwordData
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default sellerProfileService;
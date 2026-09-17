import api from "../../api/axios";

const sellerStoreService = {
    /**
     * Get seller store details
     * GET /api/seller/store
     */
    async getStore() {
        try {
            const response = await api.get("/seller/store");
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Update seller store
     * PUT /api/seller/store
     */
    async updateStore(storeData) {
        try {
            const response = await api.put(
                "/seller/store",
                storeData
            );

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default sellerStoreService;
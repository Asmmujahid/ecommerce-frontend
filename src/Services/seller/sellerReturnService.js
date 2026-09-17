import api from "../../api/axios";

const sellerReturnService = {
    /**
     * Get all seller return requests.
     */
    getReturnRequests: async () => {
        try {
            const response = await api.get(
                "/seller/return-requests"
            );

            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message:
                        error.message ||
                        "Failed to fetch return requests.",
                }
            );
        }
    },

    /**
     * Get one seller return request.
     */
    getReturnRequest: async (id) => {
        try {
            const response = await api.get(
                `/seller/return-requests/${id}`
            );

            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message:
                        error.message ||
                        "Failed to fetch return request.",
                }
            );
        }
    },

    /**
     * Update return request.
     */
    updateReturnRequest: async (id, data) => {
        try {
            const response = await api.put(
                `/seller/return-requests/${id}`,
                data
            );

            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    success: false,
                    message:
                        error.message ||
                        "Failed to update return request.",
                }
            );
        }
    },

    /**
     * Approve return request.
     */
    approveReturnRequest: async (
        id,
        adminNote = ""
    ) => {
        return sellerReturnService.updateReturnRequest(
            id,
            {
                status: "approved",
                admin_note: adminNote,
            }
        );
    },

    /**
     * Reject return request.
     */
    rejectReturnRequest: async (
        id,
        adminNote = ""
    ) => {
        return sellerReturnService.updateReturnRequest(
            id,
            {
                status: "rejected",
                admin_note: adminNote,
            }
        );
    },
};

export default sellerReturnService;
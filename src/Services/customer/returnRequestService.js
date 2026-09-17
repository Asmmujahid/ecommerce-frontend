
import axios from "../../api/axios";

// =====================================================
// CUSTOMER RETURN REQUEST SERVICE
// =====================================================

const returnRequestService = {
    // =================================================
    // GET ALL RETURN REQUESTS
    // GET /customer/return-requests
    // =================================================

    getReturnRequests: async () => {
        const response = await axios.get(
            "/customer/return-requests"
        );

        return response.data;
    },

    // =================================================
    // GET RETURNABLE ITEMS
    // GET /customer/return-requests/returnable-items
    // =================================================

    getReturnableItems: async () => {
        const response = await axios.get(
            "/customer/return-requests/returnable-items"
        );

        return response.data;
    },

    // =================================================
    // GET SINGLE RETURN REQUEST
    // GET /customer/return-requests/{id}
    // =================================================

    getReturnRequest: async (id) => {
        const response = await axios.get(
            `/customer/return-requests/${id}`
        );

        return response.data;
    },

    // =================================================
    // CREATE RETURN REQUEST
    // POST /customer/return-requests
    // =================================================

    createReturnRequest: async (returnData) => {
        const response = await axios.post(
            "/customer/return-requests",
            returnData
        );

        return response.data;
    },

    // =================================================
    // CANCEL RETURN REQUEST
    // DELETE /customer/return-requests/{id}
    // =================================================

    cancelReturnRequest: async (id) => {
        const response = await axios.delete(
            `/customer/return-requests/${id}`
        );

        return response.data;
    },
};

export default returnRequestService;


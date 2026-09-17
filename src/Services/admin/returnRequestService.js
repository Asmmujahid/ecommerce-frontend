// src/services/admin/returnRequestService.js

import axiosInstance from "../../api/axios";
import API from "../../api/endpoints";

// =====================================================
// ADMIN RETURN REQUEST SERVICE
// =====================================================

const returnRequestService = {
    /**
     * =================================================
     * GET ALL RETURN REQUESTS
     *
     * GET /api/admin/return-requests
     * =================================================
     */
    getReturnRequests: async () => {
        const response = await axiosInstance.get(
            API.ADMIN_RETURN_REQUESTS
        );

        return response.data;
    },

    /**
     * =================================================
     * GET SINGLE RETURN REQUEST
     *
     * GET /api/admin/return-requests/{id}
     * =================================================
     */
    getReturnRequest: async (id) => {
        if (!id) {
            throw new Error(
                "Return request ID is required."
            );
        }

        const response = await axiosInstance.get(
            API.ADMIN_RETURN_REQUEST_DETAILS(id)
        );

        return response.data;
    },

    /**
     * =================================================
     * UPDATE RETURN REQUEST
     *
     * PUT /api/admin/return-requests/{id}
     * =================================================
     */
    updateReturnRequest: async (
        id,
        returnRequestData
    ) => {
        if (!id) {
            throw new Error(
                "Return request ID is required."
            );
        }

        const response = await axiosInstance.put(
            API.ADMIN_RETURN_REQUEST_DETAILS(id),
            returnRequestData
        );

        return response.data;
    },

    /**
     * =================================================
     * DELETE RETURN REQUEST
     *
     * DELETE /api/admin/return-requests/{id}
     * =================================================
     */
    deleteReturnRequest: async (id) => {
        if (!id) {
            throw new Error(
                "Return request ID is required."
            );
        }

        const response = await axiosInstance.delete(
            API.ADMIN_RETURN_REQUEST_DETAILS(id)
        );

        return response.data;
    },
};

export default returnRequestService;
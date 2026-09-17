// src/services/customer/paymentService.js

import api from "../../api/axios";

// =====================================================
// CUSTOMER PAYMENT SERVICE
// =====================================================

const paymentService = {

    // =================================================
    // GET ALL PAYMENT HISTORY
    // =================================================

    getPayments: async () => {
        try {
            const response = await api.get(
                "/customer/payments"
            );

            console.log(
                "PAYMENTS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "GET PAYMENTS ERROR:",
                error?.response?.data ||
                error
            );

            throw error;
        }
    },

    // =================================================
    // GET SINGLE PAYMENT
    // =================================================

    getPayment: async (id) => {
        try {
            if (
                id === undefined ||
                id === null ||
                String(id).trim() === ""
            ) {
                throw {
                    status: 422,
                    message:
                        "Payment ID is required.",
                    errors: {},
                };
            }

            const response = await api.get(
                `/customer/payments/${id}`
            );

            console.log(
                "PAYMENT DETAILS RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "GET PAYMENT DETAILS ERROR:",
                error?.response?.data ||
                error
            );

            throw error;
        }
    },

    // =================================================
    // DELETE PAYMENT
    // =================================================

    deletePayment: async (id) => {
        try {
            if (
                id === undefined ||
                id === null ||
                String(id).trim() === ""
            ) {
                throw {
                    status: 422,
                    message:
                        "Payment ID is required.",
                    errors: {},
                };
            }

            const response = await api.delete(
                `/customer/payments/${id}`
            );

            console.log(
                "DELETE PAYMENT RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            console.error(
                "DELETE PAYMENT ERROR:",
                error?.response?.data ||
                error
            );

            throw error;
        }
    },
};

export default paymentService;


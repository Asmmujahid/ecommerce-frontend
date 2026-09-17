// src/Services/seller/sellerPaymentService.js

import axiosInstance from "../../api/axios";

const BASE_URL = "/seller";

/**
 * Remove empty query parameters before sending them to Laravel.
 */
const cleanParams = (params = {}) => {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );
};

/**
 * Extract a useful error message from Axios/Laravel errors.
 */
const getErrorMessage = (error, fallback = "Something went wrong.") => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
};

const sellerPaymentService = {
    /**
     * Get seller payments.
     *
     * Seller is read-only:
     * - No create
     * - No update
     * - No delete
     *
     * Backend endpoint:
     * GET /api/seller/payments
     */
    getPayments: async (params = {}) => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/payments`,
                {
                    params: cleanParams(params),
                }
            );

            return response.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(
                    error,
                    "Failed to load seller payments."
                )
            );
        }
    },

    /**
     * Get one seller payment.
     *
     * Backend endpoint:
     * GET /api/seller/payments/{id}
     */
    getPayment: async (id) => {
        if (
            id === null ||
            id === undefined ||
            id === "" ||
            Number.isNaN(Number(id))
        ) {
            throw new Error("Payment ID is required.");
        }

        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/payments/${id}`
            );

            return response.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(
                    error,
                    "Failed to load payment details."
                )
            );
        }
    },

    /**
     * Get seller earnings.
     *
     * IMPORTANT:
     * This method does NOT calculate earnings.
     * All accounting values come from the Laravel backend.
     *
     * Expected backend values may include:
     * - gross_sales
     * - marketplace_commission
     * - vendor_selling_fees
     * - vendor_earnings
     * - paid_earnings
     * - pending_earnings
     * - reversed_earnings
     *
     * Backend endpoint:
     * GET /api/seller/earnings
     */
    getEarnings: async (params = {}) => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/earnings`,
                {
                    params: cleanParams(params),
                }
            );

            return response.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(
                    error,
                    "Failed to load seller earnings."
                )
            );
        }
    },
};

export default sellerPaymentService;


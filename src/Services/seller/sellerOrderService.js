import api from "../../api/axios";

/**
 * ==========================================
 * Seller Order Service
 * ==========================================
 *
 * Seller order rules:
 *
 * Vendor-owned product:
 * Customer pays 100%
 * Admin gets 10%
 * Vendor gets 90%
 *
 * Admin-owned product assigned to vendor:
 * Customer pays 100%
 * Vendor gets 10%
 * Admin gets 90%
 *
 * Backend is responsible for accounting.
 */

// ======================================================
// Clean Parameters
// ======================================================

const cleanParams = (params = {}) => {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([key, value]) => {
                // Do not send empty values
                if (
                    value === "" ||
                    value === null ||
                    value === undefined
                ) {
                    return false;
                }

                // "all" means no filter
                if (
                    key === "status" &&
                    value === "all"
                ) {
                    return false;
                }

                if (
                    key === "payment_status" &&
                    value === "all"
                ) {
                    return false;
                }

                return true;
            }
        )
    );
};

// ======================================================
// Seller Order Service
// ======================================================

const sellerOrderService = {

    // ==========================================
    // Get All Seller Orders
    // ==========================================

    async getOrders(params = {}) {
        const response = await api.get(
            "/seller/orders",
            {
                params:
                    cleanParams(params),

                timeout: 15000,
            }
        );

        return response.data;
    },

    // ==========================================
    // Get Single Seller Order
    // ==========================================

    async getOrder(id) {
        if (!id) {
            throw new Error(
                "Order ID is required."
            );
        }

        const response = await api.get(
            `/seller/orders/${id}`,
            {
                timeout: 15000,
            }
        );

        return response.data;
    },

    // ==========================================
    // Update Order Status
    // ==========================================

    async updateOrderStatus(
        id,
        status
    ) {
        if (!id) {
            throw new Error(
                "Order ID is required."
            );
        }

        if (!status) {
            throw new Error(
                "Order status is required."
            );
        }

        const response = await api.put(
            `/seller/orders/${id}`,
            {
                status,
            },
            {
                timeout: 15000,
            }
        );

        return response.data;
    },
};

export default sellerOrderService;


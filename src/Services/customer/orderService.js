
// src/Services/customer/orderService.js

import api from "../../api/axios";
import API from "../../api/endpoints";

// =====================================================
// CUSTOMER ORDER SERVICE
// =====================================================

// -----------------------------------------------------
// GET ALL CUSTOMER ORDERS
// GET /api/customer/orders
// -----------------------------------------------------

const getOrders = async () => {
    const response = await api.get(API.ORDERS);

    return response.data;
};

// -----------------------------------------------------
// GET SINGLE CUSTOMER ORDER
// GET /api/customer/orders/{id}
// -----------------------------------------------------

const getOrder = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await api.get(
        API.ORDER_DETAILS(id)
    );

    return response.data;
};

// -----------------------------------------------------
// CANCEL CUSTOMER ORDER
// PUT /api/customer/orders/{id}
// -----------------------------------------------------

const cancelOrder = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await api.put(
        API.ORDER_DETAILS(id),
        {
            status: "cancelled",
        }
    );

    return response.data;
};

// -----------------------------------------------------
// UPDATE CUSTOMER ORDER
// PUT /api/customer/orders/{id}
// -----------------------------------------------------

const updateOrder = async (id, orderData) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    if (
        !orderData ||
        typeof orderData !== "object"
    ) {
        throw new Error("Order data is required.");
    }

    const response = await api.put(
        API.ORDER_DETAILS(id),
        orderData
    );

    return response.data;
};

// -----------------------------------------------------
// DELETE CUSTOMER ORDER
// DELETE /api/customer/orders/{id}
// -----------------------------------------------------

const deleteOrder = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await api.delete(
        API.ORDER_DETAILS(id)
    );

    return response.data;
};

// =====================================================
// SERVICE OBJECT
// =====================================================

const orderService = {
    getOrders,
    getOrder,
    cancelOrder,
    updateOrder,
    deleteOrder,
};

export default orderService;


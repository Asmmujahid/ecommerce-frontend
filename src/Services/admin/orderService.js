// src/Services/admin/orderService.js

import axiosInstance from "../../api/axios";

const BASE_URL = "/admin/orders";

// ==========================================
// Helper: Clean Query Parameters
// ==========================================

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

// ==========================================
// Get All Orders
// ==========================================

const getOrders = async (params = {}) => {
    const response = await axiosInstance.get(
        BASE_URL,
        {
            params: cleanParams(params),
        }
    );

    return response.data;
};

// ==========================================
// Get Single Order
// ==========================================

const getOrder = async (id) => {
    const response = await axiosInstance.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

// ==========================================
// Create Order
// ==========================================

const createOrder = async (orderData) => {
    const response = await axiosInstance.post(
        BASE_URL,
        orderData
    );

    return response.data;
};

// ==========================================
// Update Order
// ==========================================

const updateOrder = async (id, orderData) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        orderData
    );

    return response.data;
};

// ==========================================
// Delete Order
// ==========================================

const deleteOrder = async (id) => {
    const response = await axiosInstance.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

// ==========================================
// Export
// ==========================================

const orderService = {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
};

export default orderService;


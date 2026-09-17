// src/Services/admin/couponService.js

import axiosInstance from "../../api/axios";

// =====================================================
// ADMIN COUPON SERVICE
// =====================================================

const BASE_URL = "/admin/coupons";

// =====================================================
// GET ALL COUPONS
// GET /admin/coupons
// =====================================================

const getCoupons = async () => {
    const response = await axiosInstance.get(BASE_URL);

    return response.data;
};

// =====================================================
// GET SINGLE COUPON
// GET /admin/coupons/{id}
// =====================================================

const getCoupon = async (id) => {
    const response = await axiosInstance.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

// =====================================================
// CREATE COUPON
// POST /admin/coupons
// =====================================================

const createCoupon = async (couponData) => {
    const response = await axiosInstance.post(
        BASE_URL,
        couponData
    );

    return response.data;
};

// =====================================================
// UPDATE COUPON
// PUT /admin/coupons/{id}
// =====================================================

const updateCoupon = async ({
    id,
    couponData,
}) => {
    const response = await axiosInstance.put(
        `${BASE_URL}/${id}`,
        couponData
    );

    return response.data;
};

// =====================================================
// DELETE COUPON
// DELETE /admin/coupons/{id}
// =====================================================

const deleteCoupon = async (id) => {
    const response = await axiosInstance.delete(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

// =====================================================
// EXPORT
// =====================================================

const couponService = {
    getCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};

export default couponService;
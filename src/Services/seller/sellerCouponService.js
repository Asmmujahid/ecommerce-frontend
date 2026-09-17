// src/Services/seller/sellerCouponService.js

import api from "../../api/axios";

// =====================================================
// SELLER COUPON SERVICE
// =====================================================

const sellerCouponService = {

    // =================================================
    // GET ALL SELLER COUPONS
    // GET /seller/coupons
    // =================================================

    async getCoupons() {
        const response = await api.get(
            "/seller/coupons"
        );

        return response.data;
    },

    // =================================================
    // GET SINGLE SELLER COUPON
    // GET /seller/coupons/{id}
    // =================================================

    async getCoupon(id) {
        const response = await api.get(
            `/seller/coupons/${id}`
        );

        return response.data;
    },

    // =================================================
    // CREATE SELLER COUPON
    // POST /seller/coupons
    // =================================================

    async createCoupon(data) {
        const response = await api.post(
            "/seller/coupons",
            data
        );

        return response.data;
    },

    // =================================================
    // UPDATE SELLER COUPON
    // PUT /seller/coupons/{id}
    // =================================================

    async updateCoupon(id, data) {
        const response = await api.put(
            `/seller/coupons/${id}`,
            data
        );

        return response.data;
    },

    // =================================================
    // DELETE SELLER COUPON
    // DELETE /seller/coupons/{id}
    // =================================================

    async deleteCoupon(id) {
        const response = await api.delete(
            `/seller/coupons/${id}`
        );

        return response.data;
    },
};

export default sellerCouponService;
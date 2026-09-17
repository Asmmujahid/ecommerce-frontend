// src/services/customer/checkoutService.js

import api from "../../api/axios";

const checkoutService = {
    /**
     * Place customer order
     *
     * POST /api/customer/checkout
     *
     * IMPORTANT:
     * subtotal_amount is ALWAYS the original
     * cart subtotal BEFORE coupon discount.
     */

    placeOrder: async (checkoutData) => {
        try {
            if (
                !checkoutData ||
                typeof checkoutData !==
                    "object"
            ) {
                throw {
                    status: 422,
                    message:
                        "Checkout data is required.",
                    errors: {},
                };
            }

            const payload = {
                payment_method:
                    checkoutData.payment_method,

                shipping_address:
                    checkoutData.shipping_address,
            };

            // =================================================
            // ORIGINAL SUBTOTAL
            // =================================================

            if (
                checkoutData.subtotal_amount !==
                    undefined &&
                checkoutData.subtotal_amount !==
                    null
            ) {
                payload.subtotal_amount =
                    Number(
                        checkoutData.subtotal_amount
                    );
            }

            // =================================================
            // COUPON ID
            // =================================================

            if (
                checkoutData.coupon_id !==
                    undefined &&
                checkoutData.coupon_id !==
                    null &&
                checkoutData.coupon_id !== ""
            ) {
                payload.coupon_id =
                    Number(
                        checkoutData.coupon_id
                    );
            }

            // =================================================
            // COUPON CODE
            // =================================================

            if (
                checkoutData.coupon_code
            ) {
                payload.coupon_code =
                    String(
                        checkoutData.coupon_code
                    )
                        .trim()
                        .toUpperCase();
            }

            // =================================================
            // BANK TRANSACTION ID
            // =================================================

            if (
                checkoutData.transaction_id
            ) {
                payload.transaction_id =
                    String(
                        checkoutData.transaction_id
                    ).trim();
            }

            console.log(
                "CHECKOUT REQUEST:",
                payload
            );

            const response =
                await api.post(
                    "/customer/checkout",
                    payload
                );

            console.log(
                "CHECKOUT RESPONSE:",
                response.data
            );

            return response.data;
        } catch (error) {
            // =================================================
            // LARAVEL API ERROR
            // =================================================

            if (error?.response) {
                const data =
                    error.response.data;

                throw {
                    status:
                        error.response.status,

                    message:
                        data?.message ||
                        "Unable to place order.",

                    errors:
                        data?.errors ||
                        {},
                };
            }

            // =================================================
            // NETWORK ERROR
            // =================================================

            if (error?.request) {
                throw {
                    status: null,

                    message:
                        "Unable to connect to Laravel server.",

                    errors: {},
                };
            }

            // =================================================
            // FRONTEND ERROR
            // =================================================

            throw {
                status:
                    error?.status ??
                    null,

                message:
                    error?.message ||
                    "Something went wrong during checkout.",

                errors:
                    error?.errors ||
                    {},
            };
        }
    },
};

export default checkoutService;
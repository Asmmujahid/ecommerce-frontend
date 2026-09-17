// src/services/customer/couponService.js

import api from "../../api/axios";

/*
|--------------------------------------------------------------------------
| NORMALIZE IDS
|--------------------------------------------------------------------------
*/

const normalizeIds = (ids = []) => {
    if (!Array.isArray(ids)) {
        return [];
    }

    return [
        ...new Set(
            ids
                .map((id) => Number(id))
                .filter(
                    (id) =>
                        Number.isInteger(id) &&
                        id > 0
                )
        ),
    ].sort((a, b) => a - b);
};

/*
|--------------------------------------------------------------------------
| NORMALIZE ITEMS
|--------------------------------------------------------------------------
*/

const normalizeItems = (items = []) => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => ({
            product_id: Number(
                item?.product_id
            ),
            quantity: Number(
                item?.quantity
            ),
        }))
        .filter(
            (item) =>
                Number.isInteger(
                    item.product_id
                ) &&
                item.product_id > 0 &&
                Number.isInteger(
                    item.quantity
                ) &&
                item.quantity > 0
        );
};

/*
|--------------------------------------------------------------------------
| SAME IDS
|--------------------------------------------------------------------------
*/

const sameIds = (
    first = [],
    second = []
) => {
    const a = normalizeIds(first);
    const b = normalizeIds(second);

    if (a.length !== b.length) {
        return false;
    }

    return a.every(
        (id, index) =>
            id === b[index]
    );
};

/*
|--------------------------------------------------------------------------
| COUPON SERVICE
|--------------------------------------------------------------------------
*/

const couponService = {

    /*
    |--------------------------------------------------------------------------
    | GET CUSTOMER COUPONS
    |--------------------------------------------------------------------------
    */

    async getCustomerCoupons(
        productIds = []
    ) {

        const safeProductIds =
            normalizeIds(productIds);

        if (
            safeProductIds.length === 0
        ) {

            return {
                success: true,
                data: [],
            };
        }

        const response =
            await api.get(
                "/customer/coupons",
                {
                    params: {
                        product_ids:
                            safeProductIds,
                    },
                }
            );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | VALIDATE COUPON
    |--------------------------------------------------------------------------
    */

    async validateCoupon(
        code,
        productIds = []
    ) {

        const cleanCode =
            String(code || "")
                .trim()
                .toUpperCase();

        const safeProductIds =
            normalizeIds(productIds);

        if (!cleanCode) {

            throw new Error(
                "Coupon code is required."
            );
        }

        if (
            safeProductIds.length === 0
        ) {

            throw new Error(
                "No products available for coupon validation."
            );
        }

        const response =
            await api.post(
                "/customer/coupons/validate",
                {
                    code: cleanCode,

                    product_ids:
                        safeProductIds,
                }
            );

        return response.data;
    },

    /*
    |--------------------------------------------------------------------------
    | APPLY COUPON
    |--------------------------------------------------------------------------
    */

    async applyCoupon(
        code,
        productIds = [],
        items = []
    ) {

        const cleanCode =
            String(code || "")
                .trim()
                .toUpperCase();

        const safeProductIds =
            normalizeIds(productIds);

        const safeItems =
            normalizeItems(items);

        /*
        |--------------------------------------------------------------------------
        | VALIDATE CODE
        |--------------------------------------------------------------------------
        */

        if (!cleanCode) {

            throw new Error(
                "Coupon code is required."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDATE PRODUCTS
        |--------------------------------------------------------------------------
        */

        if (
            safeProductIds.length === 0
        ) {

            throw new Error(
                "No products available for coupon application."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDATE ITEMS
        |--------------------------------------------------------------------------
        */

        if (
            safeItems.length === 0
        ) {

            throw new Error(
                "Cart items are required."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | MAKE SURE PRODUCTS MATCH CART
        |--------------------------------------------------------------------------
        */

        const itemProductIds =
            normalizeIds(
                safeItems.map(
                    (item) =>
                        item.product_id
                )
            );

        if (
            !sameIds(
                safeProductIds,
                itemProductIds
            )
        ) {

            throw new Error(
                "Cart products and coupon products do not match."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BACKEND CALCULATION
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Backend calculates the discount from the
        | ORIGINAL eligible subtotal.
        |
        | Frontend does not calculate coupon discount.
        |
        */

        const response =
            await api.post(
                "/customer/coupons/apply",
                {
                    code: cleanCode,

                    product_ids:
                        safeProductIds,

                    items: safeItems,
                }
            );

        return response.data;
    },
};

export default couponService;
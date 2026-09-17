// src/Services/customer/cartService.js

import api from "../../api/axios";
import API from "../../api/endpoints";

// =====================================================
// GET CUSTOMER CART
// GET /api/customer/cart
// =====================================================

export const getCart = async () => {
    const response = await api.get(
        API.CART
    );

    return response;
};

// =====================================================
// ADD PRODUCT TO CART
// POST /api/customer/cart
// =====================================================

export const addToCart = async ({
    product_id,
    product_variant_id = null,
    quantity = 1,
}) => {
    if (!product_id) {
        throw new Error(
            "Product ID is required."
        );
    }

    const response = await api.post(
        API.CART,
        {
            product_id,
            product_variant_id,
            quantity: Number(quantity),
        }
    );

    return response;
};

// =====================================================
// GET SINGLE CART ITEM
// GET /api/customer/cart/{id}
// =====================================================

export const getCartItem = async (id) => {
    if (!id) {
        throw new Error(
            "Cart item ID is required."
        );
    }

    const response = await api.get(
        API.CART_ITEM(id)
    );

    return response;
};

// =====================================================
// UPDATE CART ITEM
// PUT /api/customer/cart/{id}
// =====================================================

export const updateCartItem = async (
    id,
    quantity
) => {
    if (!id) {
        throw new Error(
            "Cart item ID is required."
        );
    }

    if (quantity < 1) {
        throw new Error(
            "Quantity must be at least 1."
        );
    }

    const response = await api.put(
        API.CART_ITEM(id),
        {
            quantity: Number(quantity),
        }
    );

    return response;
};

// =====================================================
// REMOVE CART ITEM
// DELETE /api/customer/cart/{id}
// =====================================================

export const removeCartItem = async (id) => {
    if (!id) {
        throw new Error(
            "Cart item ID is required."
        );
    }

    const response = await api.delete(
        API.CART_ITEM(id)
    );

    return response;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

const cartService = {
    getCart,
    addToCart,
    getCartItem,
    updateCartItem,
    removeCartItem,
};

export default cartService;


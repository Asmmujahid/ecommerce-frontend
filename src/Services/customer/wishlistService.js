// src/Services/customer/wishlistService.js

import api from "../../api/axios";
import API from "../../api/endpoints";

// =====================================================
// GET WISHLIST
// GET /api/customer/wishlists
// =====================================================

export const getWishlist = async () => {
    const response = await api.get(
        API.WISHLIST
    );

    return response;
};

// =====================================================
// GET SINGLE WISHLIST ITEM
// GET /api/customer/wishlists/{id}
// =====================================================

export const getWishlistItem = async (id) => {
    if (!id) {
        throw new Error(
            "Wishlist item ID is required."
        );
    }

    const response = await api.get(
        API.WISHLIST_ITEM(id)
    );

    return response;
};

// =====================================================
// ADD PRODUCT TO WISHLIST
// POST /api/customer/wishlists
// =====================================================

export const addToWishlist = async (
    product_id
) => {
    if (!product_id) {
        throw new Error(
            "Product ID is required."
        );
    }

    const response = await api.post(
        API.WISHLIST,
        {
            product_id,
        }
    );

    return response;
};

// =====================================================
// REMOVE WISHLIST ITEM
// DELETE /api/customer/wishlists/{id}
// =====================================================

export const removeFromWishlist = async (
    id
) => {
    if (!id) {
        throw new Error(
            "Wishlist item ID is required."
        );
    }

    const response = await api.delete(
        API.WISHLIST_ITEM(id)
    );

    return response;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

const wishlistService = {
    getWishlist,
    getWishlistItem,
    addToWishlist,
    removeFromWishlist,
};

export default wishlistService;


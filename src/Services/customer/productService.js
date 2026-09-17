// src/Services/customer/productService.js

import api from "../../api/axios";
import API from "../../api/endpoints";

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================

export const getProducts = async () => {
    const response = await api.get(
        API.PRODUCTS
    );

    return response;
};

// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/{id}
// =====================================================

export const getProduct = async (id) => {
    if (!id) {
        throw new Error(
            "Product ID is required."
        );
    }

    const response = await api.get(
        API.PRODUCT_DETAILS(id)
    );

    return response;
};

// =====================================================
// SEARCH PRODUCTS
// POST /api/products/search
// =====================================================

export const searchProducts = async (
    keyword = ""
) => {
    const response = await api.post(
        API.PRODUCT_SEARCH,
        {
            keyword: keyword.trim(),
        }
    );

    return response;
};

// =====================================================
// FILTER PRODUCTS
// POST /api/products/filter
// =====================================================

export const filterProducts = async ({
    category_id = null,
    brand_id = null,
    featured = null,
} = {}) => {
    const response = await api.post(
        API.PRODUCT_FILTER,
        {
            category_id,
            brand_id,
            featured,
        }
    );

    return response;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

const productService = {
    getProducts,
    getProduct,
    searchProducts,
    filterProducts,
};

export default productService;

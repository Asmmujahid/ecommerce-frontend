// src/Services/customer/categoryService.js

import api from "../../api/axios";

// =====================================================
// Get All Categories
// =====================================================

const getCategories = async () => {
    return await api.get("/categories");
};

// =====================================================
// Get Single Category
// =====================================================

const getCategory = async (id) => {
    return await api.get(
        `/categories/${id}`
    );
};

// =====================================================
// Get Products By Category
// =====================================================

const getCategoryProducts = async (id) => {
    return await api.get(
        `/categories/${id}/products`
    );
};

// =====================================================
// Export
// =====================================================

export {
    getCategories,
    getCategory,
    getCategoryProducts,
};
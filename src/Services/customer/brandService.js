
// src/Services/customer/brandService.js

import axiosInstance from "../../api/axios";

// =====================================================
// Base URL
// =====================================================

const BASE_URL = "/brands";

// =====================================================
// Get All Brands
// GET /api/brands
// =====================================================

export const getBrands = async () => {
    const response = await axiosInstance.get(BASE_URL);

    return response.data;
};

// =====================================================
// Get Single Brand
// GET /api/brands/{id}
// =====================================================

export const getBrand = async (id) => {
    if (!id) {
        throw new Error("Brand ID is required.");
    }

    const response = await axiosInstance.get(
        `${BASE_URL}/${id}`
    );

    return response.data;
};

// =====================================================
// Get Products By Brand
// GET /api/brands/{id}/products
// =====================================================

export const getBrandProducts = async (id) => {
    if (!id) {
        throw new Error("Brand ID is required.");
    }

    const response = await axiosInstance.get(
        `${BASE_URL}/${id}/products`
    );

    return response.data;
};

// =====================================================
// Default Service Object
// =====================================================

const brandService = {
    getBrands,
    getBrand,
    getBrandProducts,
};

export default brandService;


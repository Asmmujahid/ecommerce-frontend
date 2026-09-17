
// src/redux/customer/brandSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getBrands,
    getBrand,
    getBrandProducts as getBrandProductsService,
} from "../../Services/customer/brandService";

// =====================================================
// Initial State
// =====================================================

const initialState = {
    brands: [],
    brand: null,
    products: [],

    loading: false,
    brandLoading: false,
    productsLoading: false,

    error: null,
    brandError: null,
    productsError: null,
};

// =====================================================
// Fetch All Brands
// GET /api/brands
// =====================================================

export const fetchBrands = createAsyncThunk(
    "customerBrands/fetchBrands",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getBrands();

            /*
             * Laravel response:
             *
             * {
             *     success: true,
             *     message: "Brands retrieved successfully",
             *     data: [...]
             * }
             */

            return response?.data ?? [];
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch brands."
            );
        }
    }
);

// =====================================================
// Fetch Single Brand
// GET /api/brands/{id}
// =====================================================

export const fetchBrand = createAsyncThunk(
    "customerBrands/fetchBrand",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue("Brand ID is required.");
            }

            const response = await getBrand(id);

            /*
             * Laravel response:
             *
             * {
             *     success: true,
             *     data: {...}
             * }
             */

            return response?.data ?? null;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch brand."
            );
        }
    }
);

// =====================================================
// Fetch Products By Brand
// GET /api/brands/{id}/products
// =====================================================
export const fetchBrandProducts = createAsyncThunk(
    "customerBrands/fetchBrandProducts",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getBrandProductsService(id);

            return {
                brand: response?.brand ?? "",
                products: Array.isArray(response?.products)
                    ? response.products
                    : [],
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch brand products."
            );
        }
    }
);

// =====================================================
// Slice
// =====================================================

const brandSlice = createSlice({
    name: "customerBrands",

    initialState,

    reducers: {
        // ---------------------------------------------
        // Clear Single Brand
        // ---------------------------------------------

        clearBrand: (state) => {
            state.brand = null;
            state.brandError = null;
        },

        // ---------------------------------------------
        // Clear Brand Products
        // ---------------------------------------------

        clearBrandProducts: (state) => {
            state.products = [];
            state.productsError = null;
        },

        // ---------------------------------------------
        // Clear All Errors
        // ---------------------------------------------

        clearBrandErrors: (state) => {
            state.error = null;
            state.brandError = null;
            state.productsError = null;
        },

        // ---------------------------------------------
        // Reset Entire State
        // ---------------------------------------------

        resetBrands: () => initialState,
    },

    extraReducers: (builder) => {
        // =================================================
        // Fetch All Brands
        // =================================================

        builder
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.brands = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })

            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch brands.";

                state.brands = [];
            });

        // =================================================
        // Fetch Single Brand
        // =================================================

        builder
            .addCase(fetchBrand.pending, (state) => {
                state.brandLoading = true;
                state.brandError = null;
            })

            .addCase(fetchBrand.fulfilled, (state, action) => {
                state.brandLoading = false;
                state.brandError = null;

                state.brand = action.payload;
            })

            .addCase(fetchBrand.rejected, (state, action) => {
                state.brandLoading = false;

                state.brandError =
                    action.payload ||
                    "Failed to fetch brand.";

                state.brand = null;
            });

        // =================================================
        // Fetch Products By Brand
        // =================================================

        builder
            .addCase(fetchBrandProducts.pending, (state) => {
                state.productsLoading = true;
                state.productsError = null;
                state.products = [];
            })

            .addCase(
                fetchBrandProducts.fulfilled,
                (state, action) => {
                    state.productsLoading = false;
                    state.productsError = null;

                    state.products = Array.isArray(
                        action.payload?.products
                    )
                        ? action.payload.products
                        : [];

                    // Store brand name from API
                    if (action.payload?.brand) {
                        state.brand = {
                            ...(state.brand || {}),
                            name: action.payload.brand,
                        };
                    }
                }
            )

            .addCase(
                fetchBrandProducts.rejected,
                (state, action) => {
                    state.productsLoading = false;

                    state.productsError =
                        action.payload ||
                        "Failed to fetch brand products.";

                    state.products = [];
                }
            );
    },
});

// =====================================================
// Selectors
// =====================================================

export const selectBrands = (state) =>
    state.customerBrand?.brands ?? [];

export const selectBrand = (state) =>
    state.customerBrand?.brand ?? null;

export const selectBrandProducts = (state) =>
    state.customerBrand?.products ?? [];

export const selectBrandLoading = (state) =>
    state.customerBrand?.loading ?? false;

export const selectBrandError = (state) =>
    state.customerBrand?.error ?? null;

export const selectSingleBrandLoading = (state) =>
    state.customerBrand?.brandLoading ?? false;

export const selectSingleBrandError = (state) =>
    state.customerBrand?.brandError ?? null;

export const selectBrandProductsLoading = (state) =>
    state.customerBrand?.productsLoading ?? false;

export const selectBrandProductsError = (state) =>
    state.customerBrand?.productsError ?? null;

// =====================================================
// Actions
// =====================================================

export const {
    clearBrand,
    clearBrandProducts,
    clearBrandErrors,
    resetBrands,
} = brandSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default brandSlice.reducer;


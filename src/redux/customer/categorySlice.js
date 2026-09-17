
// src/redux/customer/categorySlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCategories as getCategoriesApi,
    getCategory as getCategoryApi,
    getCategoryProducts as getCategoryProductsApi,
} from "../../Services/customer/categoryService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    categories: [],

    category: null,

    products: [],

    loading: false,

    categoryLoading: false,

    productsLoading: false,

    error: null,
};

// =====================================================
// GET ALL CATEGORIES
// =====================================================

export const getCategories = createAsyncThunk(
    "customerCategory/getCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response =
                await getCategoriesApi();

            const payload =
                response?.data;

            const categories =
                payload?.data ??
                payload?.categories ??
                payload ??
                [];

            return Array.isArray(categories)
                ? categories
                : [];
        } catch (error) {
            console.error(
                "getCategories error:",
                error?.response?.data ||
                    error
            );

            return rejectWithValue(
                error?.response?.data
                    ?.message ||
                    error?.message ||
                    "Failed to fetch categories."
            );
        }
    }
);

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const fetchCategories =
    getCategories;

// =====================================================
// GET SINGLE CATEGORY
// =====================================================

export const getCategory = createAsyncThunk(
    "customerCategory/getCategory",
    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Category ID is required."
                );
            }

            const response =
                await getCategoryApi(id);

            const payload =
                response?.data;

            const category =
                payload?.data ??
                payload?.category ??
                payload ??
                null;

            return category;
        } catch (error) {
            console.error(
                "getCategory error:",
                error?.response?.data ||
                    error
            );

            return rejectWithValue(
                error?.response?.data
                    ?.message ||
                    error?.message ||
                    "Failed to fetch category."
            );
        }
    }
);

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const fetchCategory =
    getCategory;

// =====================================================
// GET PRODUCTS BY CATEGORY
// =====================================================

export const getCategoryProducts =
    createAsyncThunk(
        "customerCategory/getCategoryProducts",
        async (
            id,
            { rejectWithValue }
        ) => {
            try {
                if (!id) {
                    return rejectWithValue(
                        "Category ID is required."
                    );
                }

                const response =
                    await getCategoryProductsApi(
                        id
                    );

                const payload =
                    response?.data;

                /*
                 * Support all common Laravel
                 * response structures:
                 *
                 * {
                 *   data: [...]
                 * }
                 *
                 * {
                 *   products: [...]
                 * }
                 *
                 * {
                 *   data: {
                 *      products: [...]
                 *   }
                 * }
                 */

                let products = [];

                if (
                    Array.isArray(
                        payload?.data
                    )
                ) {
                    products =
                        payload.data;
                } else if (
                    Array.isArray(
                        payload?.products
                    )
                ) {
                    products =
                        payload.products;
                } else if (
                    Array.isArray(
                        payload?.data
                            ?.products
                    )
                ) {
                    products =
                        payload.data
                            .products;
                } else if (
                    Array.isArray(
                        payload
                    )
                ) {
                    products =
                        payload;
                }

                return products;
            } catch (error) {
                console.error(
                    "getCategoryProducts error:",
                    error?.response
                        ?.data ||
                        error
                );

                return rejectWithValue(
                    error?.response
                        ?.data?.message ||
                        error?.message ||
                        "Failed to fetch category products."
                );
            }
        }
    );

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const fetchCategoryProducts =
    getCategoryProducts;

// =====================================================
// SLICE
// =====================================================

const categorySlice =
    createSlice({
        name: "customerCategory",

        initialState,

        reducers: {
            // -----------------------------------------
            // CLEAR ERROR
            // -----------------------------------------

            clearCategoryError: (
                state
            ) => {
                state.error = null;
            },

            // -----------------------------------------
            // CLEAR SINGLE CATEGORY
            // -----------------------------------------

            clearCategory: (
                state
            ) => {
                state.category =
                    null;

                state.products = [];

                state.error = null;
            },

            // -----------------------------------------
            // CLEAR ALL CATEGORIES
            // -----------------------------------------

            clearCategories: (
                state
            ) => {
                state.categories =
                    [];
            },

            // -----------------------------------------
            // CLEAR CATEGORY PRODUCTS
            // -----------------------------------------

            clearProducts: (
                state
            ) => {
                state.products =
                    [];
            },
        },

        extraReducers: (
            builder
        ) => {
            // =================================================
            // GET CATEGORIES
            // =================================================

            builder
                .addCase(
                    getCategories.pending,
                    (state) => {
                        state.loading =
                            true;

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getCategories.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.categories =
                            Array.isArray(
                                action.payload
                            )
                                ? action.payload
                                : [];

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getCategories.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch categories.";

                        state.categories =
                            [];
                    }
                );

            // =================================================
            // GET SINGLE CATEGORY
            // =================================================

            builder
                .addCase(
                    getCategory.pending,
                    (state) => {
                        state.categoryLoading =
                            true;

                        state.error =
                            null;

                        state.category =
                            null;
                    }
                )

                .addCase(
                    getCategory.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.categoryLoading =
                            false;

                        state.category =
                            action.payload ??
                            null;

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getCategory.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.categoryLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch category.";

                        state.category =
                            null;
                    }
                );

            // =================================================
            // GET CATEGORY PRODUCTS
            // =================================================

            builder
                .addCase(
                    getCategoryProducts.pending,
                    (state) => {
                        state.productsLoading =
                            true;

                        state.error =
                            null;

                        state.products =
                            [];
                    }
                )

                .addCase(
                    getCategoryProducts.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.productsLoading =
                            false;

                        state.products =
                            Array.isArray(
                                action.payload
                            )
                                ? action.payload
                                : [];

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getCategoryProducts.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.productsLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch category products.";

                        state.products =
                            [];
                    }
                );
        },
    });

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearCategoryError,
    clearCategory,
    clearCategories,
    clearProducts,
} =
    categorySlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectCategories = (
    state
) =>
    state.customerCategory
        ?.categories ?? [];

export const selectCategory = (
    state
) =>
    state.customerCategory
        ?.category ?? null;

export const selectCategoryProducts = (
    state
) =>
    state.customerCategory
        ?.products ?? [];

export const selectCategoryLoading = (
    state
) =>
    state.customerCategory
        ?.loading ?? false;

export const selectCategoryDetailsLoading =
    (state) =>
        state.customerCategory
            ?.categoryLoading ??
        false;

export const selectCategoryProductsLoading =
    (state) =>
        state.customerCategory
            ?.productsLoading ??
        false;

export const selectCategoryError = (
    state
) =>
    state.customerCategory
        ?.error ?? null;

// =====================================================
// REDUCER
// =====================================================

export default categorySlice.reducer;



// src/redux/customer/productSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getProducts,
    getProduct,
    searchProducts as searchProductsApi,
    filterProducts as filterProductsApi,
} from "../../Services/customer/productService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    products: [],

    product: null,

    loading: false,

    productLoading: false,

    searchLoading: false,

    filterLoading: false,

    error: null,

    productError: null,

    searchError: null,

    filterError: null,
};

// =====================================================
// FETCH ALL PRODUCTS
// GET /api/products
// =====================================================

export const fetchProducts = createAsyncThunk(
    "customerProducts/fetchProducts",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getProducts();

            console.log(
                "GET /api/products response:",
                response.data
            );

            const responseData =
                response?.data;

            const products =
                responseData?.data;

            if (!Array.isArray(products)) {
                console.error(
                    "Products data is not an array:",
                    responseData
                );

                return [];
            }

            return products;
        } catch (error) {
            console.error(
                "fetchProducts error:",
                error?.response?.data || error
            );

            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch products."
            );
        }
    },

    // =================================================
    // PREVENT DUPLICATE REQUESTS
    // =================================================

    {
        condition: (_, { getState }) => {
            const state =
                getState()?.customerProduct;

            if (!state) {
                return true;
            }

            // Don't send another request
            // while one is already running.
            if (state.loading) {
                console.log(
                    "fetchProducts skipped: request already loading."
                );

                return false;
            }

            return true;
        },
    }
);

// =====================================================
// FETCH SINGLE PRODUCT
// GET /api/products/{id}
// =====================================================

export const fetchProduct = createAsyncThunk(
    "customerProducts/fetchProduct",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Product ID is required."
                );
            }

            const response =
                await getProduct(id);

            console.log(
                "GET /api/products/{id} response:",
                response.data
            );

            return (
                response?.data?.data ||
                null
            );
        } catch (error) {
            console.error(
                "fetchProduct error:",
                error?.response?.data || error
            );

            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch product."
            );
        }
    }
);

// =====================================================
// SEARCH PRODUCTS
// POST /api/products/search
// =====================================================

export const searchProducts =
    createAsyncThunk(
        "customerProducts/searchProducts",

        async (
            keyword = "",
            { rejectWithValue }
        ) => {
            try {
                /*
                 * Always convert the value to a string.
                 *
                 * This prevents:
                 *
                 * keyword.trim is not a function
                 *
                 * when an object is accidentally passed.
                 */

                const searchKeyword =
                    typeof keyword === "string"
                        ? keyword.trim()
                        : keyword?.keyword
                              ?.toString()
                              .trim() || "";

                const response =
                    await searchProductsApi(
                        searchKeyword
                    );

                console.log(
                    "Search response:",
                    response.data
                );

                const products =
                    response?.data?.data;

                return Array.isArray(
                    products
                )
                    ? products
                    : [];
            } catch (error) {
                console.error(
                    "searchProducts error:",
                    error?.response?.data ||
                        error
                );

                return rejectWithValue(
                    error?.response?.data
                        ?.message ||
                        error?.message ||
                        "Failed to search products."
                );
            }
        }
    );

// =====================================================
// FILTER PRODUCTS
// POST /api/products/filter
// =====================================================

export const filterProducts =
    createAsyncThunk(
        "customerProducts/filterProducts",

        async (
            filters = {},
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await filterProductsApi(
                        filters
                    );

                console.log(
                    "Filter response:",
                    response.data
                );

                const products =
                    response?.data?.data;

                return Array.isArray(
                    products
                )
                    ? products
                    : [];
            } catch (error) {
                console.error(
                    "filterProducts error:",
                    error?.response?.data ||
                        error
                );

                return rejectWithValue(
                    error?.response?.data
                        ?.message ||
                        error?.message ||
                        "Failed to filter products."
                );
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const productSlice = createSlice({
    name: "customerProducts",

    initialState,

    reducers: {
        // =================================================
        // CLEAR PRODUCT
        // =================================================

        clearProduct: (state) => {
            state.product = null;

            state.productError = null;
        },

        // =================================================
        // CLEAR ERRORS
        // =================================================

        clearProductError: (state) => {
            state.error = null;

            state.productError = null;

            state.searchError = null;

            state.filterError = null;
        },

        // =================================================
        // CLEAR PRODUCTS
        // =================================================

        clearProducts: (state) => {
            state.products = [];

            state.error = null;
        },

        // =================================================
        // CLEAR SEARCH
        // =================================================

        clearSearch: (state) => {
            state.searchError = null;
        },

        // =================================================
        // CLEAR FILTER
        // =================================================

        clearFilter: (state) => {
            state.filterError = null;
        },

        // =================================================
        // RESET
        // =================================================

        resetProducts: () => {
            return {
                ...initialState,
            };
        },
    },

    extraReducers: (builder) => {
        // =================================================
        // FETCH PRODUCTS
        // =================================================

        builder
            .addCase(
                fetchProducts.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchProducts.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.products =
                        Array.isArray(
                            action.payload
                        )
                            ? action.payload
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchProducts.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    /*
                     * Don't unnecessarily destroy
                     * existing products if another
                     * request fails.
                     */

                    state.error =
                        action.payload ||
                        "Failed to fetch products.";
                }
            );

        // =================================================
        // FETCH SINGLE PRODUCT
        // =================================================

        builder
            .addCase(
                fetchProduct.pending,
                (state) => {
                    state.productLoading =
                        true;

                    state.productError =
                        null;

                    state.product = null;
                }
            )

            .addCase(
                fetchProduct.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.productLoading =
                        false;

                    state.product =
                        action.payload ||
                        null;

                    state.productError =
                        null;
                }
            )

            .addCase(
                fetchProduct.rejected,
                (
                    state,
                    action
                ) => {
                    state.productLoading =
                        false;

                    state.product = null;

                    state.productError =
                        action.payload ||
                        "Failed to fetch product.";
                }
            );

        // =================================================
        // SEARCH PRODUCTS
        // =================================================

        builder
            .addCase(
                searchProducts.pending,
                (state) => {
                    state.searchLoading =
                        true;

                    state.searchError =
                        null;
                }
            )

            .addCase(
                searchProducts.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.searchLoading =
                        false;

                    state.products =
                        Array.isArray(
                            action.payload
                        )
                            ? action.payload
                            : [];

                    state.searchError =
                        null;
                }
            )

            .addCase(
                searchProducts.rejected,
                (
                    state,
                    action
                ) => {
                    state.searchLoading =
                        false;

                    state.searchError =
                        action.payload ||
                        "Failed to search products.";
                }
            );

        // =================================================
        // FILTER PRODUCTS
        // =================================================

        builder
            .addCase(
                filterProducts.pending,
                (state) => {
                    state.filterLoading =
                        true;

                    state.filterError =
                        null;
                }
            )

            .addCase(
                filterProducts.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.filterLoading =
                        false;

                    state.products =
                        Array.isArray(
                            action.payload
                        )
                            ? action.payload
                            : [];

                    state.filterError =
                        null;
                }
            )

            .addCase(
                filterProducts.rejected,
                (
                    state,
                    action
                ) => {
                    state.filterLoading =
                        false;

                    state.filterError =
                        action.payload ||
                        "Failed to filter products.";
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearProduct,
    clearProductError,
    clearProducts,
    clearSearch,
    clearFilter,
    resetProducts,
} = productSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectProducts = (
    state
) =>
    state.customerProduct?.products ||
    [];

export const selectProduct = (
    state
) =>
    state.customerProduct?.product ||
    null;

export const selectProductLoading = (
    state
) =>
    state.customerProduct?.loading ||
    false;

export const selectProductError = (
    state
) =>
    state.customerProduct?.error ||
    null;

export const selectSingleProductLoading = (
    state
) =>
    state.customerProduct
        ?.productLoading || false;

export const selectSingleProductError = (
    state
) =>
    state.customerProduct
        ?.productError || null;

export const selectSearchLoading = (
    state
) =>
    state.customerProduct
        ?.searchLoading || false;

export const selectSearchError = (
    state
) =>
    state.customerProduct
        ?.searchError || null;

export const selectFilterLoading = (
    state
) =>
    state.customerProduct
        ?.filterLoading || false;

export const selectFilterError = (
    state
) =>
    state.customerProduct
        ?.filterError || null;

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default productSlice.reducer;


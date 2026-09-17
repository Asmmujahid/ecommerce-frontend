import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import sellerProductService from "../../Services/seller/sellerProductService";

// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    products: [],
    product: null,

    loading: false,

    success: false,
    error: null,

    filters: {},

    pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
    },
};

// =========================================================
// RESPONSE HELPER
// =========================================================

const extractProductsResponse = (response) => {
    const payload = response?.data;

    // Response:
    // {
    //     data: [...]
    // }

    if (Array.isArray(payload)) {
        return {
            products: payload,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                perPage: payload.length || 10,
                total: payload.length,
            },
        };
    }

    // Response:
    // {
    //     data: {
    //         data: [...],
    //         current_page: 1,
    //         last_page: 2,
    //         per_page: 10,
    //         total: 20
    //     }
    // }

    if (Array.isArray(payload?.data)) {
        return {
            products: payload.data,

            pagination: {
                currentPage:
                    payload.current_page || 1,

                lastPage:
                    payload.last_page || 1,

                perPage:
                    payload.per_page || 10,

                total:
                    payload.total ||
                    payload.data.length,
            },
        };
    }

    return {
        products: [],

        pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
        },
    };
};

// =========================================================
// GET PRODUCTS
// =========================================================

export const getProducts = createAsyncThunk(
    "sellerProducts/getProducts",

    async (
        filters = {},
        { rejectWithValue }
    ) => {
        try {
            const response =
                await sellerProductService.getSellerProducts(
                    filters
                );

            return {
                response,
                filters,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch seller products."
            );
        }
    }
);

// =========================================================
// GET SINGLE PRODUCT
// =========================================================

export const getProduct = createAsyncThunk(
    "sellerProducts/getProduct",

    async (
        productId,
        { rejectWithValue }
    ) => {
        try {
            if (
                !productId ||
                Number.isNaN(Number(productId))
            ) {
                return rejectWithValue(
                    "Invalid product ID."
                );
            }

            console.log(
                "getProduct thunk productId:",
                productId
            );

            return await sellerProductService.getSellerProduct(
                Number(productId)
            );
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch product."
            );
        }
    }
);

// =========================================================
// CREATE PRODUCT
// =========================================================

export const createProduct = createAsyncThunk(
    "sellerProducts/createProduct",

    async (
        productData,
        { rejectWithValue }
    ) => {
        try {
            return await sellerProductService.createSellerProduct(
                productData
            );
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create product."
            );
        }
    }
);

// =========================================================
// UPDATE PRODUCT
// =========================================================

export const updateProduct = createAsyncThunk(
    "sellerProducts/updateProduct",

    async (
        { productId, productData },
        { rejectWithValue }
    ) => {
        try {
            // -------------------------------------------------
            // IMPORTANT VALIDATION
            // -------------------------------------------------

            if (
                !productId ||
                Number.isNaN(Number(productId))
            ) {
                console.error(
                    "updateProduct: Invalid productId:",
                    productId
                );

                return rejectWithValue(
                    "Product ID is required."
                );
            }

            console.log(
                "updateProduct thunk productId:",
                productId
            );

            console.log(
                "updateProduct thunk productData:",
                productData
            );

            // -------------------------------------------------
            // CALL SERVICE
            // -------------------------------------------------

            return await sellerProductService.updateSellerProduct(
                Number(productId),
                productData
            );
        } catch (error) {
            console.error(
                "updateProduct thunk error:",
                error
            );

            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update product."
            );
        }
    }
);

// =========================================================
// DELETE PRODUCT
// =========================================================

export const deleteProduct = createAsyncThunk(
    "sellerProducts/deleteProduct",

    async (
        productId,
        { rejectWithValue }
    ) => {
        try {
            if (
                !productId ||
                Number.isNaN(Number(productId))
            ) {
                return rejectWithValue(
                    "Invalid product ID."
                );
            }

            await sellerProductService.deleteSellerProduct(
                Number(productId)
            );

            return Number(productId);
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to delete product."
            );
        }
    }
);

// =========================================================
// SLICE
// =========================================================

const sellerProductSlice = createSlice({
    name: "sellerProducts",

    initialState,

    reducers: {
        clearProduct: (state) => {
            state.product = null;
        },

        clearProductError: (state) => {
            state.error = null;
        },

        clearProductSuccess: (state) => {
            state.success = false;
        },

        setProductFilters: (
            state,
            action
        ) => {
            state.filters =
                action.payload || {};
        },
    },

    extraReducers: (builder) => {
        // =====================================================
        // GET PRODUCTS
        // =====================================================

        builder
            .addCase(
                getProducts.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getProducts.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.error = null;

                    const {
                        response,
                        filters,
                    } = action.payload;

                    const result =
                        extractProductsResponse(
                            response
                        );

                    state.products =
                        result.products;

                    state.pagination =
                        result.pagination;

                    state.filters =
                        filters || {};
                }
            )

            .addCase(
                getProducts.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch products.";
                }
            );

        // =====================================================
        // GET SINGLE PRODUCT
        // =====================================================

        builder
            .addCase(
                getProduct.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.product = null;
                }
            )

            .addCase(
                getProduct.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.product =
                        action.payload?.data ||
                        action.payload ||
                        null;
                }
            )

            .addCase(
                getProduct.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch product.";
                }
            );

        // =====================================================
        // CREATE PRODUCT
        // =====================================================

        builder
            .addCase(
                createProduct.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                createProduct.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;

                    const newProduct =
                        action.payload?.data ||
                        action.payload;

                    if (newProduct) {
                        state.products.unshift(
                            newProduct
                        );
                    }
                }
            )

            .addCase(
                createProduct.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to create product.";
                }
            );

        // =====================================================
        // UPDATE PRODUCT
        // =====================================================

        builder
            .addCase(
                updateProduct.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                updateProduct.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    const updatedProduct =
                        action.payload?.data ||
                        action.payload;

                    if (
                        !updatedProduct?.id
                    ) {
                        return;
                    }

                    const index =
                        state.products.findIndex(
                            (item) =>
                                Number(item.id) ===
                                Number(
                                    updatedProduct.id
                                )
                        );

                    if (index !== -1) {
                        state.products[index] =
                            updatedProduct;
                    }

                    if (
                        state.product?.id &&
                        Number(
                            state.product.id
                        ) ===
                            Number(
                                updatedProduct.id
                            )
                    ) {
                        state.product =
                            updatedProduct;
                    }
                }
            )

            .addCase(
                updateProduct.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update product.";
                }
            );

        // =====================================================
        // DELETE PRODUCT
        // =====================================================

        builder
            .addCase(
                deleteProduct.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                deleteProduct.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;

                    state.products =
                        state.products.filter(
                            (product) =>
                                Number(
                                    product.id
                                ) !==
                                Number(
                                    action.payload
                                )
                        );

                    if (
                        state.product?.id &&
                        Number(
                            state.product.id
                        ) ===
                            Number(
                                action.payload
                            )
                    ) {
                        state.product = null;
                    }
                }
            )

            .addCase(
                deleteProduct.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to delete product.";
                }
            );
    },
});

// =========================================================
// ACTIONS
// =========================================================

export const {
    clearProduct,
    clearProductError,
    clearProductSuccess,
    setProductFilters,
} =
    sellerProductSlice.actions;

// =========================================================
// SELECTORS
// =========================================================

export const selectSellerProducts = (
    state
) =>
    state.sellerProducts?.products || [];

export const selectSellerProduct = (
    state
) =>
    state.sellerProducts?.product || null;

export const selectSellerProductLoading = (
    state
) =>
    state.sellerProducts?.loading || false;

export const selectSellerProductError = (
    state
) =>
    state.sellerProducts?.error || null;

export const selectSellerProductPagination = (
    state
) =>
    state.sellerProducts?.pagination || {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
    };

export default sellerProductSlice.reducer;
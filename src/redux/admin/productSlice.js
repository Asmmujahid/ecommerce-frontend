import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import productService from "../../Services/admin/productService";

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/
export const getProducts = createAsyncThunk(
    "adminProduct/getProducts",

    async (filters = {}, thunkAPI) => {
        try {
            return await productService.getProducts(
                filters
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch products"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/
export const getProduct = createAsyncThunk(
    "adminProduct/getProduct",

    async (id, thunkAPI) => {
        try {
            return await productService.getProduct(
                id
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch product"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/
export const createProduct = createAsyncThunk(
    "adminProduct/createProduct",

    async (productData, thunkAPI) => {
        try {
            return await productService.createProduct(
                productData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create product"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/
export const updateProduct = createAsyncThunk(
    "adminProduct/updateProduct",

    async (
        {
            id,
            productData,
        },
        thunkAPI
    ) => {
        try {
            return await productService.updateProduct({
                id,
                productData,
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update product"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/
export const deleteProduct = createAsyncThunk(
    "adminProduct/deleteProduct",

    async (id, thunkAPI) => {
        try {
            await productService.deleteProduct(id);

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/
const initialState = {
    products: [],

    product: null,

    loading: false,

    success: false,

    error: null,

    filters: {
        category: "",
        brand: "",
        status: "",
        featured: "",
        stock: "",
        owner_type: "",
    },
};

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/
const productSlice = createSlice({
    name: "adminProduct",

    initialState,

    reducers: {
        /*
        |--------------------------------------------------------------------------
        | Set Filters
        |--------------------------------------------------------------------------
        */
        setProductFilters: (
            state,
            action
        ) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        /*
        |--------------------------------------------------------------------------
        | Clear Filters
        |--------------------------------------------------------------------------
        */
        clearProductFilters: (
            state
        ) => {
            state.filters = {
                category: "",
                brand: "",
                status: "",
                featured: "",
                stock: "",
                owner_type: "",
            };
        },

        /*
        |--------------------------------------------------------------------------
        | Reset Product State
        |--------------------------------------------------------------------------
        */
        resetProductState: (
            state
        ) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.product = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Get Products
            |--------------------------------------------------------------------------
            */
            .addCase(
                getProducts.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                getProducts.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.products =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getProducts.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch products";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Get Single Product
            |--------------------------------------------------------------------------
            */
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
                    state.success = true;
                    state.error = null;

                    state.product =
                        action.payload?.data ||
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
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch product";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Create Product
            |--------------------------------------------------------------------------
            */
            .addCase(
                createProduct.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
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
                    state.error = null;

                    const newProduct =
                        action.payload?.data;

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
                        "Failed to create product";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Update Product
            |--------------------------------------------------------------------------
            */
            .addCase(
                updateProduct.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
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
                        action.payload?.data;

                    if (updatedProduct) {
                        state.products =
                            state.products.map(
                                (product) =>
                                    product.id ===
                                    updatedProduct.id
                                        ? updatedProduct
                                        : product
                            );

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
                        "Failed to update product";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | Delete Product
            |--------------------------------------------------------------------------
            */
            .addCase(
                deleteProduct.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
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
                    state.error = null;

                    state.products =
                        state.products.filter(
                            (product) =>
                                product.id !==
                                action.payload
                        );
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
                        "Failed to delete product";
                }
            );
    },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/
export const {
    resetProductState,
    setProductFilters,
    clearProductFilters,
} = productSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/
export const selectAdminProducts = (
    state
) =>
    state.adminProduct?.products || [];

export const selectAdminProduct = (
    state
) =>
    state.adminProduct?.product || null;

export const selectAdminProductLoading = (
    state
) =>
    state.adminProduct?.loading || false;

export const selectAdminProductError = (
    state
) =>
    state.adminProduct?.error || null;

export const selectAdminProductFilters = (
    state
) =>
    state.adminProduct?.filters || {
        category: "",
        brand: "",
        status: "",
        featured: "",
        stock: "",
        owner_type: "",
    };

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/
export default productSlice.reducer;



// src/redux/customer/cartSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getCart,
    addToCart as addToCartApi,
    getCartItem as getCartItemApi,
    updateCartItem as updateCartItemApi,
    removeCartItem as removeCartItemApi,
} from "../../Services/customer/cartService";

// =====================================================
// Initial State
// =====================================================

const initialState = {
    // Complete cart object
    cart: null,

    // Cart items
    items: [],

    // Total cart amount
    total: 0,

    // Currently selected cart item
    cartItem: null,

    // Loading states
    loading: false,
    addLoading: false,
    itemLoading: false,
    updateLoading: false,
    removeLoading: false,

    // Errors
    error: null,
    addError: null,
    itemError: null,
    updateError: null,
    removeError: null,

    // Success messages
    addSuccess: false,
    updateSuccess: false,
    removeSuccess: false,

    successMessage: null,
};

// =====================================================
// Get Customer Cart
// GET /api/customer/cart
// =====================================================

export const fetchCart = createAsyncThunk(
    "customerCart/fetchCart",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getCart();

            /*
             * Laravel response:
             *
             * {
             *     success: true,
             *     data: {
             *         id: 1,
             *         user_id: 1,
             *         items: [...]
             *     },
             *     total: 5000
             * }
             */

            const cart = response?.data?.data ?? null;

            return {
                cart,
                items: Array.isArray(cart?.items)
                    ? cart.items
                    : [],
                total: Number(response?.data?.total ?? 0),
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch cart."
            );
        }
    }
);

// =====================================================
// Add Product To Cart
// POST /api/customer/cart
// =====================================================

export const addToCart = createAsyncThunk(
    "customerCart/addToCart",

    async (
        {
            product_id,
            product_variant_id = null,
            quantity = 1,
        },
        { rejectWithValue }
    ) => {
        try {
            if (!product_id) {
                return rejectWithValue(
                    "Product ID is required."
                );
            }

            if (Number(quantity) < 1) {
                return rejectWithValue(
                    "Quantity must be at least 1."
                );
            }

            const response = await addToCartApi({
                product_id,
                product_variant_id,
                quantity: Number(quantity),
            });

            console.log(
                "ADD TO CART RESPONSE:",
                response.data
            );

            return {
                item: response?.data?.data ?? null,

                message:
                    response?.data?.message ||
                    "Product added to cart successfully.",
            };
        } catch (error) {
            console.error(
                "ADD TO CART ERROR:",
                error?.response?.data || error
            );

            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to add product to cart."
            );
        }
    }
);

// =====================================================
// Get Single Cart Item
// GET /api/customer/cart/{id}
// =====================================================

export const fetchCartItem = createAsyncThunk(
    "customerCart/fetchCartItem",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Cart item ID is required."
                );
            }

            const response = await getCartItemApi(id);

            return response?.data?.data ?? null;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch cart item."
            );
        }
    }
);

// =====================================================
// Update Cart Item Quantity
// PUT /api/customer/cart/{id}
// =====================================================

export const updateCartItem = createAsyncThunk(
    "customerCart/updateCartItem",

    async (
        { id, quantity },
        { rejectWithValue }
    ) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Cart item ID is required."
                );
            }

            if (!quantity || Number(quantity) < 1) {
                return rejectWithValue(
                    "Quantity must be at least 1."
                );
            }

            const response = await updateCartItemApi(
                id,
                Number(quantity)
            );

            return {
                item: response?.data?.data ?? null,
                message:
                    response?.data?.message ||
                    "Cart updated successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update cart."
            );
        }
    }
);

// =====================================================
// Remove Cart Item
// DELETE /api/customer/cart/{id}
// =====================================================

export const removeCartItem = createAsyncThunk(
    "customerCart/removeCartItem",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Cart item ID is required."
                );
            }

            const response =
                await removeCartItemApi(id);

            return {
                id,
                message:
                    response?.data?.message ||
                    "Item removed from cart successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to remove cart item."
            );
        }
    }
);

// =====================================================
// Slice
// =====================================================

const cartSlice = createSlice({
    name: "customerCart",

    initialState,

    reducers: {
        // -------------------------------------------------
        // Clear General Error
        // -------------------------------------------------

        clearCartError: (state) => {
            state.error = null;
            state.addError = null;
            state.itemError = null;
            state.updateError = null;
            state.removeError = null;
        },

        // -------------------------------------------------
        // Clear Add To Cart State
        // -------------------------------------------------

        clearAddCartState: (state) => {
            state.addError = null;
            state.addSuccess = false;
        },

        // -------------------------------------------------
        // Clear Update State
        // -------------------------------------------------

        clearUpdateCartState: (state) => {
            state.updateError = null;
            state.updateSuccess = false;
        },

        // -------------------------------------------------
        // Clear Remove State
        // -------------------------------------------------

        clearRemoveCartState: (state) => {
            state.removeError = null;
            state.removeSuccess = false;
        },

        // -------------------------------------------------
        // Clear Selected Cart Item
        // -------------------------------------------------

        clearCartItem: (state) => {
            state.cartItem = null;
            state.itemError = null;
        },

        // -------------------------------------------------
        // Clear Entire Cart
        // -------------------------------------------------

        clearCart: (state) => {
            state.cart = null;
            state.items = [];
            state.total = 0;
            state.error = null;
        },

        // -------------------------------------------------
        // Reset Cart State
        // -------------------------------------------------

        resetCart: () => initialState,
    },

    extraReducers: (builder) => {
        // =================================================
        // FETCH CART
        // =================================================

        builder

            .addCase(
                fetchCart.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchCart.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.cart =
                        action.payload?.cart ?? null;

                    state.items =
                        Array.isArray(
                            action.payload?.items
                        )
                            ? action.payload.items
                            : [];

                    state.total = Number(
                        action.payload?.total ?? 0
                    );

                    state.error = null;
                }
            )

            .addCase(
                fetchCart.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch cart.";
                }
            );

        // =================================================
        // ADD TO CART
        // =================================================

        builder

            .addCase(
                addToCart.pending,
                (state) => {
                    state.addLoading = true;
                    state.addError = null;
                    state.addSuccess = false;
                    state.successMessage = null;
                }
            )

            .addCase(
                addToCart.fulfilled,
                (state, action) => {
                    state.addLoading = false;

                    state.addSuccess = true;

                    state.addError = null;

                    state.successMessage =
                        action.payload?.message ||
                        "Product added to cart successfully.";

                    const newItem =
                        action.payload?.item;

                    if (newItem) {
                        /*
                         * If the same cart item already exists,
                         * update it instead of adding duplicate.
                         */

                        const existingIndex =
                            state.items.findIndex(
                                (item) =>
                                    item.id ===
                                    newItem.id
                            );

                        if (
                            existingIndex !== -1
                        ) {
                            state.items[
                                existingIndex
                            ] = newItem;
                        } else {
                            state.items.push(
                                newItem
                            );
                        }
                    }
                }
            )

            .addCase(
                addToCart.rejected,
                (state, action) => {
                    state.addLoading = false;

                    state.addSuccess = false;

                    state.addError =
                        action.payload ||
                        "Failed to add product to cart.";

                    state.successMessage = null;
                }
            );

        // =================================================
        // FETCH SINGLE CART ITEM
        // =================================================

        builder

            .addCase(
                fetchCartItem.pending,
                (state) => {
                    state.itemLoading = true;
                    state.itemError = null;
                    state.cartItem = null;
                }
            )

            .addCase(
                fetchCartItem.fulfilled,
                (state, action) => {
                    state.itemLoading = false;

                    state.cartItem =
                        action.payload ?? null;

                    state.itemError = null;
                }
            )

            .addCase(
                fetchCartItem.rejected,
                (state, action) => {
                    state.itemLoading = false;

                    state.itemError =
                        action.payload ||
                        "Failed to fetch cart item.";

                    state.cartItem = null;
                }
            );

        // =================================================
        // UPDATE CART ITEM
        // =================================================

        builder

            .addCase(
                updateCartItem.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                    state.updateSuccess = false;
                }
            )

            .addCase(
                updateCartItem.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateSuccess = true;

                    state.updateError = null;

                    state.successMessage =
                        action.payload?.message ||
                        "Cart updated successfully.";

                    const updatedItem =
                        action.payload?.item;

                    if (updatedItem) {
                        const index =
                            state.items.findIndex(
                                (item) =>
                                    item.id ===
                                    updatedItem.id
                            );

                        if (index !== -1) {
                            state.items[index] =
                                updatedItem;
                        }
                    }
                }
            )

            .addCase(
                updateCartItem.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateSuccess = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update cart.";
                }
            );

        // =================================================
        // REMOVE CART ITEM
        // =================================================

        builder

            .addCase(
                removeCartItem.pending,
                (state) => {
                    state.removeLoading = true;
                    state.removeError = null;
                    state.removeSuccess = false;
                }
            )

            .addCase(
                removeCartItem.fulfilled,
                (state, action) => {
                    state.removeLoading = false;

                    state.removeSuccess = true;

                    state.removeError = null;

                    state.successMessage =
                        action.payload?.message ||
                        "Item removed from cart successfully.";

                    const id =
                        action.payload?.id;

                    state.items =
                        state.items.filter(
                            (item) =>
                                item.id !== id
                        );
                }
            )

            .addCase(
                removeCartItem.rejected,
                (state, action) => {
                    state.removeLoading = false;

                    state.removeSuccess = false;

                    state.removeError =
                        action.payload ||
                        "Failed to remove cart item.";
                }
            );
    },
});

// =====================================================
// Actions
// =====================================================

export const {
    clearCartError,
    clearAddCartState,
    clearUpdateCartState,
    clearRemoveCartState,
    clearCartItem,
    clearCart,
    resetCart,
} = cartSlice.actions;

// =====================================================
// Selectors
// =====================================================

export const selectCart = (state) =>
    state.customerCart?.cart ?? null;

export const selectCartItems = (state) =>
    state.customerCart?.items ?? [];

export const selectCartTotal = (state) =>
    state.customerCart?.total ?? 0;

export const selectCartItem = (state) =>
    state.customerCart?.cartItem ?? null;

// =====================================================
// Loading Selectors
// =====================================================

export const selectCartLoading = (state) =>
    state.customerCart?.loading ?? false;

export const selectAddCartLoading = (state) =>
    state.customerCart?.addLoading ?? false;

export const selectCartItemLoading = (state) =>
    state.customerCart?.itemLoading ?? false;

export const selectUpdateCartLoading = (state) =>
    state.customerCart?.updateLoading ?? false;

export const selectRemoveCartLoading = (state) =>
    state.customerCart?.removeLoading ?? false;

// =====================================================
// Error Selectors
// =====================================================

export const selectCartError = (state) =>
    state.customerCart?.error ?? null;

export const selectAddCartError = (state) =>
    state.customerCart?.addError ?? null;

export const selectCartItemError = (state) =>
    state.customerCart?.itemError ?? null;

export const selectUpdateCartError = (state) =>
    state.customerCart?.updateError ?? null;

export const selectRemoveCartError = (state) =>
    state.customerCart?.removeError ?? null;

// =====================================================
// Success Selectors
// =====================================================

export const selectAddCartSuccess = (state) =>
    state.customerCart?.addSuccess ?? false;

export const selectUpdateCartSuccess = (state) =>
    state.customerCart?.updateSuccess ?? false;

export const selectRemoveCartSuccess = (state) =>
    state.customerCart?.removeSuccess ?? false;

export const selectCartSuccessMessage = (state) =>
    state.customerCart?.successMessage ?? null;

// =====================================================
// Cart Count
// =====================================================

export const selectCartCount = (state) => {
    const items = state.customerCart?.items ?? [];

    return items.reduce(
        (total, item) =>
            total + Number(item?.quantity ?? 0),
        0
    );
};

// =====================================================
// Reducer
// =====================================================

export default cartSlice.reducer;


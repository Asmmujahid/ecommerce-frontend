import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    getWishlist,
    getWishlistItem,
    addToWishlist as addToWishlistApi,
    removeFromWishlist as removeFromWishlistApi,
} from "../../Services/customer/wishlistService";

// =====================================================
// Initial State
// =====================================================

const initialState = {
    // All wishlist items
    items: [],

    // Single wishlist item
    item: null,

    // Loading states
    loading: false,
    itemLoading: false,
    addLoading: false,
    removeLoading: false,

    // Errors
    error: null,
    itemError: null,
    addError: null,
    removeError: null,

    // Success states
    addSuccess: false,
    removeSuccess: false,

    // Success message
    successMessage: null,
};

// =====================================================
// FETCH WISHLIST
// GET /api/customer/wishlists
// =====================================================

export const fetchWishlist = createAsyncThunk(
    "customerWishlist/fetchWishlist",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getWishlist();

            /*
            Expected Laravel response:

            {
                success: true,
                message: "Wishlist retrieved successfully",
                data: [...]
            }
            */

            return Array.isArray(response?.data?.data)
                ? response.data.data
                : [];
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch wishlist."
            );
        }
    }
);

// =====================================================
// FETCH SINGLE WISHLIST ITEM
// GET /api/customer/wishlists/{id}
// =====================================================

export const fetchWishlistItem = createAsyncThunk(
    "customerWishlist/fetchWishlistItem",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Wishlist item ID is required."
                );
            }

            const response =
                await getWishlistItem(id);

            return response?.data?.data ?? null;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch wishlist item."
            );
        }
    }
);

// =====================================================
// ADD TO WISHLIST
// POST /api/customer/wishlists
// =====================================================

export const addToWishlist = createAsyncThunk(
    "customerWishlist/addToWishlist",

    async (productId, { rejectWithValue }) => {
        try {
            if (!productId) {
                return rejectWithValue(
                    "Product ID is required."
                );
            }

            const response =
                await addToWishlistApi(productId);

            /*
            Expected Laravel response:

            {
                success: true,
                message: "...",
                data: {...}
            }
            */

            return {
                item: response?.data?.data ?? null,

                message:
                    response?.data?.message ||
                    "Product added to wishlist successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to add product to wishlist."
            );
        }
    }
);

// =====================================================
// REMOVE FROM WISHLIST
// DELETE /api/customer/wishlists/{id}
// =====================================================

export const removeFromWishlist =
    createAsyncThunk(
        "customerWishlist/removeFromWishlist",

        async (id, { rejectWithValue }) => {
            try {
                if (!id) {
                    return rejectWithValue(
                        "Wishlist item ID is required."
                    );
                }

                const response =
                    await removeFromWishlistApi(id);

                return {
                    id,

                    message:
                        response?.data?.message ||
                        "Product removed from wishlist successfully.",
                };
            } catch (error) {
                return rejectWithValue(
                    error?.response?.data?.message ||
                        error?.message ||
                        "Failed to remove product from wishlist."
                );
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const wishlistSlice = createSlice({
    name: "customerWishlist",

    initialState,

    reducers: {
        // =================================================
        // CLEAR ALL ERRORS
        // =================================================

        clearWishlistError: (state) => {
            state.error = null;
            state.itemError = null;
            state.addError = null;
            state.removeError = null;
        },

        // =================================================
        // CLEAR ADD STATE
        // =================================================

        clearAddWishlistState: (state) => {
            state.addError = null;
            state.addSuccess = false;
            state.successMessage = null;
        },

        // =================================================
        // CLEAR REMOVE STATE
        // =================================================

        clearRemoveWishlistState: (state) => {
            state.removeError = null;
            state.removeSuccess = false;
            state.successMessage = null;
        },

        // =================================================
        // CLEAR SINGLE ITEM
        // =================================================

        clearWishlistItem: (state) => {
            state.item = null;
            state.itemError = null;
        },

        // =================================================
        // CLEAR WISHLIST
        // =================================================

        clearWishlist: (state) => {
            state.items = [];
            state.item = null;

            state.error = null;
            state.itemError = null;

            state.successMessage = null;
        },

        // =================================================
        // RESET WISHLIST
        // =================================================

        resetWishlist: () => initialState,
    },

    extraReducers: (builder) => {
        // =================================================
        // FETCH WISHLIST
        // =================================================

        builder
            .addCase(
                fetchWishlist.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchWishlist.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.items =
                        Array.isArray(action.payload)
                            ? action.payload
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchWishlist.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch wishlist.";
                }
            );

        // =================================================
        // FETCH SINGLE WISHLIST ITEM
        // =================================================

        builder
            .addCase(
                fetchWishlistItem.pending,
                (state) => {
                    state.itemLoading = true;
                    state.itemError = null;
                    state.item = null;
                }
            )

            .addCase(
                fetchWishlistItem.fulfilled,
                (state, action) => {
                    state.itemLoading = false;

                    state.item =
                        action.payload ?? null;

                    state.itemError = null;
                }
            )

            .addCase(
                fetchWishlistItem.rejected,
                (state, action) => {
                    state.itemLoading = false;

                    state.itemError =
                        action.payload ||
                        "Failed to fetch wishlist item.";

                    state.item = null;
                }
            );

        // =================================================
        // ADD TO WISHLIST
        // =================================================

        builder
            .addCase(
                addToWishlist.pending,
                (state) => {
                    state.addLoading = true;
                    state.addError = null;
                    state.addSuccess = false;
                    state.successMessage = null;
                }
            )

            .addCase(
                addToWishlist.fulfilled,
                (state, action) => {
                    state.addLoading = false;
                    state.addSuccess = true;
                    state.addError = null;

                    state.successMessage =
                        action.payload?.message ||
                        "Product added to wishlist successfully.";

                    const newItem =
                        action.payload?.item;

                    if (newItem) {
                        const existingItem =
                            state.items.find(
                                (item) =>
                                    item.id ===
                                    newItem.id
                            );

                        if (!existingItem) {
                            state.items.push(newItem);
                        }
                    }
                }
            )

            .addCase(
                addToWishlist.rejected,
                (state, action) => {
                    state.addLoading = false;
                    state.addSuccess = false;

                    state.addError =
                        action.payload ||
                        "Failed to add product to wishlist.";

                    state.successMessage = null;
                }
            );

        // =================================================
        // REMOVE FROM WISHLIST
        // =================================================

        builder
            .addCase(
                removeFromWishlist.pending,
                (state) => {
                    state.removeLoading = true;
                    state.removeError = null;
                    state.removeSuccess = false;
                }
            )

            .addCase(
                removeFromWishlist.fulfilled,
                (state, action) => {
                    state.removeLoading = false;
                    state.removeSuccess = true;
                    state.removeError = null;

                    state.successMessage =
                        action.payload?.message ||
                        "Product removed from wishlist successfully.";

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
                removeFromWishlist.rejected,
                (state, action) => {
                    state.removeLoading = false;
                    state.removeSuccess = false;

                    state.removeError =
                        action.payload ||
                        "Failed to remove product from wishlist.";
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearWishlistError,
    clearAddWishlistState,
    clearRemoveWishlistState,
    clearWishlistItem,
    clearWishlist,
    resetWishlist,
} = wishlistSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectWishlist = (state) =>
    state.customerWishlist?.items ?? [];

export const selectWishlistItems = (state) =>
    state.customerWishlist?.items ?? [];

export const selectWishlistItem = (state) =>
    state.customerWishlist?.item ?? null;

export const selectWishlistLoading = (state) =>
    state.customerWishlist?.loading ?? false;

export const selectWishlistItemLoading = (state) =>
    state.customerWishlist?.itemLoading ?? false;

export const selectAddWishlistLoading = (state) =>
    state.customerWishlist?.addLoading ?? false;

export const selectRemoveWishlistLoading = (state) =>
    state.customerWishlist?.removeLoading ?? false;

export const selectWishlistError = (state) =>
    state.customerWishlist?.error ?? null;

export const selectWishlistItemError = (state) =>
    state.customerWishlist?.itemError ?? null;

export const selectAddWishlistError = (state) =>
    state.customerWishlist?.addError ?? null;

export const selectRemoveWishlistError = (state) =>
    state.customerWishlist?.removeError ?? null;

export const selectAddWishlistSuccess = (state) =>
    state.customerWishlist?.addSuccess ?? false;

export const selectRemoveWishlistSuccess = (state) =>
    state.customerWishlist?.removeSuccess ?? false;

export const selectWishlistSuccessMessage = (state) =>
    state.customerWishlist?.successMessage ?? null;

// =====================================================
// WISHLIST COUNT
// =====================================================

export const selectWishlistCount = (state) =>
    state.customerWishlist?.items?.length ?? 0;

// =====================================================
// REDUCER
// =====================================================

export default wishlistSlice.reducer;
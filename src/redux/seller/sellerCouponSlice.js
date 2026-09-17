// src/redux/seller/sellerCouponSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import sellerCouponService from "../../Services/seller/sellerCouponService";

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
    );
};

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    coupons: [],
    coupon: null,

    loading: false,

    /*
     * success is used ONLY for create/update/delete.
     *
     * GET coupons should NOT set success=true
     * because the listing page does not need a
     * success toast for fetching data.
     */
    success: false,

    error: null,
    message: "",
};

// =====================================================
// GET ALL SELLER COUPONS
// =====================================================

export const getCoupons = createAsyncThunk(
    "sellerCoupon/getCoupons",

    async (_, thunkAPI) => {
        try {
            const response =
                await sellerCouponService.getCoupons();

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// GET SINGLE SELLER COUPON
// =====================================================

export const getCoupon = createAsyncThunk(
    "sellerCoupon/getCoupon",

    async (id, thunkAPI) => {
        try {
            const response =
                await sellerCouponService.getCoupon(id);

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// CREATE SELLER COUPON
// =====================================================

export const createCoupon = createAsyncThunk(
    "sellerCoupon/createCoupon",

    async (data, thunkAPI) => {
        try {
            const response =
                await sellerCouponService.createCoupon(
                    data
                );

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// UPDATE SELLER COUPON
// =====================================================

export const updateCoupon = createAsyncThunk(
    "sellerCoupon/updateCoupon",

    async (
        { id, data },
        thunkAPI
    ) => {
        try {
            const response =
                await sellerCouponService.updateCoupon(
                    id,
                    data
                );

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// DELETE SELLER COUPON
// =====================================================

export const deleteCoupon = createAsyncThunk(
    "sellerCoupon/deleteCoupon",

    async (id, thunkAPI) => {
        try {
            await sellerCouponService.deleteCoupon(
                id
            );

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const sellerCouponSlice = createSlice({
    name: "sellerCoupon",

    initialState,

    reducers: {
        /*
        |--------------------------------------------------------------------------
        | Reset mutation state only
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | Do NOT clear coupons here.
        |
        */

        resetSellerCouponState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = "";
        },

        /*
        |--------------------------------------------------------------------------
        | Clear selected coupon
        |--------------------------------------------------------------------------
        */

        clearSelectedCoupon: (state) => {
            state.coupon = null;
        },

        /*
        |--------------------------------------------------------------------------
        | Clear error
        |--------------------------------------------------------------------------
        */

        clearSellerCouponError: (state) => {
            state.error = null;
        },

        /*
        |--------------------------------------------------------------------------
        | Clear message
        |--------------------------------------------------------------------------
        */

        clearSellerCouponMessage: (state) => {
            state.message = "";
            state.success = false;
        },
    },

    extraReducers: (builder) => {

        // =================================================
        // GET COUPONS
        // =================================================

        builder
            .addCase(
                getCoupons.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;

                    /*
                     * Do not clear existing coupons while
                     * loading.
                     */
                }
            )

            .addCase(
                getCoupons.fulfilled,
                (state, action) => {
                    state.loading = false;

                    /*
                     * IMPORTANT:
                     *
                     * GET is not a mutation.
                     * Therefore success MUST remain false.
                     */
                    state.success = false;

                    state.error = null;

                    state.coupons =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    /*
                     * Do not set message here.
                     *
                     * "Coupons retrieved successfully"
                     * does not need a toast.
                     */
                    state.message = "";
                }
            )

            .addCase(
                getCoupons.rejected,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch coupons.";

                    /*
                     * Keep existing coupons if a refresh
                     * fails.
                     */
                }
            );

        // =================================================
        // GET SINGLE COUPON
        // =================================================

        builder
            .addCase(
                getCoupon.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;
                }
            )

            .addCase(
                getCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error = null;

                    state.coupon =
                        action.payload?.data ??
                        null;

                    state.message = "";
                }
            )

            .addCase(
                getCoupon.rejected,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch coupon.";
                }
            );

        // =================================================
        // CREATE COUPON
        // =================================================

        builder
            .addCase(
                createCoupon.pending,
                (state) => {
                    state.loading = true;

                    state.success = false;

                    state.error = null;

                    state.message = "";
                }
            )

            .addCase(
                createCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.success = true;

                    state.error = null;

                    const coupon =
                        action.payload?.data;

                    if (coupon) {
                        /*
                         * Add newly created coupon immediately
                         * to the beginning of the list.
                         */
                        state.coupons.unshift(
                            coupon
                        );
                    }

                    state.message =
                        action.payload?.message ||
                        "Coupon created successfully.";
                }
            )

            .addCase(
                createCoupon.rejected,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to create coupon.";

                    state.message = "";
                }
            );

        // =================================================
        // UPDATE COUPON
        // =================================================

        builder
            .addCase(
                updateCoupon.pending,
                (state) => {
                    state.loading = true;

                    state.success = false;

                    state.error = null;

                    state.message = "";
                }
            )

            .addCase(
                updateCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.success = true;

                    state.error = null;

                    const updatedCoupon =
                        action.payload?.data;

                    if (updatedCoupon) {

                        state.coupon =
                            updatedCoupon;

                        state.coupons =
                            state.coupons.map(
                                (coupon) =>
                                    coupon.id ===
                                    updatedCoupon.id
                                        ? updatedCoupon
                                        : coupon
                            );
                    }

                    state.message =
                        action.payload?.message ||
                        "Coupon updated successfully.";
                }
            )

            .addCase(
                updateCoupon.rejected,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update coupon.";

                    state.message = "";
                }
            );

        // =================================================
        // DELETE COUPON
        // =================================================

        builder
            .addCase(
                deleteCoupon.pending,
                (state) => {
                    state.loading = true;

                    state.success = false;

                    state.error = null;

                    state.message = "";
                }
            )

            .addCase(
                deleteCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.success = true;

                    state.error = null;

                    /*
                     * Remove deleted coupon from Redux.
                     */
                    state.coupons =
                        state.coupons.filter(
                            (coupon) =>
                                coupon.id !==
                                action.payload
                        );

                    /*
                     * Clear selected coupon if it
                     * was deleted.
                     */
                    if (
                        state.coupon?.id ===
                        action.payload
                    ) {
                        state.coupon = null;
                    }

                    state.message =
                        "Coupon deleted successfully.";
                }
            )

            .addCase(
                deleteCoupon.rejected,
                (state, action) => {
                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to delete coupon.";

                    state.message = "";
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    resetSellerCouponState,
    clearSelectedCoupon,
    clearSellerCouponError,
    clearSellerCouponMessage,
} = sellerCouponSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectSellerCoupons = (
    state
) =>
    state.sellerCoupon?.coupons ?? [];

export const selectSellerCoupon = (
    state
) =>
    state.sellerCoupon?.coupon ?? null;

export const selectSellerCouponLoading = (
    state
) =>
    state.sellerCoupon?.loading ?? false;

export const selectSellerCouponSuccess = (
    state
) =>
    state.sellerCoupon?.success ?? false;

export const selectSellerCouponError = (
    state
) =>
    state.sellerCoupon?.error ?? null;

export const selectSellerCouponMessage = (
    state
) =>
    state.sellerCoupon?.message ?? "";

// =====================================================
// EXPORT REDUCER
// =====================================================

export default sellerCouponSlice.reducer;
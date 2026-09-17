// src/redux/admin/couponSlice.js

import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import couponService from "../../Services/admin/couponService";

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
    success: false,

    message: "",
    error: null,
};

// =====================================================
// GET ALL COUPONS
// =====================================================

export const getCoupons = createAsyncThunk(
    "adminCoupon/getCoupons",

    async (_, thunkAPI) => {
        try {
            return await couponService.getCoupons();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// GET SINGLE COUPON
// =====================================================

export const getCoupon = createAsyncThunk(
    "adminCoupon/getCoupon",

    async (id, thunkAPI) => {
        try {
            return await couponService.getCoupon(
                id
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// CREATE COUPON
// =====================================================

export const createCoupon = createAsyncThunk(
    "adminCoupon/createCoupon",

    async (couponData, thunkAPI) => {
        try {
            return await couponService.createCoupon(
                couponData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// UPDATE COUPON
// =====================================================

export const updateCoupon = createAsyncThunk(
    "adminCoupon/updateCoupon",

    async (
        { id, couponData },
        thunkAPI
    ) => {
        try {
            return await couponService.updateCoupon(
                {
                    id,
                    couponData,
                }
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error)
            );
        }
    }
);

// =====================================================
// DELETE COUPON
// =====================================================

export const deleteCoupon = createAsyncThunk(
    "adminCoupon/deleteCoupon",

    async (id, thunkAPI) => {
        try {
            await couponService.deleteCoupon(id);

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

const couponSlice = createSlice({
    name: "adminCoupon",

    initialState,

    reducers: {
        clearCoupon: (state) => {
            state.coupon = null;
        },

        clearCouponMessage: (state) => {
            state.message = "";
            state.success = false;
        },

        clearCouponError: (state) => {
            state.error = null;
        },

        resetCouponState: () => ({
            ...initialState,
        }),
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
                }
            )

            .addCase(
                getCoupons.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;

                    state.coupons =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    state.message =
                        action.payload?.message ||
                        "";
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
                }
            );

        // =================================================
        // GET COUPON
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
                    state.success = true;

                    state.coupon =
                        action.payload?.data ??
                        null;
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
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                createCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;

                    const newCoupon =
                        action.payload?.data;

                    if (newCoupon) {
                        state.coupons.unshift(
                            newCoupon
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
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                updateCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;

                    const updatedCoupon =
                        action.payload?.data;

                    if (updatedCoupon) {
                        state.coupons =
                            state.coupons.map(
                                (coupon) =>
                                    coupon.id ===
                                    updatedCoupon.id
                                        ? updatedCoupon
                                        : coupon
                            );

                        state.coupon =
                            updatedCoupon;
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
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                deleteCoupon.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;

                    state.coupons =
                        state.coupons.filter(
                            (coupon) =>
                                coupon.id !==
                                action.payload
                        );

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
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearCoupon,
    clearCouponMessage,
    clearCouponError,
    resetCouponState,
} = couponSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectAdminCoupons = (
    state
) =>
    state.adminCoupon?.coupons ?? [];

export const selectAdminCoupon = (
    state
) =>
    state.adminCoupon?.coupon ?? null;

export const selectAdminCouponLoading = (
    state
) =>
    state.adminCoupon?.loading ?? false;

export const selectAdminCouponSuccess = (
    state
) =>
    state.adminCoupon?.success ?? false;

export const selectAdminCouponError = (
    state
) =>
    state.adminCoupon?.error ?? null;

export const selectAdminCouponMessage = (
    state
) =>
    state.adminCoupon?.message ?? "";

export default couponSlice.reducer;
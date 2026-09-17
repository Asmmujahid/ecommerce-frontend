// src/redux/customer/checkoutSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import checkoutService from "../../Services/customer/checkoutService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    order: null,
    payment: null,

    loading: false,
    success: false,

    error: null,
    validationErrors: {},
};

// =====================================================
// PLACE ORDER
// =====================================================

export const placeOrder = createAsyncThunk(
    "customerCheckout/placeOrder",

    async (
        checkoutData,
        { rejectWithValue }
    ) => {
        try {
            const response =
                await checkoutService.placeOrder(
                    checkoutData
                );

            return response;
        } catch (error) {
            return rejectWithValue({
                status:
                    error?.response?.status ??
                    error?.status ??
                    null,

                message:
                    error?.response?.data
                        ?.message ||
                    error?.message ||
                    "Unable to place order.",

                errors:
                    error?.response?.data
                        ?.errors ||
                    error?.errors ||
                    {},
            });
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const checkoutSlice = createSlice({
    name: "customerCheckout",

    initialState,

    reducers: {
        // =================================================
        // CLEAR CHECKOUT
        // =================================================

        clearCheckout: (state) => {
            state.order = null;
            state.payment = null;

            state.loading = false;
            state.success = false;

            state.error = null;
            state.validationErrors = {};
        },

        // =================================================
        // CLEAR CHECKOUT ERROR
        // =================================================

        clearCheckoutError: (state) => {
            state.error = null;
            state.validationErrors = {};
        },

        // =================================================
        // RESET CHECKOUT
        // =================================================

        resetCheckout: () => ({
            ...initialState,
        }),
    },

    extraReducers: (builder) => {
        // =================================================
        // PLACE ORDER - PENDING
        // =================================================

        builder.addCase(
            placeOrder.pending,
            (state) => {
                state.loading = true;
                state.success = false;

                state.error = null;
                state.validationErrors = {};
            }
        );

        // =================================================
        // PLACE ORDER - SUCCESS
        // =================================================

        builder.addCase(
            placeOrder.fulfilled,
            (state, action) => {
                state.loading = false;
                state.success = true;

                state.error = null;
                state.validationErrors = {};

                state.order =
                    action.payload
                        ?.data
                        ?.order ??
                    null;

                state.payment =
                    action.payload
                        ?.data
                        ?.payment ??
                    null;
            }
        );

        // =================================================
        // PLACE ORDER - FAILED
        // =================================================

        builder.addCase(
            placeOrder.rejected,
            (state, action) => {
                state.loading = false;
                state.success = false;

                state.error =
                    action.payload
                        ?.message ||
                    "Unable to place order.";

                state.validationErrors =
                    action.payload
                        ?.errors ||
                    {};

                state.order = null;
                state.payment = null;
            }
        );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearCheckout,
    clearCheckoutError,
    resetCheckout,
} = checkoutSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectCheckoutOrder = (
    state
) =>
    state.customerCheckout
        ?.order ?? null;

export const selectCheckoutPayment = (
    state
) =>
    state.customerCheckout
        ?.payment ?? null;

export const selectCheckoutLoading = (
    state
) =>
    state.customerCheckout
        ?.loading ?? false;

export const selectCheckoutSuccess = (
    state
) =>
    state.customerCheckout
        ?.success ?? false;

export const selectCheckoutError = (
    state
) =>
    state.customerCheckout
        ?.error ?? null;

export const selectCheckoutValidationErrors = (
    state
) =>
    state.customerCheckout
        ?.validationErrors ?? {};

// =====================================================
// REDUCER
// =====================================================

export default checkoutSlice.reducer;
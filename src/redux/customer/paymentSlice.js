// src/redux/customer/paymentSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import paymentService from "../../services/customer/paymentService";

// =====================================================
// STABLE EMPTY ARRAY
// =====================================================

const EMPTY_ARRAY = [];

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    payments: [],
    selectedPayment: null,

    loading: false,
    detailsLoading: false,
    deleteLoading: false,

    deletingPaymentId: null,

    error: null,
    detailsError: null,
    deleteError: null,
};

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        error?.data?.message ||
        fallback
    );
};

// =====================================================
// NORMALIZE PAYMENT
// =====================================================

const normalizePayment = (payment) => {
    if (!payment || typeof payment !== "object") {
        return null;
    }

    return {
        ...payment,

        // Keep order exactly as returned by Laravel.
        order: payment.order || null,

        // Normalize numeric values without destroying
        // the original backend values.
        amount:
            payment.amount !== undefined &&
            payment.amount !== null
                ? Number(payment.amount)
                : 0,

        order_id:
            payment.order_id !== undefined &&
            payment.order_id !== null
                ? Number(payment.order_id)
                : payment.order_id,
    };
};

// =====================================================
// EXTRACT PAYMENT
// =====================================================

const extractPayment = (payload) => {
    if (!payload) {
        return null;
    }

    let payment = null;

    // Laravel:
    // {
    //   data: {
    //      payment: {...}
    //   }
    // }
    if (payload?.data?.payment) {
        payment = payload.data.payment;
    }

    // Laravel:
    // {
    //   data: {...payment}
    // }
    else if (
        payload?.data &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
    ) {
        payment = payload.data;
    }

    // {
    //   payment: {...}
    // }
    else if (payload?.payment) {
        payment = payload.payment;
    }

    // Direct payment object.
    else if (
        typeof payload === "object" &&
        !Array.isArray(payload)
    ) {
        payment = payload;
    }

    return normalizePayment(payment);
};

// =====================================================
// EXTRACT PAYMENT LIST
// =====================================================

const extractPayments = (payload) => {
    if (!payload) {
        return [];
    }

    let payments = [];

    if (Array.isArray(payload?.data)) {
        payments = payload.data;
    } else if (Array.isArray(payload?.data?.payments)) {
        payments = payload.data.payments;
    } else if (Array.isArray(payload?.payments)) {
        payments = payload.payments;
    } else if (Array.isArray(payload)) {
        payments = payload;
    }

    return payments
        .map(normalizePayment)
        .filter(Boolean);
};

// =====================================================
// FETCH ALL PAYMENTS
// =====================================================

export const fetchPayments = createAsyncThunk(
    "customerPayment/fetchPayments",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await paymentService.getPayments();

            console.log(
                "PAYMENTS API RESPONSE:",
                response
            );

            return response;
        } catch (error) {
            console.error(
                "FETCH PAYMENTS ERROR:",
                error
            );

            return rejectWithValue({
                message: getErrorMessage(
                    error,
                    "Unable to load payment history."
                ),

                status:
                    error?.response?.status ||
                    error?.status ||
                    null,

                errors:
                    error?.response?.data?.errors ||
                    error?.errors ||
                    {},
            });
        }
    }
);

// =====================================================
// FETCH PAYMENT BY ID
// =====================================================

export const fetchPaymentById =
    createAsyncThunk(
        "customerPayment/fetchPaymentById",

        async (id, { rejectWithValue }) => {
            try {
                if (
                    id === undefined ||
                    id === null ||
                    String(id).trim() === ""
                ) {
                    return rejectWithValue({
                        message:
                            "Payment ID is required.",
                        status: 422,
                        errors: {},
                    });
                }

                console.log(
                    "FETCHING PAYMENT ID:",
                    id
                );

                const response =
                    await paymentService.getPayment(id);

                console.log(
                    "PAYMENT DETAILS API RESPONSE:",
                    response
                );

                return response;
            } catch (error) {
                console.error(
                    "FETCH PAYMENT DETAILS ERROR:",
                    error
                );

                return rejectWithValue({
                    message: getErrorMessage(
                        error,
                        "Unable to load payment details."
                    ),

                    status:
                        error?.response?.status ||
                        error?.status ||
                        null,

                    errors:
                        error?.response?.data?.errors ||
                        error?.errors ||
                        {},
                });
            }
        }
    );

// =====================================================
// DELETE PAYMENT
// =====================================================

export const deletePayment =
    createAsyncThunk(
        "customerPayment/deletePayment",

        async (id, { rejectWithValue }) => {
            try {
                if (
                    id === undefined ||
                    id === null ||
                    String(id).trim() === ""
                ) {
                    return rejectWithValue({
                        message:
                            "Payment ID is required.",
                        status: 422,
                        errors: {},
                    });
                }

                console.log(
                    "DELETING PAYMENT ID:",
                    id
                );

                const response =
                    await paymentService.deletePayment(id);

                console.log(
                    "DELETE PAYMENT API RESPONSE:",
                    response
                );

                return {
                    id: Number(id),
                    response,
                };
            } catch (error) {
                console.error(
                    "DELETE PAYMENT ERROR:",
                    error
                );

                return rejectWithValue({
                    message: getErrorMessage(
                        error,
                        "Unable to delete payment."
                    ),

                    status:
                        error?.response?.status ||
                        error?.status ||
                        null,

                    errors:
                        error?.response?.data?.errors ||
                        error?.errors ||
                        {},
                });
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const paymentSlice = createSlice({
    name: "customerPayment",

    initialState,

    reducers: {
        // =============================================
        // CLEAR SELECTED PAYMENT
        // =============================================

        clearPayment: (state) => {
            state.selectedPayment = null;
            state.detailsError = null;
        },

        // =============================================
        // CLEAR ERRORS
        // =============================================

        clearPaymentError: (state) => {
            state.error = null;
            state.detailsError = null;
            state.deleteError = null;
        },

        // =============================================
        // CLEAR PAYMENTS
        // =============================================

        clearPayments: (state) => {
            state.payments = [];
            state.error = null;
        },

        // =============================================
        // CLEAR DELETE ERROR
        // =============================================

        clearDeletePaymentError: (state) => {
            state.deleteError = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // =========================================
            // FETCH PAYMENTS - PENDING
            // =========================================

            .addCase(
                fetchPayments.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // =========================================
            // FETCH PAYMENTS - FULFILLED
            // =========================================

            .addCase(
                fetchPayments.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const payments =
                        extractPayments(
                            action.payload
                        );

                    state.payments = payments;
                    state.error = null;

                    console.log(
                        "NORMALIZED PAYMENTS:",
                        payments
                    );
                }
            )

            // =========================================
            // FETCH PAYMENTS - REJECTED
            // =========================================

            .addCase(
                fetchPayments.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload?.message ||
                        action.error?.message ||
                        "Unable to load payments.";

                    state.payments = [];
                }
            )

            // =========================================
            // FETCH PAYMENT BY ID - PENDING
            // =========================================

            .addCase(
                fetchPaymentById.pending,
                (state) => {
                    state.detailsLoading = true;
                    state.detailsError = null;
                    state.selectedPayment = null;
                }
            )

            // =========================================
            // FETCH PAYMENT BY ID - FULFILLED
            // =========================================

            .addCase(
                fetchPaymentById.fulfilled,
                (state, action) => {
                    state.detailsLoading = false;

                    const payment =
                        extractPayment(
                            action.payload
                        );

                    state.selectedPayment =
                        payment;

                    state.detailsError =
                        payment
                            ? null
                            : "Payment was not found.";

                    console.log(
                        "NORMALIZED PAYMENT DETAILS:",
                        payment
                    );
                }
            )

            // =========================================
            // FETCH PAYMENT BY ID - REJECTED
            // =========================================

            .addCase(
                fetchPaymentById.rejected,
                (state, action) => {
                    state.detailsLoading = false;

                    state.detailsError =
                        action.payload?.message ||
                        action.error?.message ||
                        "Unable to load payment details.";

                    state.selectedPayment = null;
                }
            )

            // =========================================
            // DELETE PAYMENT - PENDING
            // =========================================

            .addCase(
                deletePayment.pending,
                (state, action) => {
                    state.deleteLoading = true;
                    state.deleteError = null;

                    state.deletingPaymentId =
                        Number(
                            action.meta.arg
                        );
                }
            )

            // =========================================
            // DELETE PAYMENT - FULFILLED
            // =========================================

            .addCase(
                deletePayment.fulfilled,
                (state, action) => {
                    state.deleteLoading = false;

                    const deletedId =
                        Number(
                            action.payload.id
                        );

                    state.payments =
                        state.payments.filter(
                            (payment) =>
                                Number(payment.id) !==
                                deletedId
                        );

                    if (
                        Number(
                            state.selectedPayment?.id
                        ) === deletedId
                    ) {
                        state.selectedPayment = null;
                    }

                    state.deletingPaymentId = null;
                    state.deleteError = null;
                }
            )

            // =========================================
            // DELETE PAYMENT - REJECTED
            // =========================================

            .addCase(
                deletePayment.rejected,
                (state, action) => {
                    state.deleteLoading = false;
                    state.deletingPaymentId = null;

                    state.deleteError =
                        action.payload?.message ||
                        action.error?.message ||
                        "Unable to delete payment.";
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearPayment,
    clearPaymentError,
    clearPayments,
    clearDeletePaymentError,
} = paymentSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectPayments = (state) =>
    state.customerPayment?.payments ??
    EMPTY_ARRAY;

export const selectSelectedPayment = (state) =>
    state.customerPayment?.selectedPayment ??
    null;

export const selectPayment = (state) =>
    state.customerPayment?.selectedPayment ??
    null;

export const selectPaymentsLoading = (state) =>
    state.customerPayment?.loading ??
    false;

export const selectPaymentsError = (state) =>
    state.customerPayment?.error ??
    null;

export const selectPaymentDetailsLoading =
    (state) =>
        state.customerPayment
            ?.detailsLoading ??
        false;

export const selectPaymentDetailsError =
    (state) =>
        state.customerPayment
            ?.detailsError ??
        null;

export const selectPaymentLoading = (state) =>
    state.customerPayment
        ?.detailsLoading ??
    false;

export const selectPaymentError = (state) =>
    state.customerPayment
        ?.detailsError ??
    null;

export const selectDeletePaymentLoading =
    (state) =>
        state.customerPayment
            ?.deleteLoading ??
        false;

export const selectDeletingPaymentId = (
    state
) =>
    state.customerPayment
        ?.deletingPaymentId ??
    null;

export const selectDeletePaymentError = (
    state
) =>
    state.customerPayment
        ?.deleteError ??
    null;

// =====================================================
// REDUCER
// =====================================================

export default paymentSlice.reducer;


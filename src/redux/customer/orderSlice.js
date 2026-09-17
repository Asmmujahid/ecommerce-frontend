// src/redux/customer/orderSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import orderService from "../../Services/customer/orderService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    orders: [],
    order: null,

    loading: false,
    detailsLoading: false,
    cancelLoading: false,
    deleteLoading: false,

    success: false,
    message: null,
    error: null,

    validationErrors: {},
};

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorPayload = (error) => {
    const responseData = error?.response?.data;

    return {
        message:
            responseData?.message ??
            error?.message ??
            "Something went wrong.",

        errors:
            responseData?.errors ?? {},
    };
};

// =====================================================
// FETCH ALL ORDERS
// =====================================================

export const fetchOrders = createAsyncThunk(
    "customerOrders/fetchOrders",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await orderService.getOrders();

            return {
                orders: Array.isArray(
                    response?.data
                )
                    ? response.data
                    : [],

                message:
                    response?.message ??
                    "Orders retrieved successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// FETCH SINGLE ORDER
// =====================================================

export const fetchOrder = createAsyncThunk(
    "customerOrders/fetchOrder",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message:
                        "Order ID is required.",
                    errors: {},
                });
            }

            const response =
                await orderService.getOrder(id);

            return {
                order:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Order retrieved successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = createAsyncThunk(
    "customerOrders/cancelOrder",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message:
                        "Order ID is required.",
                    errors: {},
                });
            }

            const response =
                await orderService.cancelOrder(id);

            return {
                order:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Order cancelled successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// UPDATE ORDER
// =====================================================

export const updateOrder = createAsyncThunk(
    "customerOrders/updateOrder",

    async (
        { id, orderData },
        { rejectWithValue }
    ) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message:
                        "Order ID is required.",
                    errors: {},
                });
            }

            if (
                !orderData ||
                typeof orderData !== "object"
            ) {
                return rejectWithValue({
                    message:
                        "Order data is required.",
                    errors: {},
                });
            }

            const response =
                await orderService.updateOrder(
                    id,
                    orderData
                );

            return {
                order:
                    response?.data ?? null,

                message:
                    response?.message ??
                    "Order updated successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// DELETE ORDER
// =====================================================

export const deleteOrder = createAsyncThunk(
    "customerOrders/deleteOrder",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    message:
                        "Order ID is required.",
                    errors: {},
                });
            }

            const response =
                await orderService.deleteOrder(id);

            return {
                id: id,

                message:
                    response?.message ??
                    "Order deleted successfully.",
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error)
            );
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const orderSlice = createSlice({
    name: "customerOrders",

    initialState,

    reducers: {
        clearOrderError: (state) => {
            state.error = null;
            state.validationErrors = {};
        },

        clearOrderSuccess: (state) => {
            state.success = false;
            state.message = null;
        },

        clearOrder: (state) => {
            state.order = null;
        },

        clearOrders: (state) => {
            state.orders = [];
        },

        resetOrderState: () => ({
            ...initialState,
        }),
    },

    extraReducers: (builder) => {
        // =================================================
        // FETCH ORDERS
        // =================================================

        builder
            .addCase(
                fetchOrders.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                fetchOrders.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.error = null;
                    state.validationErrors = {};

                    state.orders =
                        action.payload?.orders ?? [];

                    state.message =
                        action.payload?.message ??
                        "Orders retrieved successfully.";
                }
            )

            .addCase(
                fetchOrders.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to retrieve orders.";

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.message = null;
                }
            );

        // =================================================
        // FETCH SINGLE ORDER
        // =================================================

        builder
            .addCase(
                fetchOrder.pending,
                (state) => {
                    state.detailsLoading = true;
                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                fetchOrder.fulfilled,
                (state, action) => {
                    state.detailsLoading = false;
                    state.error = null;
                    state.validationErrors = {};

                    state.order =
                        action.payload?.order ??
                        null;

                    state.message =
                        action.payload?.message ??
                        "Order retrieved successfully.";
                }
            )

            .addCase(
                fetchOrder.rejected,
                (state, action) => {
                    state.detailsLoading = false;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to retrieve order.";

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.order = null;
                }
            );

        // =================================================
        // CANCEL ORDER
        // =================================================

        builder
            .addCase(
                cancelOrder.pending,
                (state) => {
                    state.cancelLoading = true;
                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                cancelOrder.fulfilled,
                (state, action) => {
                    state.cancelLoading = false;
                    state.success = true;
                    state.error = null;
                    state.validationErrors = {};

                    state.message =
                        action.payload?.message ??
                        "Order cancelled successfully.";

                    const updatedOrder =
                        action.payload?.order;

                    if (updatedOrder) {
                        // Update current order
                        if (
                            String(state.order?.id) ===
                            String(updatedOrder.id)
                        ) {
                            state.order =
                                updatedOrder;
                        }

                        // Update order in list
                        const index =
                            state.orders.findIndex(
                                (item) =>
                                    String(item.id) ===
                                    String(updatedOrder.id)
                            );

                        if (index !== -1) {
                            state.orders[index] =
                                updatedOrder;
                        }
                    }
                }
            )

            .addCase(
                cancelOrder.rejected,
                (state, action) => {
                    state.cancelLoading = false;
                    state.success = false;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to cancel the order.";

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.message = null;
                }
            );

        // =================================================
        // UPDATE ORDER
        // =================================================

        builder
            .addCase(
                updateOrder.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.validationErrors = {};
                }
            )

            .addCase(
                updateOrder.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;
                    state.validationErrors = {};

                    state.message =
                        action.payload?.message ??
                        "Order updated successfully.";

                    const updatedOrder =
                        action.payload?.order;

                    if (updatedOrder) {
                        if (
                            String(state.order?.id) ===
                            String(updatedOrder.id)
                        ) {
                            state.order =
                                updatedOrder;
                        }

                        const index =
                            state.orders.findIndex(
                                (item) =>
                                    String(item.id) ===
                                    String(updatedOrder.id)
                            );

                        if (index !== -1) {
                            state.orders[index] =
                                updatedOrder;
                        }
                    }
                }
            )

            .addCase(
                updateOrder.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to update order.";

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.message = null;
                }
            );

        // =================================================
        // DELETE ORDER
        // =================================================

        builder
            .addCase(
                deleteOrder.pending,
                (state) => {
                    state.deleteLoading = true;
                    state.error = null;
                    state.validationErrors = {};
                    state.success = false;
                }
            )

            .addCase(
                deleteOrder.fulfilled,
                (state, action) => {
                    state.deleteLoading = false;
                    state.success = true;
                    state.error = null;
                    state.validationErrors = {};

                    state.message =
                        action.payload?.message ??
                        "Order deleted successfully.";

                    const deletedId =
                        action.payload?.id;

                    // Remove from Redux immediately
                    state.orders =
                        state.orders.filter(
                            (item) =>
                                String(item.id) !==
                                String(deletedId)
                        );

                    // Clear current order
                    if (
                        String(state.order?.id) ===
                        String(deletedId)
                    ) {
                        state.order = null;
                    }
                }
            )

            .addCase(
                deleteOrder.rejected,
                (state, action) => {
                    state.deleteLoading = false;
                    state.success = false;

                    state.error =
                        action.payload?.message ??
                        action.error?.message ??
                        "Failed to delete order.";

                    state.validationErrors =
                        action.payload?.errors ?? {};

                    state.message = null;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearOrderError,
    clearOrderSuccess,
    clearOrder,
    clearOrders,
    resetOrderState,
} = orderSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectOrderState = (state) =>
    state.customerOrders ?? initialState;

export const selectOrders = (state) =>
    state.customerOrders?.orders ?? [];

export const selectOrder = (state) =>
    state.customerOrders?.order ?? null;

export const selectCurrentOrder = (state) =>
    state.customerOrders?.order ?? null;

export const selectOrdersLoading = (state) =>
    state.customerOrders?.loading ?? false;

export const selectOrderDetailsLoading = (
    state
) =>
    state.customerOrders?.detailsLoading ??
    false;

export const selectOrderLoading = (state) =>
    state.customerOrders?.detailsLoading ??
    false;

export const selectOrderCancelLoading = (
    state
) =>
    state.customerOrders?.cancelLoading ??
    false;

export const selectOrderDeleteLoading = (
    state
) =>
    state.customerOrders?.deleteLoading ??
    false;

export const selectOrderSuccess = (state) =>
    state.customerOrders?.success ?? false;

export const selectOrderMessage = (state) =>
    state.customerOrders?.message ?? null;

export const selectOrderError = (state) =>
    state.customerOrders?.error ?? null;

export const selectOrdersError = (state) =>
    state.customerOrders?.error ?? null;

export const selectOrderValidationErrors = (
    state
) =>
    state.customerOrders?.validationErrors ??
    {};

// =====================================================
// EXPORT
// =====================================================

export default orderSlice.reducer;


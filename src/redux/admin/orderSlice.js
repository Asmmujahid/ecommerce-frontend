// src/redux/admin/orderSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import orderService from "../../Services/admin/orderService";

// ======================================================
// Helpers
// ======================================================

const extractOrders = (payload) => {
    // ------------------------------------------
    // Direct array
    // ------------------------------------------

    if (Array.isArray(payload)) {
        return {
            data: payload,
            currentPage: 1,
            lastPage: 1,
            total: payload.length,
            perPage: payload.length || 10,
        };
    }

    // ------------------------------------------
    // Laravel paginated response
    //
    // {
    //     data: {
    //         data: [],
    //         current_page: 1,
    //         last_page: 3,
    //         total: 30,
    //         per_page: 10
    //     }
    // }
    // ------------------------------------------

    if (
        payload?.data &&
        !Array.isArray(payload.data) &&
        Array.isArray(payload.data.data)
    ) {
        return {
            data: payload.data.data,

            currentPage:
                Number(
                    payload.data.current_page
                ) || 1,

            lastPage:
                Number(
                    payload.data.last_page
                ) || 1,

            total:
                Number(
                    payload.data.total
                ) || 0,

            perPage:
                Number(
                    payload.data.per_page
                ) || 10,
        };
    }

    // ------------------------------------------
    // Simple response
    //
    // {
    //     data: []
    // }
    // ------------------------------------------

    if (Array.isArray(payload?.data)) {
        return {
            data: payload.data,

            currentPage:
                Number(
                    payload.current_page
                ) || 1,

            lastPage:
                Number(
                    payload.last_page
                ) || 1,

            total:
                Number(
                    payload.total
                ) || payload.data.length,

            perPage:
                Number(
                    payload.per_page
                ) ||
                payload.data.length ||
                10,
        };
    }

    // ------------------------------------------
    // orders property
    // ------------------------------------------

    if (Array.isArray(payload?.orders)) {
        return {
            data: payload.orders,
            currentPage: 1,
            lastPage: 1,
            total: payload.orders.length,
            perPage: payload.orders.length || 10,
        };
    }

    // ------------------------------------------
    // Empty
    // ------------------------------------------

    return {
        data: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    };
};

// ======================================================
// Extract Single Order
// ======================================================

const extractOrder = (payload) => {
    if (
        payload?.data &&
        !Array.isArray(payload.data)
    ) {
        return payload.data;
    }

    if (payload?.order) {
        return payload.order;
    }

    return payload || null;
};

// ======================================================
// Get All Orders
// ======================================================

export const getOrders = createAsyncThunk(
    "adminOrder/getOrders",

    async (params = {}, thunkAPI) => {
        try {
            return await orderService.getOrders(
                params
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to fetch orders."
            );
        }
    }
);

// ======================================================
// Get Single Order
// ======================================================

export const getOrder = createAsyncThunk(
    "adminOrder/getOrder",

    async (id, thunkAPI) => {
        try {
            return await orderService.getOrder(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to fetch order."
            );
        }
    }
);

// ======================================================
// Create Order
// ======================================================

export const createOrder = createAsyncThunk(
    "adminOrder/createOrder",

    async (orderData, thunkAPI) => {
        try {
            return await orderService.createOrder(
                orderData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to create order."
            );
        }
    }
);

// ======================================================
// Update Order
// ======================================================

export const updateOrder = createAsyncThunk(
    "adminOrder/updateOrder",

    async (
        { id, orderData },
        thunkAPI
    ) => {
        try {
            return await orderService.updateOrder(
                id,
                orderData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to update order."
            );
        }
    }
);

// ======================================================
// Delete Order
// ======================================================

export const deleteOrder = createAsyncThunk(
    "adminOrder/deleteOrder",

    async (id, thunkAPI) => {
        try {
            await orderService.deleteOrder(id);

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    "Failed to delete order."
            );
        }
    }
);

// ======================================================
// Initial State
// ======================================================

const initialState = {
    orders: [],
    order: null,

    loading: false,
    success: false,
    error: null,

    pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    },

    filters: {
        search: "",
        status: "",
        payment_status: "",
        page: 1,
        per_page: 10,
    },
};

// ======================================================
// Slice
// ======================================================

const orderSlice = createSlice({
    name: "adminOrder",

    initialState,

    reducers: {
        // ------------------------------------------
        // Reset State
        // ------------------------------------------

        resetOrderState: (state) => {
            state.order = null;
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        // ------------------------------------------
        // Clear Error
        // ------------------------------------------

        clearOrderError: (state) => {
            state.error = null;
        },

        // ------------------------------------------
        // Set Filters
        // ------------------------------------------

        setOrderFilters: (
            state,
            action
        ) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        // ------------------------------------------
        // Reset Filters
        // ------------------------------------------

        resetOrderFilters: (state) => {
            state.filters = {
                search: "",
                status: "",
                payment_status: "",
                page: 1,
                per_page: 10,
            };
        },

        // ------------------------------------------
        // Update Order In Redux List
        // ------------------------------------------

        updateOrderInList: (
            state,
            action
        ) => {
            const updatedOrder =
                action.payload;

            if (!updatedOrder?.id) {
                return;
            }

            const index =
                state.orders.findIndex(
                    (order) =>
                        order.id ===
                        updatedOrder.id
                );

            if (index !== -1) {
                state.orders[index] = {
                    ...state.orders[index],
                    ...updatedOrder,
                };
            }

            if (
                state.order?.id ===
                updatedOrder.id
            ) {
                state.order = {
                    ...state.order,
                    ...updatedOrder,
                };
            }
        },

        // ------------------------------------------
        // Remove Order From List
        // ------------------------------------------

        removeOrderFromList: (
            state,
            action
        ) => {
            const id = action.payload;

            state.orders =
                state.orders.filter(
                    (order) =>
                        order.id !== id
                );

            if (
                state.order?.id === id
            ) {
                state.order = null;
            }

            state.pagination.total =
                Math.max(
                    0,
                    state.pagination.total - 1
                );
        },
    },

    // ==================================================
    // Async Actions
    // ==================================================

    extraReducers: (builder) => {
        builder

            // ==================================================
            // GET ORDERS
            // ==================================================

            .addCase(
                getOrders.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                getOrders.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    const result =
                        extractOrders(
                            action.payload
                        );

                    state.orders =
                        result.data;

                    state.pagination = {
                        currentPage:
                            result.currentPage,

                        lastPage:
                            result.lastPage,

                        total:
                            result.total,

                        perPage:
                            result.perPage,
                    };

                    state.filters = {
                        ...state.filters,

                        page:
                            result.currentPage,

                        per_page:
                            result.perPage,
                    };
                }
            )

            .addCase(
                getOrders.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch orders.";
                }
            )

            // ==================================================
            // GET SINGLE ORDER
            // ==================================================

            .addCase(
                getOrder.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                getOrder.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.order =
                        extractOrder(
                            action.payload
                        );
                }
            )

            .addCase(
                getOrder.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch order.";
                }
            )

            // ==================================================
            // CREATE ORDER
            // ==================================================

            .addCase(
                createOrder.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                createOrder.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    const newOrder =
                        extractOrder(
                            action.payload
                        );

                    if (newOrder?.id) {
                        state.orders.unshift(
                            newOrder
                        );

                        state.pagination.total += 1;
                    }
                }
            )

            .addCase(
                createOrder.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to create order.";
                }
            )

            // ==================================================
            // UPDATE ORDER
            // ==================================================

            .addCase(
                updateOrder.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                updateOrder.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    const updatedOrder =
                        extractOrder(
                            action.payload
                        );

                    if (!updatedOrder?.id) {
                        return;
                    }

                    const index =
                        state.orders.findIndex(
                            (order) =>
                                order.id ===
                                updatedOrder.id
                        );

                    if (index !== -1) {
                        state.orders[index] = {
                            ...state.orders[index],
                            ...updatedOrder,
                        };
                    }

                    state.order =
                        updatedOrder;
                }
            )

            .addCase(
                updateOrder.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update order.";
                }
            )

            // ==================================================
            // DELETE ORDER
            // ==================================================

            .addCase(
                deleteOrder.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                deleteOrder.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    const id =
                        action.payload;

                    state.orders =
                        state.orders.filter(
                            (order) =>
                                order.id !== id
                        );

                    state.pagination.total =
                        Math.max(
                            0,
                            state.pagination.total -
                                1
                        );

                    if (
                        state.order?.id === id
                    ) {
                        state.order = null;
                    }
                }
            )

            .addCase(
                deleteOrder.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to delete order.";
                }
            );
    },
});

// ======================================================
// Actions
// ======================================================

export const {
    resetOrderState,
    clearOrderError,
    setOrderFilters,
    resetOrderFilters,
    updateOrderInList,
    removeOrderFromList,
} = orderSlice.actions;

// ======================================================
// Selectors
// ======================================================

export const selectAdminOrders = (
    state
) =>
    state.adminOrder?.orders || [];

export const selectAdminOrder = (
    state
) =>
    state.adminOrder?.order || null;

export const selectAdminOrderLoading = (
    state
) =>
    state.adminOrder?.loading || false;

export const selectAdminOrderError = (
    state
) =>
    state.adminOrder?.error || null;

export const selectAdminOrderSuccess = (
    state
) =>
    state.adminOrder?.success || false;

export const selectAdminOrderFilters = (
    state
) =>
    state.adminOrder?.filters || {
        search: "",
        status: "",
        payment_status: "",
        page: 1,
        per_page: 10,
    };

export const selectAdminOrderPagination = (
    state
) =>
    state.adminOrder?.pagination || {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    };

// ======================================================
// Export Reducer
// ======================================================

export default orderSlice.reducer;


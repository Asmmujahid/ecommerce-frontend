import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import sellerOrderService from "../../Services/seller/sellerOrderService";

// ======================================================
// Initial State
// ======================================================

const initialState = {
    orders: [],
    order: null,

    // Separate loading states
    ordersLoading: false,
    orderLoading: false,
    updateLoading: false,

    success: false,
    error: null,
    message: "",

    filters: {
        search: "",
        status: "all",
        payment_status: "all",
        page: 1,
        per_page: 10,
    },

    pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    },
};

// ======================================================
// Extract Orders Response
// ======================================================

const extractOrdersResponse = (payload) => {
    // Laravel pagination:
    // {
    //   data: {
    //      current_page,
    //      last_page,
    //      total,
    //      per_page,
    //      data: [...]
    //   }
    // }

    if (
        payload?.data &&
        !Array.isArray(payload.data) &&
        Array.isArray(payload.data.data)
    ) {
        return {
            orders: payload.data.data,

            pagination: {
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
            },
        };
    }

    // data array

    if (Array.isArray(payload?.data)) {
        return {
            orders: payload.data,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                total: payload.data.length,
                perPage:
                    payload.data.length || 10,
            },
        };
    }

    // orders property

    if (Array.isArray(payload?.orders)) {
        return {
            orders: payload.orders,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                total:
                    payload.orders.length,
                perPage:
                    payload.orders.length || 10,
            },
        };
    }

    // Direct array

    if (Array.isArray(payload)) {
        return {
            orders: payload,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                total: payload.length,
                perPage:
                    payload.length || 10,
            },
        };
    }

    // Empty

    return {
        orders: [],

        pagination: {
            currentPage: 1,
            lastPage: 1,
            total: 0,
            perPage: 10,
        },
    };
};

// ======================================================
// Extract Single Order
// ======================================================

const extractSingleOrder = (payload) => {
    // Example:
    // {
    //    success: true,
    //    data: {...}
    // }

    if (
        payload?.data &&
        !Array.isArray(payload.data)
    ) {
        return payload.data;
    }

    // Example:
    // {
    //    order: {...}
    // }

    if (payload?.order) {
        return payload.order;
    }

    // Direct object

    if (
        payload &&
        typeof payload === "object" &&
        !Array.isArray(payload)
    ) {
        return payload;
    }

    return null;
};

// ======================================================
// Error Helper
// ======================================================

const getErrorMessage = (
    error,
    fallback
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.errors
            ? JSON.stringify(
                  error?.response?.data?.errors
              )
            : error?.message ||
              fallback
    );
};

// ======================================================
// Fetch Seller Orders
// ======================================================

export const fetchSellerOrders =
    createAsyncThunk(
        "sellerOrders/fetchAll",

        async (
            params = {},
            thunkAPI
        ) => {
            try {
                return await sellerOrderService.getOrders(
                    params
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch seller orders."
                    )
                );
            }
        }
    );

// ======================================================
// Fetch Single Seller Order
// ======================================================

export const fetchSellerOrder =
    createAsyncThunk(
        "sellerOrders/fetchOne",

        async (
            id,
            thunkAPI
        ) => {
            try {
                if (!id) {
                    return thunkAPI.rejectWithValue(
                        "Order ID is required."
                    );
                }

                return await sellerOrderService.getOrder(
                    id
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch seller order."
                    )
                );
            }
        }
    );

// ======================================================
// Update Seller Order Status
// ======================================================

export const updateSellerOrderStatus =
    createAsyncThunk(
        "sellerOrders/updateStatus",

        async (
            { id, status },
            thunkAPI
        ) => {
            try {
                if (!id) {
                    return thunkAPI.rejectWithValue(
                        "Order ID is required."
                    );
                }

                if (!status) {
                    return thunkAPI.rejectWithValue(
                        "Order status is required."
                    );
                }

                return await sellerOrderService.updateOrderStatus(
                    id,
                    status
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to update order status."
                    )
                );
            }
        }
    );

// ======================================================
// Slice
// ======================================================

const sellerOrderSlice =
    createSlice({
        name: "sellerOrders",

        initialState,

        reducers: {
            // ==========================================
            // Reset State
            // ==========================================

            resetSellerOrderState: (
                state
            ) => {
                state.ordersLoading = false;
                state.orderLoading = false;
                state.updateLoading = false;

                state.success = false;
                state.error = null;
                state.message = "";
            },

            // ==========================================
            // Clear Single Order
            // ==========================================

            clearSellerOrder: (
                state
            ) => {
                state.order = null;
                state.orderLoading = false;
            },

            // ==========================================
            // Set Filters
            // ==========================================

            setSellerOrderFilters: (
                state,
                action
            ) => {
                state.filters = {
                    ...state.filters,
                    ...action.payload,
                };
            },

            // ==========================================
            // Reset Filters
            // ==========================================

            resetSellerOrderFilters: (
                state
            ) => {
                state.filters = {
                    search: "",
                    status: "all",
                    payment_status:
                        "all",
                    page: 1,
                    per_page: 10,
                };
            },

            // ==========================================
            // Clear Error
            // ==========================================

            clearSellerOrderError: (
                state
            ) => {
                state.error = null;
            },

            // ==========================================
            // Clear Message
            // ==========================================

            clearSellerOrderMessage: (
                state
            ) => {
                state.message = "";
            },

            // ==========================================
            // Update Order In List
            // ==========================================

            updateSellerOrderInList: (
                state,
                action
            ) => {
                const updated =
                    action.payload;

                if (!updated?.id) {
                    return;
                }

                const index =
                    state.orders.findIndex(
                        (order) =>
                            order.id ===
                            updated.id
                    );

                if (index !== -1) {
                    state.orders[index] = {
                        ...state.orders[index],
                        ...updated,
                    };
                }

                if (
                    state.order?.id ===
                    updated.id
                ) {
                    state.order = {
                        ...state.order,
                        ...updated,
                    };
                }
            },
        },

        // ==================================================
        // Extra Reducers
        // ==================================================

        extraReducers: (
            builder
        ) => {
            builder

                // ==========================================
                // FETCH ALL ORDERS - PENDING
                // ==========================================

                .addCase(
                    fetchSellerOrders.pending,
                    (state) => {
                        state.ordersLoading = true;

                        state.error = null;
                        state.success = false;
                    }
                )

                // ==========================================
                // FETCH ALL ORDERS - SUCCESS
                // ==========================================

                .addCase(
                    fetchSellerOrders.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.ordersLoading = false;

                        state.success = true;
                        state.error = null;

                        const result =
                            extractOrdersResponse(
                                action.payload
                            );

                        state.orders =
                            result.orders;

                        state.pagination =
                            result.pagination;

                        state.filters = {
                            ...state.filters,

                            page:
                                result
                                    .pagination
                                    .currentPage,

                            per_page:
                                result
                                    .pagination
                                    .perPage,
                        };
                    }
                )

                // ==========================================
                // FETCH ALL ORDERS - ERROR
                // ==========================================

                .addCase(
                    fetchSellerOrders.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.ordersLoading = false;

                        state.success = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch seller orders.";
                    }
                )

                // ==========================================
                // FETCH SINGLE ORDER - PENDING
                // ==========================================

                .addCase(
                    fetchSellerOrder.pending,
                    (state) => {
                        state.orderLoading = true;

                        state.error = null;
                        state.success = false;
                    }
                )

                // ==========================================
                // FETCH SINGLE ORDER - SUCCESS
                // ==========================================

                .addCase(
                    fetchSellerOrder.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.orderLoading = false;

                        state.success = true;
                        state.error = null;

                        const order =
                            extractSingleOrder(
                                action.payload
                            );

                        state.order =
                            order;

                        // Update list copy too
                        if (
                            order?.id
                        ) {
                            const index =
                                state.orders.findIndex(
                                    (item) =>
                                        item.id ===
                                        order.id
                                );

                            if (
                                index !== -1
                            ) {
                                state.orders[
                                    index
                                ] = {
                                    ...state
                                        .orders[
                                        index
                                    ],
                                    ...order,
                                };
                            }
                        }
                    }
                )

                // ==========================================
                // FETCH SINGLE ORDER - ERROR
                // ==========================================

                .addCase(
                    fetchSellerOrder.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.orderLoading = false;

                        state.success = false;

                        state.error =
                            action.payload ||
                            "Failed to fetch seller order.";
                    }
                )

                // ==========================================
                // UPDATE ORDER STATUS - PENDING
                // ==========================================

                .addCase(
                    updateSellerOrderStatus.pending,
                    (state) => {
                        state.updateLoading =
                            true;

                        state.error = null;
                        state.success = false;
                        state.message = "";
                    }
                )

                // ==========================================
                // UPDATE ORDER STATUS - SUCCESS
                // ==========================================

                .addCase(
                    updateSellerOrderStatus.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.updateLoading =
                            false;

                        state.success = true;
                        state.error = null;

                        state.message =
                            action.payload
                                ?.message ||
                            "Order status updated successfully.";

                        const updated =
                            extractSingleOrder(
                                action.payload
                            );

                        if (!updated?.id) {
                            return;
                        }

                        // Update current order
                        state.order =
                            updated;

                        // Update list
                        const index =
                            state.orders.findIndex(
                                (order) =>
                                    order.id ===
                                    updated.id
                            );

                        if (index !== -1) {
                            state.orders[
                                index
                            ] = {
                                ...state
                                    .orders[
                                    index
                                ],
                                ...updated,
                            };
                        }
                    }
                )

                // ==========================================
                // UPDATE ORDER STATUS - ERROR
                // ==========================================

                .addCase(
                    updateSellerOrderStatus.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.updateLoading =
                            false;

                        state.success = false;

                        state.error =
                            action.payload ||
                            "Failed to update order status.";
                    }
                );
        },
    });

// ======================================================
// Actions
// ======================================================

export const {
    resetSellerOrderState,
    clearSellerOrder,
    setSellerOrderFilters,
    resetSellerOrderFilters,
    clearSellerOrderError,
    clearSellerOrderMessage,
    updateSellerOrderInList,
} =
    sellerOrderSlice.actions;

// ======================================================
// Selectors
// ======================================================

export const selectSellerOrders = (
    state
) =>
    state.sellerOrders?.orders || [];

// List loading

export const selectSellerOrdersLoading = (
    state
) =>
    state.sellerOrders?.ordersLoading ||
    false;

// Single order

export const selectSellerOrder = (
    state
) =>
    state.sellerOrders?.order ||
    null;

// Single order loading

export const selectSellerOrderLoading = (
    state
) =>
    state.sellerOrders?.orderLoading ||
    false;

// Update loading

export const selectSellerOrderUpdateLoading = (
    state
) =>
    state.sellerOrders?.updateLoading ||
    false;

// Error

export const selectSellerOrderError = (
    state
) =>
    state.sellerOrders?.error ||
    null;

// Success

export const selectSellerOrderSuccess = (
    state
) =>
    state.sellerOrders?.success ||
    false;

// Message

export const selectSellerOrderMessage = (
    state
) =>
    state.sellerOrders?.message ||
    "";

// Filters

export const selectSellerOrderFilters = (
    state
) =>
    state.sellerOrders?.filters || {
        search: "",
        status: "all",
        payment_status: "all",
        page: 1,
        per_page: 10,
    };

// Pagination

export const selectSellerOrderPagination = (
    state
) =>
    state.sellerOrders?.pagination || {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    };

// ======================================================
// Export Reducer
// ======================================================

export default sellerOrderSlice.reducer;


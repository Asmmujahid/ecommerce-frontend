import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import dashboardService from "../../Services/customer/dashboardService";

// =====================================================
// Initial State
// =====================================================

const initialState = {
    dashboard: null,

    customer: null,

    statistics: {
        total_orders: 0,
        pending_orders: 0,
        processing_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        wishlist_items: 0,
        cart_items: 0,
        addresses: 0,
    },

    recentOrders: [],

    recentNotifications: [],

    loading: false,

    success: false,

    error: null,
};

// =====================================================
// Get Customer Dashboard
// =====================================================

export const getCustomerDashboard = createAsyncThunk(
    "customerDashboard/getCustomerDashboard",

    async (_, thunkAPI) => {
        try {
            const response =
                await dashboardService.getDashboard();

            return response;
        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to load customer dashboard.";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// =====================================================
// Dashboard Slice
// =====================================================

const dashboardSlice = createSlice({
    name: "customerDashboard",

    initialState,

    reducers: {

        // ---------------------------------------------
        // Clear dashboard error
        // ---------------------------------------------

        clearDashboardError: (state) => {
            state.error = null;
        },

        // ---------------------------------------------
        // Reset dashboard state
        // ---------------------------------------------

        resetDashboard: () => {
            return initialState;
        },
    },

    extraReducers: (builder) => {

        builder

            // =========================================
            // Pending
            // =========================================

            .addCase(
                getCustomerDashboard.pending,
                (state) => {

                    state.loading = true;

                    state.success = false;

                    state.error = null;
                }
            )

            // =========================================
            // Fulfilled
            // =========================================

            .addCase(
                getCustomerDashboard.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.success = true;

                    state.error = null;

                    // Complete dashboard response
                    state.dashboard = action.payload;

                    // Customer information
                    state.customer =
                        action.payload?.customer || null;

                    // Dashboard statistics
                    state.statistics =
                        action.payload?.statistics || {
                            total_orders: 0,
                            pending_orders: 0,
                            processing_orders: 0,
                            completed_orders: 0,
                            cancelled_orders: 0,
                            wishlist_items: 0,
                            cart_items: 0,
                            addresses: 0,
                        };

                    // Recent orders
                    state.recentOrders =
                        action.payload?.recent_orders || [];

                    // Recent notifications
                    state.recentNotifications =
                        action.payload?.recent_notifications || [];
                }
            )

            // =========================================
            // Rejected
            // =========================================

            .addCase(
                getCustomerDashboard.rejected,
                (state, action) => {

                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to load customer dashboard.";
                }
            );
    },
});

// =====================================================
// Export Actions
// =====================================================

export const {
    clearDashboardError,
    resetDashboard,
} = dashboardSlice.actions;

// =====================================================
// Export Reducer
// =====================================================

export default dashboardSlice.reducer;
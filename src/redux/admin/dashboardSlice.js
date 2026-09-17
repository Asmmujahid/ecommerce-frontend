import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardService from "../../Services/admin/dashboardService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    statistics: {},
    monthlySales: [],
    monthlyRevenue: [],
    recentOrders: [],
    recentUsers: [],
    loading: false,
    success: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| Async Thunks
|--------------------------------------------------------------------------
*/

/**
 * Get Admin Dashboard Statistics
 */
export const getDashboard = createAsyncThunk(
    "adminDashboard/getDashboard",
    async (_, thunkAPI) => {
        try {
            const response = await dashboardService.getDashboard();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load dashboard."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Dashboard Slice
|--------------------------------------------------------------------------
*/

const dashboardSlice = createSlice({
    name: "adminDashboard",

    initialState,

    reducers: {
        resetDashboardState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Get Dashboard
            |--------------------------------------------------------------------------
            */

            .addCase(getDashboard.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(getDashboard.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;

    state.statistics = action.payload.data.statistics;
    state.monthlySales = action.payload.data.monthly_sales;
    state.monthlyRevenue = action.payload.data.monthly_revenue;
    state.recentOrders = action.payload.data.recent_orders;
    state.recentUsers = action.payload.data.recent_users;
})

            .addCase(getDashboard.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export const { resetDashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
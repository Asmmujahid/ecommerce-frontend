import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerAnalyticsService from "../../Services/seller/sellerAnalyticsService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    analytics: null,

    loading: false,
    success: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| Get Seller Analytics
|--------------------------------------------------------------------------
*/

export const getAnalytics = createAsyncThunk(
    "sellerAnalytics/getAnalytics",
    async (_, thunkAPI) => {
        try {
            return await sellerAnalyticsService.getAnalytics();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message || error || "Failed to fetch analytics"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Seller Analytics Slice
|--------------------------------------------------------------------------
*/

const sellerAnalyticsSlice = createSlice({
    name: "sellerAnalytics",

    initialState,

    reducers: {
        resetSellerAnalyticsState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        clearAnalytics: (state) => {
            state.analytics = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Get Analytics
            |--------------------------------------------------------------------------
            */

            .addCase(getAnalytics.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(getAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.analytics = action.payload.data;
            })

            .addCase(getAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    resetSellerAnalyticsState,
    clearAnalytics,
} = sellerAnalyticsSlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default sellerAnalyticsSlice.reducer;
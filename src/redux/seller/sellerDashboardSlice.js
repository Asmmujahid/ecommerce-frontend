import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sellerDashboardService from "../../Services/seller/sellerDashboardService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    dashboard: null,

    loading: false,

    success: false,

    error: false,

    message: "",
};

/*
|--------------------------------------------------------------------------
| Get Seller Dashboard
|--------------------------------------------------------------------------
*/

export const getSellerDashboard = createAsyncThunk(
    "sellerDashboard/getDashboard",

    async (_, thunkAPI) => {
        try {
            return await sellerDashboardService.getDashboard();
        } catch (error) {
            const message =
                error?.message ||
                error?.error ||
                error?.response?.data?.message ||
                "Something went wrong";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerDashboardSlice = createSlice({
    name: "sellerDashboard",

    initialState,

    reducers: {
        resetSellerDashboardState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Pending
            |--------------------------------------------------------------------------
            */

            .addCase(getSellerDashboard.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = false;
                state.message = "";
            })

            /*
            |--------------------------------------------------------------------------
            | Fulfilled
            |--------------------------------------------------------------------------
            */

            .addCase(getSellerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.dashboard = action.payload.data;
            })

            /*
            |--------------------------------------------------------------------------
            | Rejected
            |--------------------------------------------------------------------------
            */

            .addCase(getSellerDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = true;

                state.message = action.payload;
            });
    },
});

/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
    resetSellerDashboardState,
} = sellerDashboardSlice.actions;

/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default sellerDashboardSlice.reducer;
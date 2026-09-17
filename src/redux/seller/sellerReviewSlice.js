import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import sellerReviewService from "../../Services/seller/sellerReviewService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    reviews: [],
    review: null,

    loading: false,
    success: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| Get All Reviews
|--------------------------------------------------------------------------
*/

export const getReviews = createAsyncThunk(
    "sellerReview/getReviews",
    async (_, thunkAPI) => {
        try {
            return await sellerReviewService.getReviews();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message || error || "Failed to fetch reviews"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Get Single Review
|--------------------------------------------------------------------------
*/

export const getReview = createAsyncThunk(
    "sellerReview/getReview",
    async (id, thunkAPI) => {
        try {
            return await sellerReviewService.getReview(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message || error || "Failed to fetch review"
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerReviewSlice = createSlice({
    name: "sellerReview",
    initialState,

    reducers: {
        resetSellerReviewState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },

        clearReview: (state) => {
            state.review = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | Get Reviews
            |--------------------------------------------------------------------------
            */

            .addCase(getReviews.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(getReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews = action.payload.data || [];
            })

            .addCase(getReviews.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | Get Review
            |--------------------------------------------------------------------------
            */

            .addCase(getReview.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(getReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.review = action.payload.data;
            })

            .addCase(getReview.rejected, (state, action) => {
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
    resetSellerReviewState,
    clearReview,
} = sellerReviewSlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default sellerReviewSlice.reducer;
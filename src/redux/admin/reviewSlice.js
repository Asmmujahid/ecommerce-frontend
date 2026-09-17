import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../../Services/admin/reviewService";

// ======================================================
// Get All Reviews
// ======================================================
export const getReviews = createAsyncThunk(
    "adminReview/getReviews",
    async (_, thunkAPI) => {
        try {
            return await reviewService.getReviews();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch reviews"
            );
        }
    }
);

// ======================================================
// Get Single Review
// ======================================================
export const getReview = createAsyncThunk(
    "adminReview/getReview",
    async (id, thunkAPI) => {
        try {
            return await reviewService.getReview(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch review"
            );
        }
    }
);

// ======================================================
// Update Review
// ======================================================
export const updateReview = createAsyncThunk(
    "adminReview/updateReview",
    async ({ id, reviewData }, thunkAPI) => {
        try {
            return await reviewService.updateReview(
                id,
                reviewData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to update review"
            );
        }
    }
);

// ======================================================
// Delete Review
// ======================================================
export const deleteReview = createAsyncThunk(
    "adminReview/deleteReview",
    async (id, thunkAPI) => {
        try {
            await reviewService.deleteReview(id);

            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    "Failed to delete review"
            );
        }
    }
);

// ======================================================
// Initial State
// ======================================================
const initialState = {
    reviews: [],
    review: null,

    loading: false,

    error: null,

    successMessage: null,
};

// ======================================================
// Slice
// ======================================================
const reviewSlice = createSlice({
    name: "adminReview",

    initialState,

    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        },

        clearReviewMessage: (state) => {
            state.successMessage = null;
        },

        clearCurrentReview: (state) => {
            state.review = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // Get Reviews
            // ==========================================
            .addCase(getReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                getReviews.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.reviews =
                        action.payload.data || [];
                }
            )

            .addCase(
                getReviews.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ==========================================
            // Get Review
            // ==========================================
            .addCase(getReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                getReview.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.review =
                        action.payload.data;
                }
            )

            .addCase(
                getReview.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ==========================================
            // Update Review
            // ==========================================
            .addCase(
                updateReview.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateReview.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const updatedReview =
                        action.payload.data;

                    state.review = updatedReview;

                    state.reviews =
                        state.reviews.map((review) =>
                            review.id ===
                            updatedReview.id
                                ? updatedReview
                                : review
                        );

                    state.successMessage =
                        action.payload.message ||
                        "Review updated successfully";
                }
            )

            .addCase(
                updateReview.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            )

            // ==========================================
            // Delete Review
            // ==========================================
            .addCase(
                deleteReview.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteReview.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.reviews =
                        state.reviews.filter(
                            (review) =>
                                review.id !==
                                action.payload
                        );

                    state.successMessage =
                        "Review deleted successfully";
                }
            )

            .addCase(
                deleteReview.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearReviewError,
    clearReviewMessage,
    clearCurrentReview,
} = reviewSlice.actions;

export default reviewSlice.reducer;
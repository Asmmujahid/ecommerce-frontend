
// src/redux/customer/reviewSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import api from "../../api/axios";

import reviewService from "../../Services/customer/reviewService";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_ARRAY = [];

// =====================================================
// HELPER
// =====================================================

const getErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;

    // Laravel normal message
    if (responseData?.message) {
        return responseData.message;
    }

    // Laravel validation errors
    if (responseData?.errors) {
        const errors = responseData.errors;

        const firstError = Object.values(errors)
            .flat()
            .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    // Axios error message
    if (error?.message) {
        return error.message;
    }

    return fallback;
};

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    // All customer reviews
    reviews: [],

    // Products that can still be reviewed
    reviewableProducts: [],

    // Currently selected single review
    review: null,

    // Loading states
    loading: false,
    reviewableLoading: false,
    submitting: false,
    updating: false,
    deleting: false,

    // Errors
    error: null,
    submitError: null,
    updateError: null,

    // Success
    success: false,
    message: null,
};

// =====================================================
// FETCH ALL REVIEWS
// =====================================================

export const fetchReviews = createAsyncThunk(
    "customerReview/fetchReviews",

    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(
                "/customer/reviews"
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch reviews."
                )
            );
        }
    }
);

// =====================================================
// FETCH REVIEWABLE PRODUCTS
// =====================================================

export const fetchReviewableProducts =
    createAsyncThunk(
        "customerReview/fetchReviewableProducts",

        async (_, { rejectWithValue }) => {
            try {
                const response = await api.get(
                    "/customer/reviews/reviewable-products"
                );

                return response.data;
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch reviewable products."
                    )
                );
            }
        }
    );

// =====================================================
// FETCH SINGLE REVIEW
// =====================================================

export const fetchReview = createAsyncThunk(
    "customerReview/fetchReview",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Review ID is required."
                );
            }

            const response = await api.get(
                `/customer/reviews/${id}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch review."
                )
            );
        }
    }
);

// =====================================================
// CREATE REVIEW
// =====================================================

export const createReview = createAsyncThunk(
    "customerReview/createReview",

    async (reviewData, { rejectWithValue }) => {
        try {
            if (!reviewData?.product_id) {
                return rejectWithValue(
                    "Product ID is required."
                );
            }

            if (!reviewData?.rating) {
                return rejectWithValue(
                    "Rating is required."
                );
            }

            const response = await api.post(
                "/customer/reviews",
                reviewData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to create review."
                )
            );
        }
    }
);

// =====================================================
// UPDATE REVIEW
// =====================================================

export const updateReview = createAsyncThunk(
    "customerReview/updateReview",

    async (
        { id, reviewData },
        { rejectWithValue }
    ) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Review ID is required."
                );
            }

            if (!reviewData?.rating) {
                return rejectWithValue(
                    "Rating is required."
                );
            }

            const response = await api.put(
                `/customer/reviews/${id}`,
                reviewData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to update review."
                )
            );
        }
    }
);

// =====================================================
// DELETE REVIEW
// =====================================================

export const deleteReview = createAsyncThunk(
    "customerReview/deleteReview",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue(
                    "Review ID is required."
                );
            }

            const response = await api.delete(
                `/customer/reviews/${id}`
            );

            return {
                id,
                ...response.data,
            };
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to delete review."
                )
            );
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const reviewSlice = createSlice({
    name: "customerReview",

    initialState,

    reducers: {
        // =================================================
        // CLEAR GENERAL ERROR
        // =================================================

        clearReviewError: (state) => {
            state.error = null;
            state.submitError = null;
            state.updateError = null;
        },

        // =================================================
        // CLEAR SUCCESS
        // =================================================

        clearReviewSuccess: (state) => {
            state.success = false;
            state.message = null;
        },

        // =================================================
        // CLEAR SELECTED REVIEW
        // =================================================

        clearSelectedReview: (state) => {
            state.review = null;
        },

        // =================================================
        // RESET COMPLETE REVIEW STATE
        // =================================================

        resetReviewState: () => {
            return {
                ...initialState,
            };
        },
    },

    // =====================================================
    // ASYNC ACTIONS
    // =====================================================

    extraReducers: (builder) => {
        // =================================================
        // FETCH REVIEWS
        // =================================================

        builder
            .addCase(
                fetchReviews.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchReviews.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.reviews =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchReviews.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch reviews.";

                    state.reviews = [];
                }
            );

        // =================================================
        // FETCH REVIEWABLE PRODUCTS
        // =================================================

        builder
            .addCase(
                fetchReviewableProducts.pending,
                (state) => {
                    state.reviewableLoading = true;

                    state.error = null;
                }
            )

            .addCase(
                fetchReviewableProducts.fulfilled,
                (state, action) => {
                    state.reviewableLoading =
                        false;

                    state.reviewableProducts =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchReviewableProducts.rejected,
                (state, action) => {
                    state.reviewableLoading =
                        false;

                    state.error =
                        action.payload ||
                        "Failed to load reviewable products.";

                    state.reviewableProducts = [];
                }
            );

        // =================================================
        // FETCH SINGLE REVIEW
        // =================================================

        builder
            .addCase(
                fetchReview.pending,
                (state) => {
                    state.loading = true;

                    state.error = null;

                    // Important:
                    // Remove old review while loading
                    // another review.
                    state.review = null;
                }
            )

            .addCase(
                fetchReview.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.review =
                        action.payload?.data ||
                        null;

                    state.error = null;
                }
            )

            .addCase(
                fetchReview.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch review.";

                    state.review = null;
                }
            );

        // =================================================
        // CREATE REVIEW
        // =================================================

        builder
            .addCase(
                createReview.pending,
                (state) => {
                    state.submitting = true;

                    state.submitError = null;

                    state.success = false;

                    state.message = null;
                }
            )

            .addCase(
                createReview.fulfilled,
                (state, action) => {
                    state.submitting = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Review added successfully.";

                    const newReview =
                        action.payload?.data;

                    if (newReview) {
                        // Add newest review at beginning
                        state.reviews.unshift(
                            newReview
                        );

                        // Remove product from
                        // reviewable products
                        state.reviewableProducts =
                            state.reviewableProducts.filter(
                                (product) =>
                                    Number(
                                        product.id
                                    ) !==
                                    Number(
                                        newReview.product_id
                                    )
                            );

                        // Set newly created review
                        // as selected review
                        state.review =
                            newReview;
                    }

                    state.submitError = null;
                }
            )

            .addCase(
                createReview.rejected,
                (state, action) => {
                    state.submitting = false;

                    state.submitError =
                        action.payload ||
                        "Failed to create review.";

                    state.success = false;

                    state.message = null;
                }
            );

        // =================================================
        // UPDATE REVIEW
        // =================================================

        builder
            .addCase(
                updateReview.pending,
                (state) => {
                    state.updating = true;

                    state.updateError = null;

                    state.success = false;

                    state.message = null;
                }
            )

            .addCase(
                updateReview.fulfilled,
                (state, action) => {
                    state.updating = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Review updated successfully.";

                    const updatedReview =
                        action.payload?.data;

                    if (updatedReview) {
                        // Update selected review
                        state.review =
                            updatedReview;

                        // Update review inside list
                        const index =
                            state.reviews.findIndex(
                                (item) =>
                                    Number(
                                        item.id
                                    ) ===
                                    Number(
                                        updatedReview.id
                                    )
                            );

                        if (index !== -1) {
                            state.reviews[index] =
                                updatedReview;
                        }
                    }

                    state.updateError = null;
                }
            )

            .addCase(
                updateReview.rejected,
                (state, action) => {
                    state.updating = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update review.";

                    state.success = false;

                    state.message = null;
                }
            );

        // =================================================
        // DELETE REVIEW
        // =================================================

        builder
            .addCase(
                deleteReview.pending,
                (state) => {
                    state.deleting = true;

                    state.error = null;

                    state.success = false;

                    state.message = null;
                }
            )

            .addCase(
                deleteReview.fulfilled,
                (state, action) => {
                    state.deleting = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Review deleted successfully.";

                    const deletedId =
                        action.payload?.id;

                    // Remove deleted review
                    state.reviews =
                        state.reviews.filter(
                            (review) =>
                                Number(
                                    review.id
                                ) !==
                                Number(
                                    deletedId
                                )
                        );

                    // Clear selected review if
                    // it was the deleted review
                    if (
                        state.review &&
                        Number(
                            state.review.id
                        ) ===
                            Number(
                                deletedId
                            )
                    ) {
                        state.review = null;
                    }

                    state.error = null;
                }
            )

            .addCase(
                deleteReview.rejected,
                (state, action) => {
                    state.deleting = false;

                    state.error =
                        action.payload ||
                        "Failed to delete review.";

                    state.success = false;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearReviewError,
    clearReviewSuccess,
    clearSelectedReview,
    resetReviewState,
} = reviewSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectReviews = (state) =>
    state.customerReview?.reviews ??
    EMPTY_ARRAY;

export const selectReviewableProducts = (
    state
) =>
    state.customerReview
        ?.reviewableProducts ??
    EMPTY_ARRAY;

export const selectReview = (state) =>
    state.customerReview?.review ??
    null;

export const selectReviewLoading = (
    state
) =>
    state.customerReview?.loading ??
    false;

export const selectReviewableLoading = (
    state
) =>
    state.customerReview
        ?.reviewableLoading ??
    false;

export const selectReviewSubmitting = (
    state
) =>
    state.customerReview?.submitting ??
    false;

export const selectReviewUpdating = (
    state
) =>
    state.customerReview?.updating ??
    false;

export const selectReviewDeleting = (
    state
) =>
    state.customerReview?.deleting ??
    false;

export const selectReviewError = (state) =>
    state.customerReview?.error ??
    null;

export const selectReviewSubmitError = (
    state
) =>
    state.customerReview?.submitError ??
    null;

export const selectReviewUpdateError = (
    state
) =>
    state.customerReview?.updateError ??
    null;

export const selectReviewSuccess = (
    state
) =>
    state.customerReview?.success ??
    false;

export const selectReviewMessage = (
    state
) =>
    state.customerReview?.message ??
    null;

// =====================================================
// REDUCER
// =====================================================

export default reviewSlice.reducer;


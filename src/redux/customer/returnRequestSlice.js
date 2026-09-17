
import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import returnRequestService from "../../Services/customer/returnRequestService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    returnRequests: [],
    returnRequest: null,
    returnableItems: [],

    loading: false,
    submitting: false,
    cancelling: false,
    returnableLoading: false,

    error: null,
    submitError: null,
    cancelError: null,

    success: false,
    message: null,
};

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorMessage = (
    error,
    fallbackMessage
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallbackMessage
    );
};

// =====================================================
// FETCH ALL RETURN REQUESTS
// =====================================================

export const fetchReturnRequests = createAsyncThunk(
    "customerReturn/fetchReturnRequests",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await returnRequestService.getReturnRequests();

            return response;
        } catch (error) {
            return rejectWithValue({
                status:
                    error?.response?.status || null,

                message: getErrorMessage(
                    error,
                    "Failed to fetch return requests."
                ),

                data:
                    error?.response?.data || null,
            });
        }
    }
);

// =====================================================
// FETCH RETURNABLE ITEMS
// =====================================================

export const fetchReturnableItems = createAsyncThunk(
    "customerReturn/fetchReturnableItems",

    async (_, { rejectWithValue }) => {
        try {
            const response =
                await returnRequestService.getReturnableItems();

            return response;
        } catch (error) {
            return rejectWithValue({
                status:
                    error?.response?.status || null,

                message: getErrorMessage(
                    error,
                    "Failed to fetch returnable products."
                ),

                data:
                    error?.response?.data || null,
            });
        }
    }
);

// =====================================================
// FETCH SINGLE RETURN REQUEST
// =====================================================

export const fetchReturnRequest = createAsyncThunk(
    "customerReturn/fetchReturnRequest",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    status: 400,
                    message:
                        "Return request ID is required.",
                    data: null,
                });
            }

            const response =
                await returnRequestService.getReturnRequest(
                    id
                );

            return response;
        } catch (error) {
            return rejectWithValue({
                status:
                    error?.response?.status || null,

                message: getErrorMessage(
                    error,
                    "Failed to fetch return request."
                ),

                data:
                    error?.response?.data || null,
            });
        }
    }
);

// =====================================================
// CREATE RETURN REQUEST
// =====================================================

export const createReturnRequest = createAsyncThunk(
    "customerReturn/createReturnRequest",

    async (returnData, { rejectWithValue }) => {
        try {
            // ---------------------------------------------
            // Frontend validation
            // ---------------------------------------------

            if (!returnData?.order_id) {
                return rejectWithValue({
                    status: 400,
                    message:
                        "Order ID is required.",
                    data: null,
                });
            }

            if (!returnData?.order_item_id) {
                return rejectWithValue({
                    status: 400,
                    message:
                        "Order item ID is required.",
                    data: null,
                });
            }

            if (!returnData?.reason?.trim()) {
                return rejectWithValue({
                    status: 400,
                    message:
                        "Return reason is required.",
                    data: null,
                });
            }

            const response =
                await returnRequestService.createReturnRequest(
                    {
                        order_id: Number(
                            returnData.order_id
                        ),

                        order_item_id: Number(
                            returnData.order_item_id
                        ),

                        reason:
                            returnData.reason.trim(),
                    }
                );

            return response;
        } catch (error) {
            const status =
                error?.response?.status || null;

            const data =
                error?.response?.data || null;

            let message = getErrorMessage(
                error,
                "Failed to submit return request."
            );

            // ---------------------------------------------
            // IMPORTANT:
            // Laravel returns 409 when a return request
            // already exists for the order item.
            // ---------------------------------------------

            if (status === 409) {
                message =
                    data?.message ||
                    "A return request has already been submitted for this product.";
            }

            return rejectWithValue({
                status,
                message,
                data,
            });
        }
    }
);

// =====================================================
// CANCEL RETURN REQUEST
// =====================================================

export const cancelReturnRequest = createAsyncThunk(
    "customerReturn/cancelReturnRequest",

    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                return rejectWithValue({
                    status: 400,
                    message:
                        "Return request ID is required.",
                    data: null,
                });
            }

            const response =
                await returnRequestService.cancelReturnRequest(
                    id
                );

            return {
                id,
                ...response,
            };
        } catch (error) {
            return rejectWithValue({
                status:
                    error?.response?.status || null,

                message: getErrorMessage(
                    error,
                    "Failed to cancel return request."
                ),

                data:
                    error?.response?.data || null,
            });
        }
    }
);

// =====================================================
// SLICE
// =====================================================

const returnRequestSlice = createSlice({
    name: "customerReturn",

    initialState,

    reducers: {
        // =============================================
        // CLEAR ERRORS
        // =============================================

        clearReturnError: (state) => {
            state.error = null;
            state.submitError = null;
            state.cancelError = null;
        },

        // =============================================
        // CLEAR SUCCESS
        // =============================================

        clearReturnSuccess: (state) => {
            state.success = false;
            state.message = null;
        },

        // =============================================
        // CLEAR SELECTED RETURN
        // =============================================

        clearSelectedReturnRequest: (state) => {
            state.returnRequest = null;
        },

        // =============================================
        // RESET STATE
        // =============================================

        resetReturnState: () => ({
            ...initialState,

            returnRequests: [],
            returnRequest: null,
            returnableItems: [],
        }),
    },

    // =================================================
    // EXTRA REDUCERS
    // =================================================

    extraReducers: (builder) => {
        // =================================================
        // FETCH ALL RETURN REQUESTS
        // =================================================

        builder

            .addCase(
                fetchReturnRequests.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchReturnRequests.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.returnRequests =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchReturnRequests.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload?.message ||
                        "Failed to fetch return requests.";
                }
            );

        // =================================================
        // FETCH RETURNABLE ITEMS
        // =================================================

        builder

            .addCase(
                fetchReturnableItems.pending,
                (state) => {
                    state.returnableLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchReturnableItems.fulfilled,
                (state, action) => {
                    state.returnableLoading = false;

                    state.returnableItems =
                        Array.isArray(
                            action.payload?.data
                        )
                            ? action.payload.data
                            : [];

                    state.error = null;
                }
            )

            .addCase(
                fetchReturnableItems.rejected,
                (state, action) => {
                    state.returnableLoading = false;

                    state.error =
                        action.payload?.message ||
                        "Failed to fetch returnable products.";

                    state.returnableItems = [];
                }
            );

        // =================================================
        // FETCH SINGLE RETURN REQUEST
        // =================================================

        builder

            .addCase(
                fetchReturnRequest.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.returnRequest = null;
                }
            )

            .addCase(
                fetchReturnRequest.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.returnRequest =
                        action.payload?.data ||
                        null;

                    state.error = null;
                }
            )

            .addCase(
                fetchReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload?.message ||
                        "Failed to fetch return request.";

                    state.returnRequest = null;
                }
            );

        // =================================================
        // CREATE RETURN REQUEST
        // =================================================

        builder

            .addCase(
                createReturnRequest.pending,
                (state) => {
                    state.submitting = true;

                    state.submitError = null;

                    state.success = false;

                    state.message = null;
                }
            )

            .addCase(
                createReturnRequest.fulfilled,
                (state, action) => {
                    state.submitting = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Return request submitted successfully.";

                    const newReturn =
                        action.payload?.data;

                    if (newReturn) {
                        // ---------------------------------
                        // Add new return request
                        // ---------------------------------

                        const alreadyExists =
                            state.returnRequests.some(
                                (item) =>
                                    Number(item.id) ===
                                    Number(
                                        newReturn.id
                                    )
                            );

                        if (!alreadyExists) {
                            state.returnRequests.unshift(
                                newReturn
                            );
                        }

                        // ---------------------------------
                        // Set selected return
                        // ---------------------------------

                        state.returnRequest =
                            newReturn;

                        // ---------------------------------
                        // Remove returned item from
                        // returnable items
                        // ---------------------------------

                        state.returnableItems =
                            state.returnableItems.filter(
                                (item) =>
                                    Number(
                                        item.id
                                    ) !==
                                    Number(
                                        newReturn.order_item_id
                                    )
                            );
                    }

                    state.submitError = null;
                }
            )

            .addCase(
                createReturnRequest.rejected,
                (state, action) => {
                    state.submitting = false;

                    const payload =
                        action.payload;

                    state.submitError =
                        payload?.message ||
                        (typeof payload ===
                        "string"
                            ? payload
                            : "Failed to submit return request.");

                    state.success = false;
                }
            );

        // =================================================
        // CANCEL RETURN REQUEST
        // =================================================

        builder

            .addCase(
                cancelReturnRequest.pending,
                (state) => {
                    state.cancelling = true;

                    state.cancelError = null;

                    state.success = false;

                    state.message = null;
                }
            )

            .addCase(
                cancelReturnRequest.fulfilled,
                (state, action) => {
                    state.cancelling = false;

                    state.success = true;

                    state.message =
                        action.payload?.message ||
                        "Return request cancelled successfully.";

                    const deletedId =
                        action.payload?.id;

                    // ---------------------------------
                    // Remove from return requests
                    // ---------------------------------

                    state.returnRequests =
                        state.returnRequests.filter(
                            (item) =>
                                Number(item.id) !==
                                Number(deletedId)
                        );

                    // ---------------------------------
                    // Clear selected request
                    // ---------------------------------

                    if (
                        Number(
                            state.returnRequest?.id
                        ) ===
                        Number(deletedId)
                    ) {
                        state.returnRequest = null;
                    }

                    state.cancelError = null;
                }
            )

            .addCase(
                cancelReturnRequest.rejected,
                (state, action) => {
                    state.cancelling = false;

                    state.cancelError =
                        action.payload?.message ||
                        "Failed to cancel return request.";

                    state.success = false;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearReturnError,
    clearReturnSuccess,
    clearSelectedReturnRequest,
    resetReturnState,
} = returnRequestSlice.actions;

// =====================================================
// SELECTORS
// =====================================================
//
// IMPORTANT:
// These selectors return existing Redux references.
// They do NOT create new arrays/objects.
// This avoids the React-Redux:
// "Selector unknown returned a different result"
// warning.
//

export const selectReturnRequests = (state) =>
    state.customerReturn?.returnRequests ?? [];

export const selectReturnRequest = (state) =>
    state.customerReturn?.returnRequest ?? null;

export const selectReturnableItems = (state) =>
    state.customerReturn?.returnableItems ?? [];

export const selectReturnLoading = (state) =>
    state.customerReturn?.loading ?? false;

export const selectReturnableLoading = (state) =>
    state.customerReturn?.returnableLoading ??
    false;

export const selectReturnSubmitting = (state) =>
    state.customerReturn?.submitting ?? false;

export const selectReturnCancelling = (state) =>
    state.customerReturn?.cancelling ?? false;

export const selectReturnError = (state) =>
    state.customerReturn?.error ?? null;

export const selectReturnSubmitError = (state) =>
    state.customerReturn?.submitError ?? null;

export const selectReturnCancelError = (state) =>
    state.customerReturn?.cancelError ?? null;

export const selectReturnSuccess = (state) =>
    state.customerReturn?.success ?? false;

export const selectReturnMessage = (state) =>
    state.customerReturn?.message ?? null;

// =====================================================
// REDUCER
// =====================================================

export default returnRequestSlice.reducer;


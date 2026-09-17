// src/redux/admin/returnRequestSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import returnRequestService from "../../Services/admin/returnRequestService";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    returnRequests: [],
    returnRequest: null,

    loading: false,
    fetching: false,
    updating: false,
    deleting: false,

    error: null,
    updateError: null,
    deleteError: null,

    success: false,
    successMessage: null,
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
// GET ALL RETURN REQUESTS
// =====================================================

export const getReturnRequests =
    createAsyncThunk(
        "adminReturnRequest/getReturnRequests",
        async (_, { rejectWithValue }) => {
            try {
                return await returnRequestService.getReturnRequests();
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch return requests."
                    )
                );
            }
        }
    );

// =====================================================
// GET SINGLE RETURN REQUEST
// =====================================================

export const getReturnRequest =
    createAsyncThunk(
        "adminReturnRequest/getReturnRequest",
        async (id, { rejectWithValue }) => {
            try {
                return await returnRequestService.getReturnRequest(
                    id
                );
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch return request."
                    )
                );
            }
        }
    );

// =====================================================
// UPDATE RETURN REQUEST
// =====================================================

export const updateReturnRequest =
    createAsyncThunk(
        "adminReturnRequest/updateReturnRequest",
        async (
            {
                id,
                returnRequestData,
            },
            { rejectWithValue }
        ) => {
            try {
                return await returnRequestService.updateReturnRequest(
                    id,
                    returnRequestData
                );
            } catch (error) {
                return rejectWithValue({
                    status:
                        error?.response?.status ||
                        null,

                    message: getErrorMessage(
                        error,
                        "Failed to update return request."
                    ),

                    errors:
                        error?.response?.data?.errors ||
                        null,
                });
            }
        }
    );

// =====================================================
// DELETE RETURN REQUEST
// =====================================================

export const deleteReturnRequest =
    createAsyncThunk(
        "adminReturnRequest/deleteReturnRequest",
        async (id, { rejectWithValue }) => {
            try {
                const response =
                    await returnRequestService.deleteReturnRequest(
                        id
                    );

                return {
                    id,
                    ...response,
                };
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to delete return request."
                    )
                );
            }
        }
    );

// =====================================================
// SLICE
// =====================================================

const returnRequestSlice = createSlice({
    name: "adminReturnRequest",

    initialState,

    reducers: {
        // =============================================
        // CLEAR ERROR
        // =============================================

        clearReturnRequestError: (state) => {
            state.error = null;
            state.updateError = null;
            state.deleteError = null;
        },

        // =============================================
        // CLEAR SUCCESS
        // =============================================

        clearReturnRequestMessage: (state) => {
            state.success = false;
            state.successMessage = null;
        },

        // =============================================
        // CLEAR CURRENT
        // =============================================

        clearCurrentReturnRequest: (state) => {
            state.returnRequest = null;
        },

        // =============================================
        // RESET
        // =============================================

        resetReturnRequestState: () => {
            return {
                ...initialState,
                returnRequests: [],
                returnRequest: null,
            };
        },
    },

    extraReducers: (builder) => {
        // =================================================
        // GET ALL
        // =================================================

        builder
            .addCase(
                getReturnRequests.pending,
                (state) => {
                    state.fetching = true;
                    state.error = null;
                }
            )

            .addCase(
                getReturnRequests.fulfilled,
                (state, action) => {
                    state.fetching = false;

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
                getReturnRequests.rejected,
                (state, action) => {
                    state.fetching = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch return requests.";

                    state.returnRequests = [];
                }
            );

        // =================================================
        // GET SINGLE
        // =================================================

        builder
            .addCase(
                getReturnRequest.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.returnRequest = null;
                }
            )

            .addCase(
                getReturnRequest.fulfilled,
                (state, action) => {
                    state.loading = false;

                    state.returnRequest =
                        action.payload?.data ||
                        null;

                    state.error = null;
                }
            )

            .addCase(
                getReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch return request.";

                    state.returnRequest = null;
                }
            );

        // =================================================
        // UPDATE
        // =================================================

        builder
            .addCase(
                updateReturnRequest.pending,
                (state) => {
                    state.updating = true;

                    state.updateError = null;

                    state.success = false;

                    state.successMessage = null;
                }
            )

            .addCase(
                updateReturnRequest.fulfilled,
                (state, action) => {
                    state.updating = false;

                    const updatedRequest =
                        action.payload?.data;

                    if (updatedRequest) {
                        state.returnRequest =
                            updatedRequest;

                        state.returnRequests =
                            state.returnRequests.map(
                                (request) =>
                                    Number(request.id) ===
                                    Number(
                                        updatedRequest.id
                                    )
                                        ? updatedRequest
                                        : request
                            );
                    }

                    state.success = true;

                    state.successMessage =
                        action.payload?.message ||
                        "Return request updated successfully.";

                    state.updateError = null;
                }
            )

            .addCase(
                updateReturnRequest.rejected,
                (state, action) => {
                    state.updating = false;

                    const payload =
                        action.payload;

                    if (
                        typeof payload ===
                        "object"
                    ) {
                        state.updateError =
                            payload?.message ||
                            "Failed to update return request.";
                    } else {
                        state.updateError =
                            payload ||
                            "Failed to update return request.";
                    }

                    state.success = false;
                }
            );

        // =================================================
        // DELETE
        // =================================================

        builder
            .addCase(
                deleteReturnRequest.pending,
                (state) => {
                    state.deleting = true;

                    state.deleteError = null;

                    state.success = false;

                    state.successMessage = null;
                }
            )

            .addCase(
                deleteReturnRequest.fulfilled,
                (state, action) => {
                    state.deleting = false;

                    const deletedId =
                        action.payload?.id;

                    state.returnRequests =
                        state.returnRequests.filter(
                            (request) =>
                                Number(request.id) !==
                                Number(deletedId)
                        );

                    if (
                        state.returnRequest &&
                        Number(
                            state.returnRequest.id
                        ) === Number(deletedId)
                    ) {
                        state.returnRequest = null;
                    }

                    state.success = true;

                    state.successMessage =
                        action.payload?.message ||
                        "Return request deleted successfully.";

                    state.deleteError = null;
                }
            )

            .addCase(
                deleteReturnRequest.rejected,
                (state, action) => {
                    state.deleting = false;

                    state.deleteError =
                        action.payload ||
                        "Failed to delete return request.";

                    state.success = false;
                }
            );
    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearReturnRequestError,
    clearReturnRequestMessage,
    clearCurrentReturnRequest,
    resetReturnRequestState,
} = returnRequestSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectAdminReturnRequests = (
    state
) =>
    state.adminReturnRequest
        ?.returnRequests ?? [];

export const selectAdminReturnRequest = (
    state
) =>
    state.adminReturnRequest
        ?.returnRequest ?? null;

export const selectAdminReturnLoading = (
    state
) =>
    state.adminReturnRequest
        ?.loading ?? false;

export const selectAdminReturnFetching = (
    state
) =>
    state.adminReturnRequest
        ?.fetching ?? false;

export const selectAdminReturnUpdating = (
    state
) =>
    state.adminReturnRequest
        ?.updating ?? false;

export const selectAdminReturnDeleting = (
    state
) =>
    state.adminReturnRequest
        ?.deleting ?? false;

export const selectAdminReturnError = (
    state
) =>
    state.adminReturnRequest
        ?.error ?? null;

export const selectAdminReturnUpdateError = (
    state
) =>
    state.adminReturnRequest
        ?.updateError ?? null;

export const selectAdminReturnDeleteError = (
    state
) =>
    state.adminReturnRequest
        ?.deleteError ?? null;

export const selectAdminReturnSuccess = (
    state
) =>
    state.adminReturnRequest
        ?.success ?? false;

export const selectAdminReturnSuccessMessage = (
    state
) =>
    state.adminReturnRequest
        ?.successMessage ?? null;

// =====================================================
// REDUCER
// =====================================================

export default returnRequestSlice.reducer;
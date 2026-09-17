import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import sellerReturnService from "../../services/seller/sellerReturnService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    returnRequests: [],
    returnRequest: null,

    loading: false,
    error: null,

    success: false,
    message: "",
};

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const getErrorMessage = (error) => {
    if (!error) {
        return "Something went wrong.";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error.message) {
        return error.message;
    }

    if (error.errors) {
        const firstError = Object.values(
            error.errors
        )[0];

        if (Array.isArray(firstError)) {
            return firstError[0];
        }

        return String(firstError);
    }

    return "Something went wrong.";
};

/*
|--------------------------------------------------------------------------
| Get All Return Requests
|--------------------------------------------------------------------------
*/

export const getReturnRequests =
    createAsyncThunk(
        "sellerReturn/getReturnRequests",

        async (_, thunkAPI) => {
            try {
                const response =
                    await sellerReturnService.getReturnRequests();

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(error)
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Get Single Return Request
|--------------------------------------------------------------------------
*/

export const getReturnRequest =
    createAsyncThunk(
        "sellerReturn/getReturnRequest",

        async (id, thunkAPI) => {
            try {
                const response =
                    await sellerReturnService.getReturnRequest(
                        id
                    );

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(error)
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Update Return Request
|--------------------------------------------------------------------------
*/

export const updateReturnRequest =
    createAsyncThunk(
        "sellerReturn/updateReturnRequest",

        async ({ id, data }, thunkAPI) => {
            try {
                const response =
                    await sellerReturnService.updateReturnRequest(
                        id,
                        data
                    );

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(error)
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Approve
|--------------------------------------------------------------------------
*/

export const approveReturnRequest =
    createAsyncThunk(
        "sellerReturn/approveReturnRequest",

        async (
            {
                id,
                adminNote = "",
            },
            thunkAPI
        ) => {
            try {
                const response =
                    await sellerReturnService.approveReturnRequest(
                        id,
                        adminNote
                    );

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(error)
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Reject
|--------------------------------------------------------------------------
*/

export const rejectReturnRequest =
    createAsyncThunk(
        "sellerReturn/rejectReturnRequest",

        async (
            {
                id,
                adminNote = "",
            },
            thunkAPI
        ) => {
            try {
                const response =
                    await sellerReturnService.rejectReturnRequest(
                        id,
                        adminNote
                    );

                return response;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(error)
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const sellerReturnSlice = createSlice({
    name: "sellerReturn",

    initialState,

    reducers: {
        resetSellerReturnState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = "";
        },

        clearReturnRequest: (state) => {
            state.returnRequest = null;
        },

        clearReturnError: (state) => {
            state.error = null;
        },

        clearReturnMessage: (state) => {
            state.message = "";
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder

            /*
            |--------------------------------------------------------------------------
            | GET ALL
            |--------------------------------------------------------------------------
            */

            .addCase(
                getReturnRequests.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getReturnRequests.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = false;
                    state.error = null;

                    state.returnRequests =
                        action.payload?.data || [];

                    state.message =
                        action.payload?.message || "";
                }
            )

            .addCase(
                getReturnRequests.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch return requests.";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | GET SINGLE
            |--------------------------------------------------------------------------
            */

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
                    state.success = false;
                    state.error = null;

                    state.returnRequest =
                        action.payload?.data || null;
                }
            )

            .addCase(
                getReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch return request.";

                    state.returnRequest = null;
                }
            )

            /*
            |--------------------------------------------------------------------------
            | UPDATE
            |--------------------------------------------------------------------------
            */

            .addCase(
                updateReturnRequest.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                    state.message = "";
                }
            )

            .addCase(
                updateReturnRequest.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.message =
                        action.payload?.message ||
                        "Return request updated successfully.";

                    const updatedRequest =
                        action.payload?.data;

                    if (updatedRequest) {
                        state.returnRequest =
                            updatedRequest;

                        state.returnRequests =
                            state.returnRequests.map(
                                (item) =>
                                    item.id ===
                                    updatedRequest.id
                                        ? updatedRequest
                                        : item
                            );
                    }
                }
            )

            .addCase(
                updateReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to update return request.";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | APPROVE
            |--------------------------------------------------------------------------
            */

            .addCase(
                approveReturnRequest.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                }
            )

            .addCase(
                approveReturnRequest.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.message =
                        action.payload?.message ||
                        "Return request approved.";

                    const updatedRequest =
                        action.payload?.data;

                    if (updatedRequest) {
                        state.returnRequest =
                            updatedRequest;

                        state.returnRequests =
                            state.returnRequests.map(
                                (item) =>
                                    item.id ===
                                    updatedRequest.id
                                        ? updatedRequest
                                        : item
                            );
                    }
                }
            )

            .addCase(
                approveReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to approve return request.";
                }
            )

            /*
            |--------------------------------------------------------------------------
            | REJECT
            |--------------------------------------------------------------------------
            */

            .addCase(
                rejectReturnRequest.pending,
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                }
            )

            .addCase(
                rejectReturnRequest.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.success = true;
                    state.error = null;

                    state.message =
                        action.payload?.message ||
                        "Return request rejected.";

                    const updatedRequest =
                        action.payload?.data;

                    if (updatedRequest) {
                        state.returnRequest =
                            updatedRequest;

                        state.returnRequests =
                            state.returnRequests.map(
                                (item) =>
                                    item.id ===
                                    updatedRequest.id
                                        ? updatedRequest
                                        : item
                            );
                    }
                }
            )

            .addCase(
                rejectReturnRequest.rejected,
                (state, action) => {
                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to reject return request.";
                }
            );
    },
});

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    resetSellerReturnState,
    clearReturnRequest,
    clearReturnError,
    clearReturnMessage,
} = sellerReturnSlice.actions;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default sellerReturnSlice.reducer;
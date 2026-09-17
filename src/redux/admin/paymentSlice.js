import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import paymentService from "../../Services/admin/paymentService";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/
const initialState = {
    payments: [],

    payment: null,

    earnings: null,

    loading: false,

    paymentsLoading: false,

    paymentLoading: false,

    earningsLoading: false,

    error: null,

    successMessage: null,

    pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
    },

    filters: {
        search: "",
        status: "",
        payment_method: "",
        page: 1,
        per_page: 10,
    },
};

/*
|--------------------------------------------------------------------------
| Error Helper
|--------------------------------------------------------------------------
*/
const getErrorMessage = (
    error,
    fallback = "Something went wrong."
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
};

/*
|--------------------------------------------------------------------------
| Axios Response Helper
|--------------------------------------------------------------------------
*/
const unwrapResponse = (payload) => {
    if (!payload) {
        return null;
    }

    /*
    |----------------------------------------------------------------------
    | Axios response object
    |----------------------------------------------------------------------
    */
    if (
        payload?.data &&
        payload?.config &&
        payload?.request
    ) {
        return payload.data;
    }

    return payload;
};

/*
|--------------------------------------------------------------------------
| Normalize Payment Object
|--------------------------------------------------------------------------
|
| This is important for transaction_id.
|
| Backend should normally return:
|
| transaction_id
|
| But if an older response returns:
|
| transactionId
|
| we convert it back to:
|
| transaction_id
|
*/
const normalizePayment = (payment) => {
    if (
        !payment ||
        typeof payment !== "object"
    ) {
        return null;
    }

    const transactionId =
        payment.transaction_id ??
        payment.transactionId ??
        null;

    const paymentMethod =
        payment.payment_method ??
        payment.paymentMethod ??
        null;

    return {
        ...payment,

        transaction_id:
            transactionId,

        payment_method:
            paymentMethod,
    };
};

/*
|--------------------------------------------------------------------------
| Extract Payments
|--------------------------------------------------------------------------
*/
const extractPayments = (payload) => {
    const response =
        unwrapResponse(payload);

    if (!response) {
        return {
            items: [],
            pagination: {
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
                total: 0,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Laravel paginator
    |--------------------------------------------------------------------------
    |
    | {
    |     success: true,
    |     data: {
    |         data: [],
    |         current_page: 1,
    |         last_page: 2,
    |         per_page: 10,
    |         total: 20
    |     }
    | }
    |
    */
    if (
        response.data &&
        typeof response.data ===
            "object" &&
        !Array.isArray(
            response.data
        ) &&
        Array.isArray(
            response.data.data
        )
    ) {
        const paginator =
            response.data;

        return {
            items:
                paginator.data.map(
                    normalizePayment
                ),

            pagination: {
                currentPage:
                    Number(
                        paginator.current_page
                    ) || 1,

                lastPage:
                    Number(
                        paginator.last_page
                    ) || 1,

                perPage:
                    Number(
                        paginator.per_page
                    ) || 10,

                total:
                    Number(
                        paginator.total
                    ) || 0,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Simple data array
    |--------------------------------------------------------------------------
    |
    | {
    |     data: [...]
    | }
    |
    */
    if (
        Array.isArray(
            response.data
        )
    ) {
        return {
            items:
                response.data.map(
                    normalizePayment
                ),

            pagination: {
                currentPage: 1,

                lastPage: 1,

                perPage:
                    response.data.length ||
                    10,

                total:
                    response.data.length,
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Direct array
    |--------------------------------------------------------------------------
    */
    if (
        Array.isArray(response)
    ) {
        return {
            items:
                response.map(
                    normalizePayment
                ),

            pagination: {
                currentPage: 1,

                lastPage: 1,

                perPage:
                    response.length ||
                    10,

                total:
                    response.length,
            },
        };
    }

    return {
        items: [],

        pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
        },
    };
};

/*
|--------------------------------------------------------------------------
| Extract Single Payment
|--------------------------------------------------------------------------
*/
const extractSinglePayment = (
    payload
) => {
    const response =
        unwrapResponse(payload);

    if (!response) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | {
    |     data: {
    |         payment: {...}
    |     }
    | }
    |--------------------------------------------------------------------------
    */
    if (
        response.data &&
        typeof response.data ===
            "object" &&
        !Array.isArray(
            response.data
        ) &&
        response.data.payment
    ) {
        return normalizePayment(
            response.data.payment
        );
    }

    /*
    |--------------------------------------------------------------------------
    | {
    |     payment: {...}
    | }
    |--------------------------------------------------------------------------
    */
    if (
        response.payment &&
        typeof response.payment ===
            "object"
    ) {
        return normalizePayment(
            response.payment
        );
    }

    /*
    |--------------------------------------------------------------------------
    | {
    |     data: {...payment}
    | }
    |--------------------------------------------------------------------------
    */
    if (
        response.data &&
        typeof response.data ===
            "object" &&
        !Array.isArray(
            response.data
        )
    ) {
        return normalizePayment(
            response.data
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Direct payment object
    |--------------------------------------------------------------------------
    */
    if (
        typeof response ===
            "object" &&
        !Array.isArray(response)
    ) {
        return normalizePayment(
            response
        );
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| Extract Earnings
|--------------------------------------------------------------------------
*/
const extractEarnings = (
    payload
) => {
    const response =
        unwrapResponse(payload);

    if (!response) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | {
    |     earnings: {...}
    | }
    |--------------------------------------------------------------------------
    */
    if (
        response.earnings &&
        typeof response.earnings ===
            "object" &&
        !Array.isArray(
            response.earnings
        )
    ) {
        return response.earnings;
    }

    /*
    |--------------------------------------------------------------------------
    | {
    |     data: {
    |         earnings: {...}
    |     }
    | }
    |--------------------------------------------------------------------------
    */
    if (
        response.data &&
        typeof response.data ===
            "object" &&
        !Array.isArray(
            response.data
        )
    ) {
        if (
            response.data.earnings &&
            typeof response.data
                .earnings ===
                "object"
        ) {
            return response.data
                .earnings;
        }

        /*
        |----------------------------------------------------------------------
        | Direct earnings object
        |----------------------------------------------------------------------
        */
        if (
            response.data
                .gross_sales !==
                undefined ||
            response.data
                .marketplace_commission !==
                undefined ||
            response.data
                .vendor_selling_fees !==
                undefined ||
            response.data
                .vendor_earnings !==
                undefined ||
            response.data
                .admin_net_earnings !==
                undefined
        ) {
            return response.data;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Direct earnings object
    |--------------------------------------------------------------------------
    */
    if (
        typeof response ===
            "object" &&
        !Array.isArray(response)
    ) {
        if (
            response.gross_sales !==
                undefined ||
            response.marketplace_commission !==
                undefined ||
            response.vendor_selling_fees !==
                undefined ||
            response.vendor_earnings !==
                undefined ||
            response.admin_net_earnings !==
                undefined
        ) {
            return response;
        }
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| GET PAYMENTS
|--------------------------------------------------------------------------
*/
export const getPayments =
    createAsyncThunk(
        "adminPayment/getPayments",

        async (
            params = {},
            thunkAPI
        ) => {
            try {
                return await paymentService.getPayments(
                    params
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch payments."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| GET SINGLE PAYMENT
|--------------------------------------------------------------------------
*/
export const getPayment =
    createAsyncThunk(
        "adminPayment/getPayment",

        async (id, thunkAPI) => {
            try {
                if (!id) {
                    return thunkAPI.rejectWithValue(
                        "Payment ID is required."
                    );
                }

                return await paymentService.getPayment(
                    id
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch payment."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| UPDATE PAYMENT
|--------------------------------------------------------------------------
*/
export const updatePayment =
    createAsyncThunk(
        "adminPayment/updatePayment",

        async (
            {
                id,
                paymentData,
            },
            thunkAPI
        ) => {
            try {
                if (!id) {
                    return thunkAPI.rejectWithValue(
                        "Payment ID is required."
                    );
                }

                if (
                    !paymentData ||
                    typeof paymentData !==
                        "object"
                ) {
                    return thunkAPI.rejectWithValue(
                        "Payment data is required."
                    );
                }

                return await paymentService.updatePayment(
                    id,
                    paymentData
                );
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to update payment."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| DELETE PAYMENT
|--------------------------------------------------------------------------
*/
export const deletePayment =
    createAsyncThunk(
        "adminPayment/deletePayment",

        async (id, thunkAPI) => {
            try {
                if (!id) {
                    return thunkAPI.rejectWithValue(
                        "Payment ID is required."
                    );
                }

                await paymentService.deletePayment(
                    id
                );

                return id;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to delete payment."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| GET ADMIN EARNINGS
|--------------------------------------------------------------------------
*/
export const getEarnings =
    createAsyncThunk(
        "adminPayment/getEarnings",

        async (_, thunkAPI) => {
            try {
                return await paymentService.getEarnings();
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    getErrorMessage(
                        error,
                        "Failed to fetch admin earnings."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/
const paymentSlice =
    createSlice({
        name: "adminPayment",

        initialState,

        reducers: {
            /*
            |--------------------------------------------------------------------------
            | Clear Error
            |--------------------------------------------------------------------------
            */
            clearPaymentError: (
                state
            ) => {
                state.error = null;
            },

            clearAdminPaymentError: (
                state
            ) => {
                state.error = null;
            },

            /*
            |--------------------------------------------------------------------------
            | Clear Success Message
            |--------------------------------------------------------------------------
            */
            clearPaymentMessage: (
                state
            ) => {
                state.successMessage =
                    null;
            },

            /*
            |--------------------------------------------------------------------------
            | Clear Current Payment
            |--------------------------------------------------------------------------
            */
            clearCurrentPayment: (
                state
            ) => {
                state.payment = null;
            },

            /*
            |--------------------------------------------------------------------------
            | Clear Payment
            |--------------------------------------------------------------------------
            */
            clearPayment: (
                state
            ) => {
                state.payment = null;
                state.error = null;
            },

            /*
            |--------------------------------------------------------------------------
            | Clear Earnings
            |--------------------------------------------------------------------------
            */
            clearEarnings: (
                state
            ) => {
                state.earnings = null;
            },

            /*
            |--------------------------------------------------------------------------
            | Set Filters
            |--------------------------------------------------------------------------
            */
            setPaymentFilters: (
                state,
                action
            ) => {
                state.filters = {
                    ...state.filters,
                    ...action.payload,
                };
            },

            /*
            |--------------------------------------------------------------------------
            | Reset Filters
            |--------------------------------------------------------------------------
            */
            resetPaymentFilters: (
                state
            ) => {
                state.filters = {
                    ...initialState.filters,
                };
            },

            /*
            |--------------------------------------------------------------------------
            | Reset State
            |--------------------------------------------------------------------------
            */
            resetPaymentState: () => ({
                ...initialState,
            }),
        },

        extraReducers: (
            builder
        ) => {
            /*
            |--------------------------------------------------------------------------
            | GET PAYMENTS
            |--------------------------------------------------------------------------
            */
            builder

                .addCase(
                    getPayments.pending,
                    (state) => {
                        state.loading = true;

                        state.paymentsLoading =
                            true;

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getPayments.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        const result =
                            extractPayments(
                                action.payload
                            );

                        state.loading =
                            false;

                        state.paymentsLoading =
                            false;

                        state.error =
                            null;

                        state.payments =
                            result.items;

                        state.pagination =
                            result.pagination;
                    }
                )

                .addCase(
                    getPayments.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.paymentsLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch payments.";

                        state.payments =
                            [];

                        state.pagination =
                            {
                                ...initialState.pagination,
                            };
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | GET SINGLE PAYMENT
            |--------------------------------------------------------------------------
            */
            builder

                .addCase(
                    getPayment.pending,
                    (state) => {
                        state.loading = true;

                        state.paymentLoading =
                            true;

                        state.error =
                            null;

                        state.payment =
                            null;
                    }
                )

                .addCase(
                    getPayment.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.paymentLoading =
                            false;

                        state.error =
                            null;

                        state.payment =
                            extractSinglePayment(
                                action.payload
                            );
                    }
                )

                .addCase(
                    getPayment.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.paymentLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch payment.";

                        state.payment =
                            null;
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | UPDATE PAYMENT
            |--------------------------------------------------------------------------
            */
            builder

                .addCase(
                    updatePayment.pending,
                    (state) => {
                        state.loading = true;

                        state.error =
                            null;

                        state.successMessage =
                            null;
                    }
                )

                .addCase(
                    updatePayment.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            null;

                        const updatedPayment =
                            extractSinglePayment(
                                action.payload
                            );

                        /*
                        |----------------------------------------------------------------------
                        | Update current payment
                        |----------------------------------------------------------------------
                        */
                        if (
                            updatedPayment?.id
                        ) {
                            state.payment =
                                updatedPayment;

                            /*
                            |------------------------------------------------------------------
                            | Update payment inside list
                            |------------------------------------------------------------------
                            */
                            state.payments =
                                state.payments.map(
                                    (
                                        payment
                                    ) =>
                                        payment.id ===
                                        updatedPayment.id
                                            ? {
                                                  ...payment,
                                                  ...updatedPayment,
                                              }
                                            : payment
                                );
                        }

                        /*
                        |----------------------------------------------------------------------
                        | Get success message from either:
                        |
                        | { message: "..." }
                        |
                        | or
                        |
                        | { data: { message: "..." } }
                        |----------------------------------------------------------------------
                        */
                        state.successMessage =
                            action.payload
                                ?.message ||
                            action.payload
                                ?.data
                                ?.message ||
                            "Payment updated successfully.";
                    }
                )

                .addCase(
                    updatePayment.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to update payment.";

                        state.successMessage =
                            null;
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | DELETE PAYMENT
            |--------------------------------------------------------------------------
            */
            builder

                .addCase(
                    deletePayment.pending,
                    (state) => {
                        state.loading = true;

                        state.error =
                            null;

                        state.successMessage =
                            null;
                    }
                )

                .addCase(
                    deletePayment.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            null;

                        const deletedId =
                            action.payload;

                        state.payments =
                            state.payments.filter(
                                (
                                    payment
                                ) =>
                                    payment.id !==
                                    deletedId
                            );

                        if (
                            state.payment?.id ===
                            deletedId
                        ) {
                            state.payment =
                                null;
                        }

                        if (
                            state.pagination
                                .total > 0
                        ) {
                            state.pagination.total -=
                                1;
                        }

                        state.successMessage =
                            "Payment deleted successfully.";
                    }
                )

                .addCase(
                    deletePayment.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.loading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to delete payment.";

                        state.successMessage =
                            null;
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | GET ADMIN EARNINGS
            |--------------------------------------------------------------------------
            */
            builder

                .addCase(
                    getEarnings.pending,
                    (state) => {
                        state.earningsLoading =
                            true;

                        state.error =
                            null;
                    }
                )

                .addCase(
                    getEarnings.fulfilled,
                    (
                        state,
                        action
                    ) => {
                        state.earningsLoading =
                            false;

                        state.error =
                            null;

                        const earnings =
                            extractEarnings(
                                action.payload
                            );

                        state.earnings =
                            earnings || {
                                gross_sales: 0,

                                marketplace_commission:
                                    0,

                                vendor_selling_fees:
                                    0,

                                vendor_earnings:
                                    0,

                                admin_net_earnings:
                                    0,

                                paid_earnings:
                                    0,

                                pending_earnings:
                                    0,

                                reversed_earnings:
                                    0,
                            };
                    }
                )

                .addCase(
                    getEarnings.rejected,
                    (
                        state,
                        action
                    ) => {
                        state.earningsLoading =
                            false;

                        state.error =
                            action.payload ||
                            "Failed to fetch admin earnings.";

                        state.earnings =
                            null;
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
    clearPaymentError,

    clearAdminPaymentError,

    clearPaymentMessage,

    clearCurrentPayment,

    clearPayment,

    clearEarnings,

    setPaymentFilters,

    resetPaymentFilters,

    resetPaymentState,
} =
    paymentSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/
export const selectAdminPayments = (
    state
) =>
    state.adminPayment?.payments ||
    [];

export const selectAdminPayment = (
    state
) =>
    state.adminPayment?.payment ||
    null;

export const selectAdminEarnings = (
    state
) =>
    state.adminPayment?.earnings ||
    null;

export const selectAdminPaymentLoading = (
    state
) =>
    state.adminPayment?.loading ||
    false;

export const selectAdminPaymentLoadingList =
    (state) =>
        state.adminPayment
            ?.paymentsLoading ||
        false;

export const selectAdminPaymentLoadingSingle =
    (state) =>
        state.adminPayment
            ?.paymentLoading ||
        false;

export const selectAdminEarningsLoading =
    (state) =>
        state.adminPayment
            ?.earningsLoading ||
        false;

export const selectAdminPaymentError = (
    state
) =>
    state.adminPayment?.error ||
    null;

export const selectAdminPaymentSuccessMessage =
    (state) =>
        state.adminPayment
            ?.successMessage ||
        null;

export const selectAdminPaymentPagination =
    (state) =>
        state.adminPayment
            ?.pagination || {
            currentPage: 1,
            lastPage: 1,
            perPage: 10,
            total: 0,
        };

export const selectAdminPaymentFilters = (
    state
) =>
    state.adminPayment?.filters || {
        search: "",
        status: "",
        payment_method: "",
        page: 1,
        per_page: 10,
    };

export default paymentSlice.reducer;


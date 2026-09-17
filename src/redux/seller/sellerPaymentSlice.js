// src/redux/seller/sellerPaymentSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import sellerPaymentService from "../../Services/seller/sellerPaymentService";

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
    success: false,

    pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10,
    },

    filters: {
        search: "",
        status: "",
        payment_status: "",
        page: 1,
        per_page: 10,
    },
};

/*
|--------------------------------------------------------------------------
| Default Pagination
|--------------------------------------------------------------------------
*/

const defaultPagination = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
};

/*
|--------------------------------------------------------------------------
| Default Earnings
|--------------------------------------------------------------------------
|
| These names match the accounting response used by the backend.
|
| vendor_earnings
|     = seller's total earning/net amount
|
| marketplace_commission
|     = admin commission from vendor-owned products
|
| vendor_selling_fees
|     = seller's selling/service fee from admin-owned products
|
|--------------------------------------------------------------------------
*/

const defaultEarnings = {
    gross_sales: 0,
    marketplace_commission: 0,
    vendor_selling_fees: 0,
    vendor_earnings: 0,

    paid_earnings: 0,
    pending_earnings: 0,
    reversed_earnings: 0,

    /*
     * Compatibility aliases.
     */
    gross_earnings: 0,
    admin_commission: 0,
    selling_service_fees: 0,
    total_vendor_earnings: 0,
    total_seller_earnings: 0,
    total_earnings: 0,
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
        error?.response?.data?.errors?.message ||
        error?.message ||
        fallback
    );
};

/*
|--------------------------------------------------------------------------
| Axios Response Detection
|--------------------------------------------------------------------------
*/

const unwrapAxiosResponse = (payload) => {
    /*
     * Axios response normally looks like:
     *
     * {
     *     data: {...},
     *     status: 200,
     *     headers: {...},
     *     config: {...},
     *     request: {...}
     * }
     *
     * Service methods may already return response.data.
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
| Extract Paginated Payments
|--------------------------------------------------------------------------
*/

const extractPaginatedPayments = (payload) => {
    const responseData = unwrapAxiosResponse(payload);

    if (!responseData) {
        return {
            items: [],
            pagination: {
                ...defaultPagination,
            },
        };
    }

    /*
     * Laravel paginator:
     *
     * {
     *     success: true,
     *     data: {
     *         data: [...],
     *         current_page: 1,
     *         last_page: 2,
     *         per_page: 10,
     *         total: 20
     *     }
     * }
     */

    const paginator =
        responseData?.data;

    if (
        paginator &&
        typeof paginator === "object" &&
        !Array.isArray(paginator) &&
        Array.isArray(paginator.data)
    ) {
        return {
            items: paginator.data,

            pagination: {
                currentPage:
                    Number(
                        paginator.current_page
                    ) || 1,

                lastPage:
                    Number(
                        paginator.last_page
                    ) || 1,

                total:
                    Number(
                        paginator.total
                    ) || 0,

                perPage:
                    Number(
                        paginator.per_page
                    ) || 10,
            },
        };
    }

    /*
     * Alternative:
     *
     * {
     *     data: [...]
     * }
     */

    if (Array.isArray(responseData?.data)) {
        return {
            items: responseData.data,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                total: responseData.data.length,
                perPage:
                    responseData.data.length || 10,
            },
        };
    }

    /*
     * Direct array.
     */

    if (Array.isArray(responseData)) {
        return {
            items: responseData,

            pagination: {
                currentPage: 1,
                lastPage: 1,
                total: responseData.length,
                perPage:
                    responseData.length || 10,
            },
        };
    }

    /*
     * No recognizable payment list.
     */

    return {
        items: [],
        pagination: {
            ...defaultPagination,
        },
    };
};

/*
|--------------------------------------------------------------------------
| Extract Single Payment
|--------------------------------------------------------------------------
*/

const extractSinglePayment = (payload) => {
    const responseData = unwrapAxiosResponse(payload);

    if (!responseData) {
        return null;
    }

    /*
     * {
     *     data: {
     *         payment: {...}
     *     }
     * }
     */

    if (
        responseData?.data &&
        typeof responseData.data === "object" &&
        !Array.isArray(responseData.data)
    ) {
        if (
            responseData.data.payment &&
            typeof responseData.data.payment === "object"
        ) {
            return responseData.data.payment;
        }

        return responseData.data;
    }

    /*
     * {
     *     payment: {...}
     * }
     */

    if (
        responseData?.payment &&
        typeof responseData.payment === "object"
    ) {
        return responseData.payment;
    }

    /*
     * Direct payment object.
     */

    if (
        typeof responseData === "object" &&
        !Array.isArray(responseData)
    ) {
        return responseData;
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| Extract Seller Earnings
|--------------------------------------------------------------------------
*/

const extractEarnings = (payload) => {
    const responseData = unwrapAxiosResponse(payload);

    if (!responseData) {
        return null;
    }

    /*
     * Standard backend response:
     *
     * {
     *     success: true,
     *     earnings: {
     *         gross_sales: 10000,
     *         marketplace_commission: 1000,
     *         vendor_selling_fees: 500,
     *         vendor_earnings: 9000,
     *         paid_earnings: 3000,
     *         pending_earnings: 6000,
     *         reversed_earnings: 0
     *     }
     * }
     */

    if (
        responseData?.earnings &&
        typeof responseData.earnings === "object" &&
        !Array.isArray(responseData.earnings)
    ) {
        return responseData.earnings;
    }

    /*
     * Alternative:
     *
     * {
     *     data: {
     *         earnings: {...}
     *     }
     * }
     */

    if (
        responseData?.data &&
        typeof responseData.data === "object" &&
        !Array.isArray(responseData.data)
    ) {
        if (
            responseData.data.earnings &&
            typeof responseData.data.earnings === "object"
        ) {
            return responseData.data.earnings;
        }

        /*
         * If data itself is the earnings object.
         */

        if (
            responseData.data.gross_sales !== undefined ||
            responseData.data.vendor_earnings !== undefined ||
            responseData.data.marketplace_commission !== undefined ||
            responseData.data.vendor_selling_fees !== undefined ||
            responseData.data.paid_earnings !== undefined ||
            responseData.data.pending_earnings !== undefined ||
            responseData.data.reversed_earnings !== undefined
        ) {
            return responseData.data;
        }
    }

    /*
     * Direct earnings object.
     */

    if (
        typeof responseData === "object" &&
        !Array.isArray(responseData)
    ) {
        if (
            responseData.gross_sales !== undefined ||
            responseData.vendor_earnings !== undefined ||
            responseData.marketplace_commission !== undefined ||
            responseData.vendor_selling_fees !== undefined ||
            responseData.paid_earnings !== undefined ||
            responseData.pending_earnings !== undefined ||
            responseData.reversed_earnings !== undefined
        ) {
            return responseData;
        }
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| GET SELLER PAYMENTS
|--------------------------------------------------------------------------
*/

export const getPayments = createAsyncThunk(
    "sellerPayment/getPayments",

    async (params = {}, thunkAPI) => {
        try {
            const response =
                await sellerPaymentService.getPayments(
                    params
                );

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch seller payments."
                )
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET SINGLE SELLER PAYMENT
|--------------------------------------------------------------------------
*/

export const getPayment = createAsyncThunk(
    "sellerPayment/getPayment",

    async (id, thunkAPI) => {
        try {
            if (!id) {
                return thunkAPI.rejectWithValue(
                    "Payment ID is required."
                );
            }

            const response =
                await sellerPaymentService.getPayment(
                    id
                );

            return response;
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
| GET SELLER EARNINGS
|--------------------------------------------------------------------------
*/

export const getEarnings = createAsyncThunk(
    "sellerPayment/getEarnings",

    async (params = {}, thunkAPI) => {
        try {
            const response =
                await sellerPaymentService.getEarnings(
                    params
                );

            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(
                    error,
                    "Failed to fetch seller earnings."
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

const sellerPaymentSlice = createSlice({
    name: "sellerPayment",

    initialState,

    reducers: {
        /*
        |--------------------------------------------------------------------------
        | Reset complete seller payment state
        |--------------------------------------------------------------------------
        */

        resetSellerPaymentState: () => ({
            ...initialState,

            pagination: {
                ...defaultPagination,
            },

            filters: {
                ...initialState.filters,
            },

            earnings: null,
        }),

        /*
        |--------------------------------------------------------------------------
        | Clear current payment
        |--------------------------------------------------------------------------
        */

        clearPayment: (state) => {
            state.payment = null;
        },

        /*
        |--------------------------------------------------------------------------
        | Clear earnings
        |--------------------------------------------------------------------------
        */

        clearEarnings: (state) => {
            state.earnings = null;
        },

        /*
        |--------------------------------------------------------------------------
        | Clear error
        |--------------------------------------------------------------------------
        */

        clearSellerPaymentError: (state) => {
            state.error = null;
        },

        /*
        |--------------------------------------------------------------------------
        | Clear success
        |--------------------------------------------------------------------------
        */

        clearSellerPaymentSuccess: (state) => {
            state.success = false;
        },

        /*
        |--------------------------------------------------------------------------
        | Set payment filters
        |--------------------------------------------------------------------------
        */

        setPaymentFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...(action.payload || {}),
            };
        },

        /*
        |--------------------------------------------------------------------------
        | Reset payment filters
        |--------------------------------------------------------------------------
        */

        resetPaymentFilters: (state) => {
            state.filters = {
                ...initialState.filters,
            };
        },
    },

    extraReducers: (builder) => {
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
                    state.paymentsLoading = true;
                    state.error = null;
                    state.success = false;
                }
            )

            .addCase(
                getPayments.fulfilled,
                (state, action) => {
                    const result =
                        extractPaginatedPayments(
                            action.payload
                        );

                    state.loading = false;
                    state.paymentsLoading = false;
                    state.success = true;
                    state.error = null;

                    state.payments =
                        result.items;

                    state.pagination = {
                        ...defaultPagination,
                        ...result.pagination,
                    };
                }
            )

            .addCase(
                getPayments.rejected,
                (state, action) => {
                    state.loading = false;
                    state.paymentsLoading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch payments.";

                    state.payments = [];

                    state.pagination = {
                        ...defaultPagination,
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
                    state.paymentLoading = true;
                    state.error = null;
                    state.success = false;
                    state.payment = null;
                }
            )

            .addCase(
                getPayment.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.paymentLoading = false;
                    state.success = true;
                    state.error = null;

                    state.payment =
                        extractSinglePayment(
                            action.payload
                        );
                }
            )

            .addCase(
                getPayment.rejected,
                (state, action) => {
                    state.loading = false;
                    state.paymentLoading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch payment.";

                    state.payment = null;
                }
            );

        /*
        |--------------------------------------------------------------------------
        | GET EARNINGS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                getEarnings.pending,
                (state) => {
                    state.earningsLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                getEarnings.fulfilled,
                (state, action) => {
                    state.earningsLoading = false;
                    state.success = true;
                    state.error = null;

                    const earnings =
                        extractEarnings(
                            action.payload
                        );

                    /*
                     * Backend is authoritative.
                     *
                     * Redux does NOT calculate:
                     *
                     * commission
                     * vendor percentage
                     * admin percentage
                     * net earnings
                     */

                    state.earnings =
                        earnings || {
                            ...defaultEarnings,
                        };
                }
            )

            .addCase(
                getEarnings.rejected,
                (state, action) => {
                    state.earningsLoading = false;
                    state.success = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch seller earnings.";

                    /*
                     * Keep previous earnings instead of
                     * destroying already-loaded dashboard data.
                     */

                    if (!state.earnings) {
                        state.earnings = null;
                    }
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
    resetSellerPaymentState,
    clearPayment,
    clearEarnings,
    clearSellerPaymentError,
    clearSellerPaymentSuccess,
    setPaymentFilters,
    resetPaymentFilters,
} = sellerPaymentSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectSellerPayments = (state) =>
    state.sellerPayment?.payments || [];

export const selectSellerPayment = (state) =>
    state.sellerPayment?.payment || null;

export const selectSellerEarnings = (state) =>
    state.sellerPayment?.earnings || null;

export const selectSellerPaymentLoading = (state) =>
    state.sellerPayment?.loading || false;

export const selectSellerPaymentsLoading = (state) =>
    state.sellerPayment?.paymentsLoading || false;

export const selectSellerPaymentLoadingSingle = (
    state
) =>
    state.sellerPayment?.paymentLoading || false;

export const selectSellerEarningsLoading = (
    state
) =>
    state.sellerPayment?.earningsLoading || false;

export const selectSellerPaymentError = (state) =>
    state.sellerPayment?.error || null;

export const selectSellerPaymentSuccess = (state) =>
    state.sellerPayment?.success || false;

export const selectSellerPaymentPagination = (
    state
) =>
    state.sellerPayment?.pagination || {
        ...defaultPagination,
    };

export const selectSellerPaymentFilters = (
    state
) =>
    state.sellerPayment?.filters || {
        ...initialState.filters,
    };

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default sellerPaymentSlice.reducer;


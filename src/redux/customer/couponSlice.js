// src/redux/customer/couponSlice.js

import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import couponService from "../../Services/customer/couponService";

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialState = {
    /*
    |--------------------------------------------------------------------------
    | AVAILABLE COUPONS
    |--------------------------------------------------------------------------
    */

    coupons: [],

    /*
    |--------------------------------------------------------------------------
    | SELECTED COUPON
    |--------------------------------------------------------------------------
    |
    | Coupon selected in the checkout UI.
    |
    | This is NOT the same as appliedCoupon.
    |
    */

    selectedCouponCode: "",

    /*
    |--------------------------------------------------------------------------
    | VALIDATED COUPON
    |--------------------------------------------------------------------------
    */

    validatedCoupon: null,

    /*
    |--------------------------------------------------------------------------
    | CURRENTLY APPLIED COUPON
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Only ONE coupon can exist here.
    |
    */

    appliedCoupon: null,

    /*
    |--------------------------------------------------------------------------
    | COUPON CALCULATION
    |--------------------------------------------------------------------------
    */

    eligibleProductIds: [],

    eligibleSubtotal: 0,

    discount: 0,

    finalEligibleAmount: 0,

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    loading: false,

    applying: false,

    /*
    |--------------------------------------------------------------------------
    | ERRORS
    |--------------------------------------------------------------------------
    */

    error: null,

    applyError: null,

    /*
    |--------------------------------------------------------------------------
    | MESSAGE
    |--------------------------------------------------------------------------
    */

    message: null,
};

/*
|--------------------------------------------------------------------------
| ERROR MESSAGE
|--------------------------------------------------------------------------
*/

const getErrorMessage = (
    error,
    fallback = "Something went wrong."
) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.errors?.code?.[0] ||
        error?.message ||
        fallback
    );
};

/*
|--------------------------------------------------------------------------
| GET PAYLOAD DATA
|--------------------------------------------------------------------------
|
| Supports responses such as:
|
| {
|     success: true,
|     data: {
|         coupon: {...},
|         discount_amount: 1000
|     }
| }
|
| and:
|
| {
|     data: {
|         coupon: {...}
|     }
| }
|
|--------------------------------------------------------------------------
*/

const getPayloadData = (payload) => {
    if (payload?.data?.data) {
        return payload.data.data;
    }

    if (payload?.data) {
        return payload.data;
    }

    return payload;
};

/*
|--------------------------------------------------------------------------
| NORMALIZE APPLIED COUPON
|--------------------------------------------------------------------------
|
| Backend is the source of truth for:
|
| - coupon
| - coupon_id
| - discount_amount
| - eligible_subtotal
| - eligible_product_ids
| - final_eligible_amount
|
|--------------------------------------------------------------------------
*/

const normalizeAppliedCoupon = (payload) => {
    const data = getPayloadData(payload);

    const coupon =
        data?.coupon ||
        payload?.coupon ||
        null;

    const couponId =
        coupon?.id ??
        data?.coupon_id ??
        null;

    const couponCode =
        coupon?.code ??
        data?.coupon_code ??
        data?.code ??
        "";

    const rawDiscountAmount =
        Number(
            data?.discount_amount ?? 0
        );

    const rawEligibleSubtotal =
        Number(
            data?.eligible_subtotal ?? 0
        );

    const rawFinalEligibleAmount =
        Number(
            data?.final_eligible_amount ?? 0
        );

    const eligibleProductIds =
        Array.isArray(
            data?.eligible_product_ids
        )
            ? data.eligible_product_ids
            : [];

    const discountAmount =
        Number.isFinite(
            rawDiscountAmount
        )
            ? Number(
                  rawDiscountAmount.toFixed(2)
              )
            : 0;

    const eligibleSubtotal =
        Number.isFinite(
            rawEligibleSubtotal
        )
            ? Number(
                  rawEligibleSubtotal.toFixed(2)
              )
            : 0;

    const finalEligibleAmount =
        Number.isFinite(
            rawFinalEligibleAmount
        )
            ? Number(
                  rawFinalEligibleAmount.toFixed(2)
              )
            : 0;

    return {
        /*
        |--------------------------------------------------------------------------
        | Preserve backend coupon fields
        |--------------------------------------------------------------------------
        */

        ...(coupon || {}),

        /*
        |--------------------------------------------------------------------------
        | Normalized ID
        |--------------------------------------------------------------------------
        */

        id:
            coupon?.id ??
            couponId,

        coupon_id:
            couponId,

        /*
        |--------------------------------------------------------------------------
        | Normalized code
        |--------------------------------------------------------------------------
        */

        code:
            String(
                couponCode
            )
                .trim()
                .toUpperCase(),

        /*
        |--------------------------------------------------------------------------
        | Backend discount
        |--------------------------------------------------------------------------
        */

        discount_amount:
            discountAmount,

        /*
        |--------------------------------------------------------------------------
        | Eligible products
        |--------------------------------------------------------------------------
        */

        eligible_product_ids:
            eligibleProductIds,

        /*
        |--------------------------------------------------------------------------
        | Eligible subtotal
        |--------------------------------------------------------------------------
        */

        eligible_subtotal:
            eligibleSubtotal,

        /*
        |--------------------------------------------------------------------------
        | Eligible amount after discount
        |--------------------------------------------------------------------------
        */

        final_eligible_amount:
            finalEligibleAmount,
    };
};

/*
|--------------------------------------------------------------------------
| FETCH COUPONS
|--------------------------------------------------------------------------
*/

export const fetchCoupons =
    createAsyncThunk(
        "customerCoupon/fetchCoupons",

        async (
            productIds = [],
            {
                rejectWithValue,
            }
        ) => {
            try {
                return await couponService.getCustomerCoupons(
                    productIds
                );
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Unable to load coupons."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| VALIDATE COUPON
|--------------------------------------------------------------------------
*/

export const validateCoupon =
    createAsyncThunk(
        "customerCoupon/validateCoupon",

        async (
            {
                code,
                product_ids,
            },
            {
                rejectWithValue,
            }
        ) => {
            try {
                return await couponService.validateCoupon(
                    code,
                    product_ids
                );
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Coupon validation failed."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| APPLY COUPON
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This thunk has a SECOND safety layer.
|
| Even if the UI accidentally allows another request,
| Redux will reject it when a coupon is already applied.
|
|--------------------------------------------------------------------------
*/

export const applyCoupon =
    createAsyncThunk(
        "customerCoupon/applyCoupon",

        async (
            {
                code,
                product_ids,
                items,
            },
            {
                getState,
                rejectWithValue,
            }
        ) => {
            /*
            |--------------------------------------------------------------------------
            | CHECK CURRENTLY APPLIED COUPON
            |--------------------------------------------------------------------------
            */

            const couponState =
                getState()
                    ?.customerCoupon;

            const existingCoupon =
                couponState
                    ?.appliedCoupon;

            /*
            |--------------------------------------------------------------------------
            | ONE COUPON ONLY
            |--------------------------------------------------------------------------
            */

            if (existingCoupon) {
                return rejectWithValue(
                    "Only one coupon can be applied at a time. Remove the current coupon before applying another coupon."
                );
            }

            /*
            |--------------------------------------------------------------------------
            | APPLY THROUGH SERVICE
            |--------------------------------------------------------------------------
            */

            try {
                return await couponService.applyCoupon(
                    code,
                    product_ids,
                    items
                );
            } catch (error) {
                return rejectWithValue(
                    getErrorMessage(
                        error,
                        "Unable to apply coupon."
                    )
                );
            }
        }
    );

/*
|--------------------------------------------------------------------------
| RESET COUPON CALCULATION
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This resets ONLY coupon state.
|
| It DOES NOT modify cart items.
| It DOES NOT modify product prices.
| It DOES NOT modify cart subtotal.
|
|--------------------------------------------------------------------------
*/

const resetAppliedCouponState = (
    state
) => {
    /*
    |--------------------------------------------------------------------------
    | Selected coupon
    |--------------------------------------------------------------------------
    */

    state.selectedCouponCode = "";

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    state.validatedCoupon = null;

    /*
    |--------------------------------------------------------------------------
    | Applied coupon
    |--------------------------------------------------------------------------
    */

    state.appliedCoupon = null;

    /*
    |--------------------------------------------------------------------------
    | Eligibility
    |--------------------------------------------------------------------------
    */

    state.eligibleProductIds = [];

    state.eligibleSubtotal = 0;

    /*
    |--------------------------------------------------------------------------
    | DISCOUNT RESET
    |--------------------------------------------------------------------------
    |
    | This is extremely important.
    |
    | After removing:
    |
    | 10,000 - 1,000 = 9,000
    |
    | discount becomes:
    |
    | 0
    |
    | So checkout goes back to:
    |
    | 10,000
    |
    |--------------------------------------------------------------------------
    */

    state.discount = 0;

    state.finalEligibleAmount = 0;

    /*
    |--------------------------------------------------------------------------
    | Applying state
    |--------------------------------------------------------------------------
    */

    state.applying = false;

    /*
    |--------------------------------------------------------------------------
    | Errors / messages
    |--------------------------------------------------------------------------
    */

    state.applyError = null;

    state.message = null;
};

/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/

const customerCouponSlice =
    createSlice({
        name:
            "customerCoupon",

        initialState,

        reducers: {
            /*
            |--------------------------------------------------------------------------
            | SELECT COUPON
            |--------------------------------------------------------------------------
            |
            | This only selects a coupon.
            |
            | It does NOT apply a discount.
            |
            |--------------------------------------------------------------------------
            */

            setSelectedCouponCode: (
                state,
                action
            ) => {
                /*
                |--------------------------------------------------------------------------
                | NEVER SELECT ANOTHER COUPON WHILE ONE IS APPLIED
                |--------------------------------------------------------------------------
                */

                if (
                    state.appliedCoupon
                ) {
                    return;
                }

                const code =
                    String(
                        action.payload || ""
                    )
                        .trim()
                        .toUpperCase();

                state.selectedCouponCode =
                    code;

                /*
                |--------------------------------------------------------------------------
                | Clear old errors
                |--------------------------------------------------------------------------
                */

                state.error = null;

                state.applyError = null;

                state.message = null;
            },

            /*
            |--------------------------------------------------------------------------
            | CLEAR COUPON
            |--------------------------------------------------------------------------
            */

            clearCoupon: (
                state
            ) => {
                resetAppliedCouponState(
                    state
                );
            },

            /*
            |--------------------------------------------------------------------------
            | REMOVE APPLIED COUPON
            |--------------------------------------------------------------------------
            */

            removeAppliedCoupon: (
                state
            ) => {
                /*
                |--------------------------------------------------------------------------
                | Removing coupon restores original subtotal indirectly.
                |
                | Cart subtotal was NEVER modified.
                |
                | Only discount becomes 0.
                |--------------------------------------------------------------------------
                */

                resetAppliedCouponState(
                    state
                );
            },

            /*
            |--------------------------------------------------------------------------
            | CLEAR ERRORS
            |--------------------------------------------------------------------------
            */

            clearCouponError: (
                state
            ) => {
                state.error = null;

                state.applyError = null;
            },
        },

        extraReducers:
            (builder) => {
                /*
                |--------------------------------------------------------------------------
                | FETCH COUPONS
                |--------------------------------------------------------------------------
                */

                builder
                    .addCase(
                        fetchCoupons.pending,
                        (state) => {
                            state.loading =
                                true;

                            state.error =
                                null;
                        }
                    )

                    .addCase(
                        fetchCoupons.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading =
                                false;

                            state.error =
                                null;

                            const data =
                                action
                                    .payload
                                    ?.data ??
                                action.payload;

                            if (
                                Array.isArray(
                                    data
                                )
                            ) {
                                state.coupons =
                                    data;
                            } else if (
                                Array.isArray(
                                    data?.coupons
                                )
                            ) {
                                state.coupons =
                                    data.coupons;
                            } else {
                                state.coupons =
                                    [];
                            }
                        }
                    )

                    .addCase(
                        fetchCoupons.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.loading =
                                false;

                            state.coupons =
                                [];

                            state.error =
                                action.payload ||
                                "Unable to load coupons.";
                        }
                    );

                /*
                |--------------------------------------------------------------------------
                | VALIDATE COUPON
                |--------------------------------------------------------------------------
                */

                builder
                    .addCase(
                        validateCoupon.pending,
                        (state) => {
                            state.loading =
                                true;

                            state.error =
                                null;

                            state.validatedCoupon =
                                null;
                        }
                    )

                    .addCase(
                        validateCoupon.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.loading =
                                false;

                            state.error =
                                null;

                            const data =
                                getPayloadData(
                                    action.payload
                                );

                            state.validatedCoupon =
                                data?.coupon ??
                                data ??
                                null;
                        }
                    )

                    .addCase(
                        validateCoupon.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.loading =
                                false;

                            state.validatedCoupon =
                                null;

                            state.error =
                                action.payload ||
                                "Coupon validation failed.";
                        }
                    );

                /*
                |--------------------------------------------------------------------------
                | APPLY COUPON
                |--------------------------------------------------------------------------
                */

                builder
                    .addCase(
                        applyCoupon.pending,
                        (
                            state
                        ) => {
                            state.applying =
                                true;

                            state.applyError =
                                null;

                            state.message =
                                null;
                        }
                    )

                    .addCase(
                        applyCoupon.fulfilled,
                        (
                            state,
                            action
                        ) => {
                            state.applying =
                                false;

                            state.applyError =
                                null;

                            state.error =
                                null;

                            const data =
                                getPayloadData(
                                    action.payload
                                );

                            const normalized =
                                normalizeAppliedCoupon(
                                    action.payload
                                );

                            /*
                            |--------------------------------------------------------------------------
                            | SAFETY CHECK
                            |--------------------------------------------------------------------------
                            |
                            | There should never be two coupons here.
                            |
                            | The thunk already prevents this.
                            |
                            |--------------------------------------------------------------------------
                            */

                            state.appliedCoupon =
                                normalized;

                            /*
                            |--------------------------------------------------------------------------
                            | Validated coupon becomes current coupon
                            |--------------------------------------------------------------------------
                            */

                            state.validatedCoupon =
                                normalized;

                            /*
                            |--------------------------------------------------------------------------
                            | Selected coupon becomes current coupon
                            |--------------------------------------------------------------------------
                            */

                            state.selectedCouponCode =
                                normalized.code;

                            /*
                            |--------------------------------------------------------------------------
                            | Eligible products
                            |--------------------------------------------------------------------------
                            */

                            state.eligibleProductIds =
                                normalized
                                    .eligible_product_ids;

                            /*
                            |--------------------------------------------------------------------------
                            | Eligible subtotal
                            |--------------------------------------------------------------------------
                            */

                            state.eligibleSubtotal =
                                normalized
                                    .eligible_subtotal;

                            /*
                            |--------------------------------------------------------------------------
                            | CURRENT COUPON DISCOUNT
                            |--------------------------------------------------------------------------
                            |
                            | IMPORTANT:
                            |
                            | This is the backend-provided discount
                            | for THIS coupon.
                            |
                            | We DO NOT add it to a previous discount.
                            |
                            | Example:
                            |
                            | Coupon A = 500
                            |
                            | Remove A
                            |
                            | discount = 0
                            |
                            | Coupon B = 700
                            |
                            | discount = 700
                            |
                            | NOT:
                            |
                            | 500 + 700 = 1200
                            |
                            |--------------------------------------------------------------------------
                            */

                            state.discount =
                                normalized
                                    .discount_amount;

                            /*
                            |--------------------------------------------------------------------------
                            | Eligible amount after current coupon
                            |--------------------------------------------------------------------------
                            */

                            state.finalEligibleAmount =
                                normalized
                                    .final_eligible_amount;

                            /*
                            |--------------------------------------------------------------------------
                            | Success message
                            |--------------------------------------------------------------------------
                            */

                            state.message =
                                action
                                    .payload
                                    ?.message ??
                                data?.message ??
                                `Coupon ${normalized.code} applied successfully.`;
                        }
                    )

                    .addCase(
                        applyCoupon.rejected,
                        (
                            state,
                            action
                        ) => {
                            state.applying =
                                false;

                            /*
                            |--------------------------------------------------------------------------
                            | DO NOT TOUCH EXISTING APPLIED COUPON HERE
                            |--------------------------------------------------------------------------
                            |
                            | Normally there is no existing coupon because
                            | the thunk blocks a second application.
                            |
                            | But a failed new application should never
                            | create or add a discount.
                            |--------------------------------------------------------------------------
                            */

                            state.applyError =
                                action.payload ||
                                "Unable to apply coupon.";
                        }
                    );
            },
    });

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

export const {
    setSelectedCouponCode,
    clearCoupon,
    removeAppliedCoupon,
    clearCouponError,
} =
    customerCouponSlice.actions;

/*
|--------------------------------------------------------------------------
| SELECTORS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| AVAILABLE COUPONS
|--------------------------------------------------------------------------
*/

export const selectCoupons = (
    state
) =>
    state.customerCoupon
        ?.coupons ?? [];

/*
|--------------------------------------------------------------------------
| SELECTED COUPON CODE
|--------------------------------------------------------------------------
*/

export const selectSelectedCouponCode = (
    state
) =>
    state.customerCoupon
        ?.selectedCouponCode ?? "";

/*
|--------------------------------------------------------------------------
| APPLIED COUPON
|--------------------------------------------------------------------------
*/

export const selectAppliedCoupon = (
    state
) =>
    state.customerCoupon
        ?.appliedCoupon ?? null;

/*
|--------------------------------------------------------------------------
| APPLIED COUPONS
|--------------------------------------------------------------------------
|
| Always:
|
| []
|
| OR:
|
| [oneCoupon]
|
|--------------------------------------------------------------------------
*/

export const selectAppliedCoupons = (
    state
) => {
    const coupon =
        state.customerCoupon
            ?.appliedCoupon ??
        null;

    return coupon
        ? [coupon]
        : [];
};

/*
|--------------------------------------------------------------------------
| ALIAS
|--------------------------------------------------------------------------
*/

export const selectCoupon =
    selectAppliedCoupon;

/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

export const selectCouponLoading = (
    state
) =>
    Boolean(
        state.customerCoupon
            ?.loading
    );

/*
|--------------------------------------------------------------------------
| APPLYING
|--------------------------------------------------------------------------
*/

export const selectCouponApplying = (
    state
) =>
    Boolean(
        state.customerCoupon
            ?.applying
    );

/*
|--------------------------------------------------------------------------
| GENERAL ERROR
|--------------------------------------------------------------------------
*/

export const selectCouponError = (
    state
) =>
    state.customerCoupon
        ?.error ?? null;

/*
|--------------------------------------------------------------------------
| APPLY ERROR
|--------------------------------------------------------------------------
*/

export const selectCouponApplyError = (
    state
) =>
    state.customerCoupon
        ?.applyError ?? null;

/*
|--------------------------------------------------------------------------
| DISCOUNT
|--------------------------------------------------------------------------
|
| This is ALWAYS the discount of the CURRENTLY APPLIED coupon.
|
|--------------------------------------------------------------------------
*/

export const selectCouponDiscount = (
    state
) =>
    Number(
        state.customerCoupon
            ?.discount ?? 0
    );

/*
|--------------------------------------------------------------------------
| ELIGIBLE PRODUCT IDS
|--------------------------------------------------------------------------
*/

export const selectCouponEligibleProductIds = (
    state
) =>
    state.customerCoupon
        ?.eligibleProductIds ?? [];

/*
|--------------------------------------------------------------------------
| ELIGIBLE SUBTOTAL
|--------------------------------------------------------------------------
*/

export const selectCouponEligibleSubtotal = (
    state
) =>
    Number(
        state.customerCoupon
            ?.eligibleSubtotal ?? 0
    );

/*
|--------------------------------------------------------------------------
| FINAL ELIGIBLE AMOUNT
|--------------------------------------------------------------------------
*/

export const selectCouponFinalEligibleAmount = (
    state
) =>
    Number(
        state.customerCoupon
            ?.finalEligibleAmount ?? 0
    );

/*
|--------------------------------------------------------------------------
| REDUCER
|--------------------------------------------------------------------------
*/

export default customerCouponSlice.reducer;
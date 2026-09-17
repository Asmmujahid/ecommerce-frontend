// src/components/customer/coupon/CouponResult.jsx

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    CheckCircle,
    LocalOffer,
} from "@mui/icons-material";

/*
|--------------------------------------------------------------------------
| FORMAT PRICE
|--------------------------------------------------------------------------
*/

const formatPrice = (amount) => {
    const value =
        Number(amount);

    if (
        !Number.isFinite(value)
    ) {
        return "0.00";
    }

    return value.toLocaleString(
        "en-PK",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
};

/*
|--------------------------------------------------------------------------
| MONEY
|--------------------------------------------------------------------------
*/

const safeMoney = (amount) => {
    const value =
        Number(amount);

    if (
        !Number.isFinite(value)
    ) {
        return 0;
    }

    return Math.max(
        0,
        Number(
            value.toFixed(2)
        )
    );
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const CouponResult = ({
    result,
    onRemove,
    orderSubtotal = null,
}) => {
    if (!result) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | RESPONSE DATA
    |--------------------------------------------------------------------------
    */

    const data =
        result?.data?.data ??
        result?.data ??
        result;

    /*
    |--------------------------------------------------------------------------
    | COUPON
    |--------------------------------------------------------------------------
    */

    const coupon =
        data?.coupon ??
        result?.coupon ??
        {};

    /*
    |--------------------------------------------------------------------------
    | CODE
    |--------------------------------------------------------------------------
    */

    const couponCode =
        String(
            coupon?.code ??
                data?.coupon_code ??
                data?.code ??
                result?.code ??
                "Coupon"
        )
            .trim()
            .toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | ELIGIBLE SUBTOTAL
    |--------------------------------------------------------------------------
    */

    const eligibleSubtotal =
        safeMoney(
            data?.eligible_subtotal
        );

    /*
    |--------------------------------------------------------------------------
    | DISCOUNT
    |--------------------------------------------------------------------------
    */

    const discountAmount =
        Math.min(
            eligibleSubtotal,
            safeMoney(
                data?.discount_amount
            )
        );

    /*
    |--------------------------------------------------------------------------
    | FINAL ELIGIBLE AMOUNT
    |--------------------------------------------------------------------------
    */

    const backendFinalEligible =
        Number(
            data?.final_eligible_amount
        );

    const finalEligibleAmount =
        Number.isFinite(
            backendFinalEligible
        )
            ? Math.max(
                  0,
                  Number(
                      backendFinalEligible.toFixed(
                          2
                      )
                  )
              )
            : Math.max(
                  0,
                  Number(
                      (
                          eligibleSubtotal -
                          discountAmount
                      ).toFixed(2)
                  )
              );

    /*
    |--------------------------------------------------------------------------
    | ORIGINAL ORDER SUBTOTAL
    |--------------------------------------------------------------------------
    */

    const numericOrderSubtotal =
        Number(
            orderSubtotal
        );

    const hasOrderSubtotal =
        Number.isFinite(
            numericOrderSubtotal
        ) &&
        numericOrderSubtotal >= 0;

    /*
    |--------------------------------------------------------------------------
    | FINAL ORDER TOTAL
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Full original order subtotal
    | minus CURRENT coupon discount.
    |
    |--------------------------------------------------------------------------
    */

    const finalOrderTotal =
        hasOrderSubtotal
            ? Math.max(
                  0,
                  Number(
                      (
                          numericOrderSubtotal -
                          discountAmount
                      ).toFixed(2)
                  )
              )
            : null;

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <Paper
            variant="outlined"
            sx={{
                p: {
                    xs: 2,
                    sm: 3,
                },
                borderRadius: 2,
            }}
        >
            <Stack spacing={2}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <CheckCircle
                            color="success"
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Coupon Applied
                        </Typography>
                    </Stack>

                    <LocalOffer
                        color="primary"
                    />
                </Stack>

                <Alert severity="success">
                    Coupon{" "}
                    <strong>
                        {couponCode}
                    </strong>{" "}
                    has been applied successfully.
                </Alert>

                <Divider />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Typography
                        color="text.secondary"
                    >
                        Eligible Subtotal
                    </Typography>

                    <Typography
                        fontWeight={600}
                    >
                        Rs.{" "}
                        {formatPrice(
                            eligibleSubtotal
                        )}
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Typography
                        color="text.secondary"
                    >
                        Coupon Discount
                    </Typography>

                    <Typography
                        fontWeight={700}
                        color="success.main"
                    >
                        - Rs.{" "}
                        {formatPrice(
                            discountAmount
                        )}
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Typography
                        color="text.secondary"
                    >
                        Eligible Amount After Coupon
                    </Typography>

                    <Typography
                        fontWeight={600}
                    >
                        Rs.{" "}
                        {formatPrice(
                            finalEligibleAmount
                        )}
                    </Typography>
                </Stack>

                {finalOrderTotal !==
                    null && (
                    <>
                        <Divider />

                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor:
                                    "grey.50",
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Final Order Total
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                    color="primary"
                                >
                                    Rs.{" "}
                                    {formatPrice(
                                        finalOrderTotal
                                    )}
                                </Typography>
                            </Stack>
                        </Box>
                    </>
                )}

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Only one coupon can be active
                    at a time. Remove the current
                    coupon before applying another
                    coupon. Every new coupon is
                    calculated from the original
                    order/cart amount.
                </Typography>

                {typeof onRemove ===
                    "function" && (
                    <Box
                        component="button"
                        type="button"
                        onClick={onRemove}
                        sx={{
                            border: 0,
                            background:
                                "transparent",
                            color:
                                "error.main",
                            cursor:
                                "pointer",
                            textAlign:
                                "center",
                            fontSize:
                                "0.875rem",
                            fontWeight:
                                600,

                            "&:hover": {
                                textDecoration:
                                    "underline",
                            },
                        }}
                    >
                        Remove Coupon
                    </Box>
                )}

            </Stack>
        </Paper>
    );
};

CouponResult.propTypes = {
    result:
        PropTypes.object,

    onRemove:
        PropTypes.func,

    orderSubtotal:
        PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
};

export default CouponResult;


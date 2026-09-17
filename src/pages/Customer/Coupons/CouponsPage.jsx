// src/pages/Customer/Coupon/CouponsPage.jsx

import {
    useEffect,
    useMemo,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    LocalOffer,
} from "@mui/icons-material";

import {
    fetchCoupons,
    selectCoupons,
    selectCouponLoading,
    selectCouponError,
} from "../../../redux/customer/couponSlice";

import {
    selectCartItems,
} from "../../../redux/customer/cartSlice";

/*
|--------------------------------------------------------------------------
| FORMAT
|--------------------------------------------------------------------------
*/

const formatPrice = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
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
| PRODUCT ID
|--------------------------------------------------------------------------
*/

const getItemProductId = (item) => {
    const productId =
        item?.product_id ??
        item?.product?.id ??
        item?.product?.product_id;

    const numericId =
        Number(productId);

    if (
        Number.isInteger(
            numericId
        ) &&
        numericId > 0
    ) {
        return numericId;
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| COUPON SCOPE
|--------------------------------------------------------------------------
*/

const getCouponScopeLabel = (
    coupon
) => {
    if (
        coupon?.vendor_id !== null &&
        coupon?.vendor_id !== undefined
    ) {
        return "Seller Coupon";
    }

    if (
        coupon?.admin_coupon_scope ===
        "admin_only"
    ) {
        return "Admin Products";
    }

    if (
        coupon?.admin_coupon_scope ===
        "all_products"
    ) {
        return "All Products";
    }

    return "Admin Coupon";
};

/*
|--------------------------------------------------------------------------
| COUPON OWNER
|--------------------------------------------------------------------------
*/

const getCouponOwnerLabel = (
    coupon
) => {
    const vendorId =
        coupon?.vendor_id ??
        coupon?.vendor?.id ??
        coupon?.vendor?.vendor_id;

    const numericVendorId =
        Number(vendorId);

    if (
        Number.isInteger(
            numericVendorId
        ) &&
        numericVendorId > 0
    ) {
        return (
            coupon?.vendor
                ?.business_name ||
            coupon?.vendor?.name ||
            "Seller"
        );
    }

    return "Admin";
};

/*
|--------------------------------------------------------------------------
| COUPON USABLE
|--------------------------------------------------------------------------
*/

const isCouponUsable = (coupon) => {
    if (!coupon) {
        return false;
    }

    if (
        coupon.status === false ||
        coupon.status === 0 ||
        coupon.status === "0"
    ) {
        return false;
    }

    if (coupon.start_date) {
        const start =
            new Date(
                coupon.start_date
            );

        if (
            !Number.isNaN(
                start.getTime()
            ) &&
            Date.now() < start.getTime()
        ) {
            return false;
        }
    }

    if (coupon.end_date) {
        const end =
            new Date(
                coupon.end_date
            );

        if (
            !Number.isNaN(
                end.getTime()
            ) &&
            Date.now() > end.getTime()
        ) {
            return false;
        }
    }

    const usageLimit =
        coupon?.usage_limit;

    const usedCount =
        Number(
            coupon?.used_count ?? 0
        );

    if (
        usageLimit !== null &&
        usageLimit !== undefined
    ) {
        const limit =
            Number(
                usageLimit
            );

        if (
            limit > 0 &&
            usedCount >= limit
        ) {
            return false;
        }
    }

    return true;
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const CouponsPage = () => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    /*
    |--------------------------------------------------------------------------
    | COUPONS
    |--------------------------------------------------------------------------
    */

    const coupons =
        useSelector(
            selectCoupons
        );

    const loading =
        useSelector(
            selectCouponLoading
        );

    const error =
        useSelector(
            selectCouponError
        );

    /*
    |--------------------------------------------------------------------------
    | CART
    |--------------------------------------------------------------------------
    */

    const cartItems =
        useSelector(
            selectCartItems
        );

    const safeCartItems =
        Array.isArray(
            cartItems
        )
            ? cartItems
            : [];

    /*
    |--------------------------------------------------------------------------
    | CART PRODUCT IDS
    |--------------------------------------------------------------------------
    */

    const cartProductIds =
        useMemo(() => {
            return [
                ...new Set(
                    safeCartItems
                        .map(
                            getItemProductId
                        )
                        .filter(
                            Boolean
                        )
                ),
            ].sort(
                (a, b) => a - b
            );
        }, [
            safeCartItems,
        ]);

    const cartProductIdsKey =
        cartProductIds.join(",");

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            cartProductIds.length ===
            0
        ) {
            return;
        }

        dispatch(
            fetchCoupons(
                cartProductIds
            )
        );
    }, [
        dispatch,
        cartProductIdsKey,
    ]);

    /*
    |--------------------------------------------------------------------------
    | VISIBLE COUPONS
    |--------------------------------------------------------------------------
    */

    const visibleCoupons =
        useMemo(() => {
            if (
                !Array.isArray(
                    coupons
                )
            ) {
                return [];
            }

            return coupons.filter(
                isCouponUsable
            );
        }, [
            coupons,
        ]);

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    const errorMessage =
        typeof error === "string"
            ? error
            : error?.message ||
              "Unable to load coupons.";

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <Box
            sx={{
                minHeight: "70vh",
                backgroundColor:
                    "grey.50",
                py: {
                    xs: 3,
                    sm: 4,
                    md: 6,
                },
            }}
        >
            <Container maxWidth="lg">

                <Button
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/customer/checkout"
                        )
                    }
                    sx={{
                        mb: 3,
                        textTransform:
                            "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Checkout
                </Button>

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 4,
                        },
                        borderRadius: 3,
                        mb: 3,
                    }}
                >
                    <Stack
                        spacing={1}
                        alignItems="center"
                        textAlign="center"
                    >
                        <LocalOffer
                            color="primary"
                            sx={{
                                fontSize: 50,
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={800}
                        >
                            Available Coupons
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Coupons available for
                            products in your cart.
                        </Typography>

                        <Typography
                            variant="body2"
                            color="primary"
                            fontWeight={600}
                        >
                            Only one coupon can be
                            applied to an order at a
                            time.
                        </Typography>
                    </Stack>
                </Paper>

                {safeCartItems.length > 0 &&
                    cartProductIds.length >
                        0 && (
                        <Alert
                            severity="info"
                            sx={{
                                mb: 3,
                            }}
                        >
                            Coupons are shown based
                            on the products currently
                            in your cart.
                        </Alert>
                    )}

                {safeCartItems.length ===
                    0 && (
                    <Alert
                        severity="info"
                        sx={{
                            mb: 3,
                        }}
                    >
                        Add products to your cart
                        to see available coupons.
                    </Alert>
                )}

                {safeCartItems.length >
                    0 &&
                    cartProductIds.length ===
                        0 && (
                        <Alert
                            severity="warning"
                            sx={{
                                mb: 3,
                            }}
                        >
                            Product information could
                            not be found in your cart.
                            Please refresh your cart
                            and try again.
                        </Alert>
                    )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                        }}
                    >
                        {errorMessage}
                    </Alert>
                )}

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "center",
                            py: 5,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}

                {!loading &&
                    safeCartItems.length >
                        0 &&
                    cartProductIds.length >
                        0 &&
                    visibleCoupons.length ===
                        0 && (
                        <Alert severity="info">
                            No coupons are currently
                            available for the products
                            in your cart.
                        </Alert>
                    )}

                {!loading &&
                    visibleCoupons.length >
                        0 && (
                        <Grid
                            container
                            spacing={3}
                        >
                            {visibleCoupons.map(
                                (coupon) => {
                                    const scopeLabel =
                                        getCouponScopeLabel(
                                            coupon
                                        );

                                    const ownerLabel =
                                        getCouponOwnerLabel(
                                            coupon
                                        );

                                    const isPercentage =
                                        coupon?.type ===
                                        "percentage";

                                    return (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={
                                                coupon.id
                                            }
                                        >
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    height:
                                                        "100%",
                                                    borderRadius:
                                                        3,
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Stack
                                                        spacing={2}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            <Chip
                                                                icon={
                                                                    <LocalOffer />
                                                                }
                                                                label={
                                                                    coupon.code
                                                                }
                                                                color="primary"
                                                                sx={{
                                                                    fontWeight:
                                                                        700,
                                                                }}
                                                            />

                                                            <Typography
                                                                fontWeight={
                                                                    800
                                                                }
                                                                color="success.main"
                                                                sx={{
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                {isPercentage
                                                                    ? `${coupon.value}% OFF`
                                                                    : `Rs. ${formatPrice(
                                                                          coupon.value
                                                                      )} OFF`}
                                                            </Typography>
                                                        </Stack>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Offered
                                                            by{" "}
                                                            <strong>
                                                                {
                                                                    ownerLabel
                                                                }
                                                            </strong>
                                                        </Typography>

                                                        <Chip
                                                            label={
                                                                scopeLabel
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                width:
                                                                    "fit-content",
                                                            }}
                                                        />

                                                        {coupon?.min_order_amount !==
                                                            null &&
                                                            coupon?.min_order_amount !==
                                                                undefined && (
                                                                <Typography
                                                                    variant="body2"
                                                                >
                                                                    Minimum
                                                                    order:{" "}
                                                                    <strong>
                                                                        Rs.{" "}
                                                                        {formatPrice(
                                                                            coupon.min_order_amount
                                                                        )}
                                                                    </strong>
                                                                </Typography>
                                                            )}

                                                        {coupon?.max_discount !==
                                                            null &&
                                                            coupon?.max_discount !==
                                                                undefined &&
                                                            isPercentage && (
                                                                <Typography
                                                                    variant="body2"
                                                                >
                                                                    Maximum
                                                                    discount:{" "}
                                                                    <strong>
                                                                        Rs.{" "}
                                                                        {formatPrice(
                                                                            coupon.max_discount
                                                                        )}
                                                                    </strong>
                                                                </Typography>
                                                            )}

                                                        {coupon?.usage_limit !==
                                                            null &&
                                                            coupon?.usage_limit !==
                                                                undefined && (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    Usage:{" "}
                                                                    {
                                                                        coupon.used_count ??
                                                                        0
                                                                    }
                                                                    /
                                                                    {
                                                                        coupon.usage_limit
                                                                    }
                                                                </Typography>
                                                            )}

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Valid
                                                            from{" "}
                                                            {
                                                                coupon.start_date
                                                            }{" "}
                                                            to{" "}
                                                            {
                                                                coupon.end_date
                                                            }
                                                        </Typography>

                                                        <Button
                                                            variant="contained"
                                                            fullWidth
                                                            onClick={() =>
                                                                navigate(
                                                                    "/customer/checkout"
                                                                )
                                                            }
                                                            sx={{
                                                                mt: "auto",
                                                                textTransform:
                                                                    "none",
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        >
                                                            Use at
                                                            Checkout
                                                        </Button>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                    )}

            </Container>
        </Box>
    );
};

export default CouponsPage;
// src/components/customer/checkout/CouponInput.jsx

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    CheckCircleOutline,
    LocalOfferOutlined,
} from "@mui/icons-material";

import {
    fetchCoupons,
    applyCoupon,
    removeAppliedCoupon,
    clearCoupon,
    selectCoupons,
    selectAppliedCoupons,
    selectCouponLoading,
    selectCouponApplying,
    selectCouponError,
    selectCouponApplyError,
    selectCouponDiscount,
} from "../../../redux/customer/couponSlice";

import {
    selectCartItems,
} from "../../../redux/customer/cartSlice";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const getItemProductId = (item) => {
    const id =
        item?.product_id ??
        item?.product?.id ??
        item?.productId ??
        0;

    const numericId = Number(id);

    return Number.isInteger(numericId) &&
        numericId > 0
        ? numericId
        : 0;
};

const getItemQuantity = (item) => {
    const quantity = Number(
        item?.quantity ??
            item?.qty ??
            1
    );

    return Number.isInteger(quantity) &&
        quantity > 0
        ? quantity
        : 1;
};

const getCouponCode = (coupon) => {
    return String(
        coupon?.coupon_code ??
            coupon?.code ??
            coupon?.coupon?.code ??
            ""
    )
        .trim()
        .toUpperCase();
};

const getCouponId = (coupon) => {
    return (
        coupon?.coupon_id ??
        coupon?.id ??
        coupon?.coupon?.id ??
        null
    );
};

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

const isCouponExpired = (coupon) => {
    if (!coupon?.end_date) {
        return false;
    }

    const endDate = new Date(
        coupon.end_date
    );

    if (Number.isNaN(endDate.getTime())) {
        return false;
    }

    return (
        Date.now() >
        endDate.getTime()
    );
};

const isCouponNotStarted = (coupon) => {
    if (!coupon?.start_date) {
        return false;
    }

    const startDate = new Date(
        coupon.start_date
    );

    if (Number.isNaN(startDate.getTime())) {
        return false;
    }

    return (
        Date.now() <
        startDate.getTime()
    );
};

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

    if (isCouponExpired(coupon)) {
        return false;
    }

    if (isCouponNotStarted(coupon)) {
        return false;
    }

    const usageLimit =
        coupon?.usage_limit;

    const usedCount = Number(
        coupon?.used_count ?? 0
    );

    if (
        usageLimit !== null &&
        usageLimit !== undefined
    ) {
        const numericLimit =
            Number(usageLimit);

        if (
            numericLimit > 0 &&
            usedCount >= numericLimit
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

const CouponInput = ({
    orderAmount = 0,
    onCouponApplied,
}) => {
    const dispatch = useDispatch();

    /*
    |--------------------------------------------------------------------------
    | REDUX
    |--------------------------------------------------------------------------
    */

    const coupons = useSelector(
        selectCoupons
    );

    const appliedCoupons = useSelector(
        selectAppliedCoupons
    );

    const couponLoading = useSelector(
        selectCouponLoading
    );

    const applying = useSelector(
        selectCouponApplying
    );

    const couponError = useSelector(
        selectCouponError
    );

    const couponApplyError = useSelector(
        selectCouponApplyError
    );

    const couponDiscount = useSelector(
        selectCouponDiscount
    );

    const cartItems = useSelector(
        selectCartItems
    );

    /*
    |--------------------------------------------------------------------------
    | SAFE VALUES
    |--------------------------------------------------------------------------
    */

    const safeCoupons =
        Array.isArray(coupons)
            ? coupons
            : [];

    const safeAppliedCoupons =
        Array.isArray(appliedCoupons)
            ? appliedCoupons
            : [];

    const safeCartItems =
        Array.isArray(cartItems)
            ? cartItems
            : [];

    /*
    |--------------------------------------------------------------------------
    | ONLY ONE COUPON
    |--------------------------------------------------------------------------
    */

    const appliedCoupon =
        safeAppliedCoupons.length > 0
            ? safeAppliedCoupons[0]
            : null;

    const hasAppliedCoupon =
        Boolean(appliedCoupon);

    /*
    |--------------------------------------------------------------------------
    | LOCAL STATE
    |--------------------------------------------------------------------------
    */

    const [code, setCode] =
        useState("");

    const [localMessage, setLocalMessage] =
        useState("");

    const applyLock = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | CART PRODUCT IDS
    |--------------------------------------------------------------------------
    */

    const cartProductIds = useMemo(() => {
        return [
            ...new Set(
                safeCartItems
                    .map(getItemProductId)
                    .filter(
                        (id) =>
                            Number.isInteger(id) &&
                            id > 0
                    )
            ),
        ].sort(
            (a, b) => a - b
        );
    }, [safeCartItems]);

    /*
    |--------------------------------------------------------------------------
    | COUPON ITEMS
    |--------------------------------------------------------------------------
    */

    const couponItems = useMemo(() => {
        return safeCartItems
            .map((item) => ({
                product_id:
                    getItemProductId(item),

                quantity:
                    getItemQuantity(item),
            }))
            .filter(
                (item) =>
                    Number.isInteger(
                        item.product_id
                    ) &&
                    item.product_id > 0 &&
                    Number.isInteger(
                        item.quantity
                    ) &&
                    item.quantity > 0
            );
    }, [safeCartItems]);

    /*
    |--------------------------------------------------------------------------
    | CART SIGNATURE
    |--------------------------------------------------------------------------
    |
    | If quantity/product changes while a coupon
    | is applied, remove the coupon.
    |
    |--------------------------------------------------------------------------
    */

    const cartSignature = useMemo(() => {
        return couponItems
            .map(
                (item) =>
                    `${item.product_id}:${item.quantity}`
            )
            .sort()
            .join("|");
    }, [couponItems]);

    const cartProductIdsKey =
        cartProductIds.join(",");

    /*
    |--------------------------------------------------------------------------
    | FETCH COUPONS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            cartProductIds.length === 0
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
    | CLEAR COUPON WHEN CART CHANGES
    |--------------------------------------------------------------------------
    */

    const [
        previousCartSignature,
        setPreviousCartSignature,
    ] = useState(null);

    useEffect(() => {
        if (
            previousCartSignature === null
        ) {
            setPreviousCartSignature(
                cartSignature
            );

            return;
        }

        if (
            previousCartSignature !==
            cartSignature
        ) {
            if (hasAppliedCoupon) {
                dispatch(
                    clearCoupon()
                );

                setCode("");

                setLocalMessage(
                    "Coupon was removed because the cart changed."
                );

                if (onCouponApplied) {
                    onCouponApplied(
                        null
                    );
                }
            }

            setPreviousCartSignature(
                cartSignature
            );
        }
    }, [
        cartSignature,
        previousCartSignature,
        hasAppliedCoupon,
        dispatch,
        onCouponApplied,
    ]);

    /*
    |--------------------------------------------------------------------------
    | CHECK IF COUPON IS CURRENTLY APPLIED
    |--------------------------------------------------------------------------
    */

    const isCouponApplied = (
        coupon
    ) => {
        if (!appliedCoupon) {
            return false;
        }

        const couponId =
            getCouponId(coupon);

        const appliedId =
            getCouponId(
                appliedCoupon
            );

        if (
            couponId !== null &&
            appliedId !== null
        ) {
            return (
                Number(couponId) ===
                Number(appliedId)
            );
        }

        return (
            getCouponCode(coupon) ===
            getCouponCode(
                appliedCoupon
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | VISIBLE COUPONS
    |--------------------------------------------------------------------------
    */

    const visibleCoupons = useMemo(() => {
        if (
            cartProductIds.length === 0
        ) {
            return [];
        }

        return safeCoupons.filter(
            isCouponUsable
        );
    }, [
        safeCoupons,
        cartProductIdsKey,
    ]);

    /*
    |--------------------------------------------------------------------------
    | APPLY COUPON
    |--------------------------------------------------------------------------
    */

    const handleApply = async (
        couponCode,
        selectedCoupon = null
    ) => {
        /*
        |----------------------------------------------------------------------
        | DOUBLE CLICK PROTECTION
        |----------------------------------------------------------------------
        */

        if (applyLock.current) {
            return;
        }

        /*
        |----------------------------------------------------------------------
        | ONLY ONE COUPON
        |----------------------------------------------------------------------
        */

        if (hasAppliedCoupon) {
            setLocalMessage(
                `Coupon ${getCouponCode(
                    appliedCoupon
                )} is already applied. Remove it before applying another coupon.`
            );

            return;
        }

        const cleanCode =
            String(
                couponCode || ""
            )
                .trim()
                .toUpperCase();

        if (!cleanCode) {
            setLocalMessage(
                "Please enter a coupon code."
            );

            return;
        }

        if (
            cartProductIds.length === 0
        ) {
            setLocalMessage(
                "Your cart is empty."
            );

            return;
        }

        if (
            couponItems.length === 0
        ) {
            setLocalMessage(
                "Cart items are required."
            );

            return;
        }

        /*
        |----------------------------------------------------------------------
        | CHECK SELECTED COUPON
        |----------------------------------------------------------------------
        */

        if (
            selectedCoupon &&
            !isCouponUsable(
                selectedCoupon
            )
        ) {
            setLocalMessage(
                "This coupon is not currently available."
            );

            return;
        }

        /*
        |----------------------------------------------------------------------
        | LOCK
        |----------------------------------------------------------------------
        */

        applyLock.current = true;

        setLocalMessage("");

        try {
            const result =
                await dispatch(
                    applyCoupon({
                        code: cleanCode,

                        product_ids:
                            cartProductIds,

                        items:
                            couponItems,
                    })
                );

            if (
                applyCoupon.fulfilled.match(
                    result
                )
            ) {
                setCode("");

                setLocalMessage(
                    `${cleanCode} applied successfully.`
                );

                if (onCouponApplied) {
                    onCouponApplied(
                        result.payload
                    );
                }
            } else {
                setLocalMessage(
                    result?.payload ||
                        "Unable to apply coupon."
                );
            }
        } finally {
            applyLock.current = false;
        }
    };

    /*
    |--------------------------------------------------------------------------
    | MANUAL APPLY
    |--------------------------------------------------------------------------
    */

    const handleManualApply =
        async () => {
            await handleApply(
                code,
                null
            );
        };

    /*
    |--------------------------------------------------------------------------
    | REMOVE COUPON
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | removeAppliedCoupon() resets:
    |
    | appliedCoupon = null
    | discount = 0
    | eligibleSubtotal = 0
    | finalEligibleAmount = 0
    |
    | Therefore the original subtotal becomes active again.
    |
    |--------------------------------------------------------------------------
    */

    const handleRemove = (
        coupon
    ) => {
        const removedCode =
            getCouponCode(coupon);

        dispatch(
            removeAppliedCoupon()
        );

        setCode("");

        setLocalMessage(
            `${removedCode} removed. You can now apply another coupon.`
        );

        if (onCouponApplied) {
            onCouponApplied(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | ORIGINAL ORDER AMOUNT
    |--------------------------------------------------------------------------
    */

    const safeOrderAmount = Math.max(
        0,
        Number.isFinite(
            Number(orderAmount)
        )
            ? Number(orderAmount)
            : 0
    );

    /*
    |--------------------------------------------------------------------------
    | CURRENT COUPON DISCOUNT ONLY
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | We use ONLY the discount returned by the
    | current backend coupon.
    |
    | We NEVER subtract a new discount from
    | an already discounted amount.
    |
    |--------------------------------------------------------------------------
    */

    const safeDiscount = hasAppliedCoupon
        ? Math.min(
              Math.max(
                  0,
                  Number(
                      couponDiscount || 0
                  )
              ),
              safeOrderAmount
          )
        : 0;

    /*
    |--------------------------------------------------------------------------
    | FINAL TOTAL
    |--------------------------------------------------------------------------
    |
    | ALWAYS:
    |
    | original subtotal - current coupon discount
    |
    |--------------------------------------------------------------------------
    */

    const finalAmount = Math.max(
        0,
        safeOrderAmount -
            safeDiscount
    );

    /*
    |--------------------------------------------------------------------------
    | DISPLAY ERROR
    |--------------------------------------------------------------------------
    */

    const displayError =
        couponApplyError ||
        couponError ||
        localMessage;

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
                    spacing={1}
                    alignItems="center"
                >
                    <LocalOfferOutlined
                        color="primary"
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Available Coupons
                    </Typography>
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    You can apply only one coupon
                    at a time. Remove the current
                    coupon before applying another.
                </Typography>

                {displayError && (
                    <Alert
                        severity={
                            couponApplyError ||
                            couponError
                                ? "error"
                                : "info"
                        }
                        onClose={() =>
                            setLocalMessage("")
                        }
                    >
                        {displayError}
                    </Alert>
                )}

                {appliedCoupon && (
                    <Box>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            sx={{
                                mb: 1,
                            }}
                        >
                            Applied Coupon
                        </Typography>

                        <Alert
                            severity="success"
                            icon={
                                <CheckCircleOutline />
                            }
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() =>
                                        handleRemove(
                                            appliedCoupon
                                        )
                                    }
                                >
                                    Remove
                                </Button>
                            }
                        >
                            <strong>
                                {getCouponCode(
                                    appliedCoupon
                                )}
                            </strong>{" "}
                            applied.

                            {safeDiscount > 0 && (
                                <Typography
                                    variant="caption"
                                    display="block"
                                >
                                    Discount: Rs.{" "}
                                    {formatPrice(
                                        safeDiscount
                                    )}
                                </Typography>
                            )}
                        </Alert>
                    </Box>
                )}

                <Divider />

                <Box>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Coupons
                    </Typography>

                    {couponLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "center",
                                py: 2,
                            }}
                        >
                            <CircularProgress
                                size={26}
                            />
                        </Box>
                    ) : visibleCoupons.length ===
                      0 ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No eligible coupons
                            available.
                        </Typography>
                    ) : (
                        <Stack spacing={1}>
                            {visibleCoupons.map(
                                (coupon) => {
                                    const couponCode =
                                        getCouponCode(
                                            coupon
                                        );

                                    const applied =
                                        isCouponApplied(
                                            coupon
                                        );

                                    const value =
                                        Number(
                                            coupon?.value ??
                                                0
                                        );

                                    const type =
                                        coupon?.type;

                                    return (
                                        <Box
                                            key={
                                                getCouponId(
                                                    coupon
                                                ) ??
                                                couponCode
                                            }
                                            sx={{
                                                border:
                                                    "1px solid",
                                                borderColor:
                                                    applied
                                                        ? "success.main"
                                                        : "divider",
                                                borderRadius: 2,
                                                p: 1.5,
                                            }}
                                        >
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={1}
                                                alignItems={{
                                                    xs: "stretch",
                                                    sm: "center",
                                                }}
                                                justifyContent="space-between"
                                            >
                                                <Box>
                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        {
                                                            couponCode
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {type ===
                                                        "percentage"
                                                            ? `${value}% OFF`
                                                            : `Rs. ${formatPrice(
                                                                  value
                                                              )} OFF`}
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    variant={
                                                        applied
                                                            ? "outlined"
                                                            : "contained"
                                                    }
                                                    size="small"
                                                    disabled={
                                                        applying ||
                                                        hasAppliedCoupon ||
                                                        applied
                                                    }
                                                    onClick={() =>
                                                        handleApply(
                                                            couponCode,
                                                            coupon
                                                        )
                                                    }
                                                >
                                                    {applied
                                                        ? "Applied"
                                                        : applying
                                                        ? "Applying..."
                                                        : hasAppliedCoupon
                                                        ? "Remove Current First"
                                                        : "Apply"}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    );
                                }
                            )}
                        </Stack>
                    )}
                </Box>

                <Divider />

                <Box>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Enter Coupon Code
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={1}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            label="Coupon code"
                            value={code}
                            onChange={(event) =>
                                setCode(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    event.preventDefault();

                                    if (
                                        !hasAppliedCoupon &&
                                        !applying
                                    ) {
                                        handleManualApply();
                                    }
                                }
                            }}
                            disabled={
                                applying ||
                                hasAppliedCoupon
                            }
                        />

                        <Button
                            variant="contained"
                            onClick={
                                handleManualApply
                            }
                            disabled={
                                applying ||
                                hasAppliedCoupon ||
                                !code.trim()
                            }
                            sx={{
                                minWidth: 120,
                            }}
                        >
                            {hasAppliedCoupon
                                ? "Coupon Applied"
                                : applying
                                ? "Applying..."
                                : "Apply"}
                        </Button>
                    </Stack>

                    {hasAppliedCoupon && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mt: 1,
                            }}
                        >
                            Remove the current coupon
                            before applying another
                            coupon.
                        </Typography>
                    )}
                </Box>

                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Original Order Amount
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Rs.{" "}
                        {formatPrice(
                            safeOrderAmount
                        )}
                    </Typography>

                    {hasAppliedCoupon && (
                        <>
                            <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight={600}
                            >
                                Coupon Discount: Rs.{" "}
                                {formatPrice(
                                    safeDiscount
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight={700}
                            >
                                Final Amount: Rs.{" "}
                                {formatPrice(
                                    finalAmount
                                )}
                            </Typography>
                        </>
                    )}

                    {!hasAppliedCoupon && (
                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Final Amount: Rs.{" "}
                            {formatPrice(
                                safeOrderAmount
                            )}
                        </Typography>
                    )}
                </Box>

            </Stack>
        </Paper>
    );
};

export default CouponInput;
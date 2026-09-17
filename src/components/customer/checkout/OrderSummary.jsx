// src/components/customer/checkout/OrderSummary.jsx

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    Stack,
    Typography,
} from "@mui/material";

// =====================================================
// PRODUCT NAME
// =====================================================

const getProductName = (item) => {
    return (
        item?.product?.name ||
        item?.product_name ||
        item?.name ||
        "Product"
    );
};

// =====================================================
// PRODUCT IMAGE
// =====================================================

const getProductImage = (item) => {
    return (
        item?.product?.image ||
        item?.product?.thumbnail ||
        item?.product_image ||
        item?.image ||
        null
    );
};

// =====================================================
// QUANTITY
// =====================================================

const getQuantity = (item) => {
    const quantity = Number(
        item?.quantity ??
        item?.qty ??
        1
    );

    if (
        Number.isFinite(quantity) &&
        quantity > 0
    ) {
        return quantity;
    }

    return 1;
};

// =====================================================
// PRICE
// =====================================================

const getPrice = (item) => {
    const product = item?.product || {};
    const variant = item?.variant || {};

    const price =
        item?.price ??
        item?.unit_price ??
        item?.product_price ??
        item?.discount_price ??
        variant?.discount_price ??
        variant?.price ??
        product?.discount_price ??
        product?.price ??
        0;

    const value = Number(price);

    if (
        Number.isFinite(value) &&
        value >= 0
    ) {
        return value;
    }

    return 0;
};

// =====================================================
// ITEM TOTAL
// =====================================================

const getItemTotal = (item) => {
    const price = getPrice(item);
    const quantity = getQuantity(item);

    return price * quantity;
};

// =====================================================
// FORMAT PRICE
// =====================================================

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

// =====================================================
// ROUND MONEY
// =====================================================

const roundMoney = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Number(
        value.toFixed(2)
    );
};

// =====================================================
// COMPONENT
// =====================================================

const OrderSummary = ({
    items = [],

    // These props are intentionally kept for
    // compatibility with the parent component.
    //
    // IMPORTANT:
    // They are NOT used to calculate the final
    // order total when cart items are available.
    subtotal,
    total,
    finalTotal,

    coupon = null,
    couponCode = "",

    discount = 0,
    discountAmount,

    loading = false,
}) => {
    // =================================================
    // SAFE CART ITEMS
    // =================================================

    const safeItems =
        Array.isArray(items)
            ? items
            : [];

    // =================================================
    // ORIGINAL CART SUBTOTAL
    // =================================================
    //
    // THIS IS THE MOST IMPORTANT PART.
    //
    // The subtotal always comes from the original
    // cart item prices:
    //
    // price × quantity
    //
    // We NEVER calculate it from:
    //
    // - previous total
    // - previous finalTotal
    // - previous discounted subtotal
    // - previous coupon
    //
    // Therefore:
    //
    // 10,000
    // coupon A - 500
    // = 9,500
    //
    // remove coupon
    // = 10,000
    //
    // coupon B - 700
    // = 9,300
    //
    // =================================================

    const calculatedSubtotal =
        safeItems.reduce(
            (sum, item) => {
                return (
                    sum +
                    getItemTotal(item)
                );
            },
            0
        );

    const originalSubtotal =
        roundMoney(
            calculatedSubtotal
        );

    // =================================================
    // CURRENT COUPON CODE
    // =================================================

    const reduxCouponCode =
        coupon?.code ||
        coupon?.coupon_code ||
        "";

    const displayCouponCode =
        String(
            couponCode ||
            reduxCouponCode ||
            ""
        )
            .trim()
            .toUpperCase();

    // =================================================
    // CHECK WHETHER A COUPON IS REALLY APPLIED
    // =================================================
    //
    // The coupon code is the source of truth for the
    // UI.
    //
    // If the coupon has been removed:
    //
    // couponCode = ""
    //
    // then:
    //
    // hasAppliedCoupon = false
    //
    // and discount MUST become 0.
    //
    // =================================================

    const hasAppliedCoupon =
        displayCouponCode.length > 0;

    // =================================================
    // CURRENT DISCOUNT
    // =================================================
    //
    // IMPORTANT:
    //
    // We only use discount when a coupon is actually
    // active.
    //
    // If no coupon is active, discount = 0.
    //
    // This prevents an old Redux/local discount from
    // appearing after Remove.
    //
    // =================================================

    const parsedDiscountAmount =
        Number(discountAmount);

    const parsedDiscount =
        Number(discount);

    let currentDiscount = 0;

    /*
     * Prefer discountAmount when it contains a
     * meaningful numeric value.
     *
     * Otherwise fall back to discount.
     */
    if (
        Number.isFinite(
            parsedDiscountAmount
        ) &&
        parsedDiscountAmount > 0
    ) {
        currentDiscount =
            parsedDiscountAmount;
    } else if (
        Number.isFinite(
            parsedDiscount
        ) &&
        parsedDiscount > 0
    ) {
        currentDiscount =
            parsedDiscount;
    }

    // =================================================
    // SAFE CURRENT DISCOUNT
    // =================================================
    //
    // Discount can never:
    //
    // - be negative
    // - be greater than the original subtotal
    //
    // =================================================

    const safeDiscount =
        hasAppliedCoupon
            ? roundMoney(
                  Math.min(
                      Math.max(
                          0,
                          currentDiscount
                      ),
                      originalSubtotal
                  )
              )
            : 0;

    // =================================================
    // FINAL TOTAL
    // =================================================
    //
    // ALWAYS:
    //
    // originalSubtotal - currentDiscount
    //
    // NEVER:
    //
    // previous finalTotal - currentDiscount
    //
    // NEVER:
    //
    // previous discounted subtotal - currentDiscount
    //
    // =================================================

    const calculatedFinalTotal =
        roundMoney(
            Math.max(
                0,
                originalSubtotal -
                    safeDiscount
            )
        );

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>
                        Loading order summary...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // EMPTY CART
    // =================================================

    if (safeItems.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Order Summary
                    </Typography>

                    <Divider
                        sx={{
                            my: 2,
                        }}
                    />

                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{
                            py: 3,
                        }}
                    >
                        Your cart is empty.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // MAIN UI
    // =================================================

    return (
        <Card
            sx={{
                borderRadius: 3,
            }}
        >
            <CardContent>
                <Stack spacing={2}>

                    {/* =================================
                        HEADER
                    ================================= */}

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Order Summary
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {safeItems.length}{" "}
                            {safeItems.length === 1
                                ? "item"
                                : "items"}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* =================================
                        PRODUCTS
                    ================================= */}

                    <List disablePadding>
                        {safeItems.map(
                            (
                                item,
                                index
                            ) => {
                                const name =
                                    getProductName(
                                        item
                                    );

                                const image =
                                    getProductImage(
                                        item
                                    );

                                const quantity =
                                    getQuantity(
                                        item
                                    );

                                const price =
                                    getPrice(
                                        item
                                    );

                                const itemTotal =
                                    getItemTotal(
                                        item
                                    );

                                const key =
                                    item?.id ??
                                    item?.cart_item_id ??
                                    `${item?.product_id}-${index}`;

                                return (
                                    <ListItem
                                        key={key}
                                        disableGutters
                                        sx={{
                                            py: 1.5,
                                        }}
                                    >
                                        {/* PRODUCT IMAGE */}

                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 2,
                                                overflow:
                                                    "hidden",
                                                backgroundColor:
                                                    "grey.100",
                                                mr: 2,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {image ? (
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt={name}
                                                    sx={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "100%",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />
                                            ) : null}
                                        </Box>

                                        {/* PRODUCT INFO */}

                                        <Box
                                            sx={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Typography
                                                fontWeight={600}
                                                noWrap
                                            >
                                                {name}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Qty:{" "}
                                                {quantity}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Rs.{" "}
                                                {formatPrice(
                                                    price
                                                )}
                                            </Typography>
                                        </Box>

                                        {/* ITEM TOTAL */}

                                        <Typography
                                            fontWeight={700}
                                            sx={{
                                                ml: 1,
                                            }}
                                        >
                                            Rs.{" "}
                                            {formatPrice(
                                                itemTotal
                                            )}
                                        </Typography>
                                    </ListItem>
                                );
                            }
                        )}
                    </List>

                    <Divider />

                    {/* =================================
                        ORIGINAL SUBTOTAL
                    ================================= */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography
                            color="text.secondary"
                        >
                            Subtotal
                        </Typography>

                        <Typography
                            fontWeight={600}
                        >
                            Rs.{" "}
                            {formatPrice(
                                originalSubtotal
                            )}
                        </Typography>
                    </Stack>

                    {/* =================================
                        CURRENT COUPON
                    ================================= */}

                    {hasAppliedCoupon && (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    color="success.main"
                                    fontWeight={600}
                                >
                                    Coupon
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {
                                        displayCouponCode
                                    }
                                </Typography>
                            </Box>

                            <Typography
                                color="success.main"
                                fontWeight={700}
                            >
                                - Rs.{" "}
                                {formatPrice(
                                    safeDiscount
                                )}
                            </Typography>
                        </Stack>
                    )}

                    {/* =================================
                        SHIPPING
                    ================================= */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Typography
                            color="text.secondary"
                        >
                            Shipping
                        </Typography>

                        <Typography
                            color="success.main"
                            fontWeight={600}
                        >
                            Free
                        </Typography>
                    </Stack>

                    <Divider />

                    {/* =================================
                        FINAL TOTAL
                    ================================= */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Total
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={800}
                            color="primary"
                        >
                            Rs.{" "}
                            {formatPrice(
                                calculatedFinalTotal
                            )}
                        </Typography>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

OrderSummary.propTypes = {
    items: PropTypes.array,

    /*
     * Kept for parent compatibility.
     *
     * These values are NOT trusted for the actual
     * calculation when cart items are available.
     */
    subtotal: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    total: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    coupon: PropTypes.object,

    couponCode: PropTypes.string,

    discount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    discountAmount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    finalTotal: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),

    loading: PropTypes.bool,
};

export default OrderSummary;


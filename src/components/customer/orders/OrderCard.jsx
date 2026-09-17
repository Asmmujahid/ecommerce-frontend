import React from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    CancelOutlined,
    DeleteOutline,
    Inventory2Outlined,
    PaymentOutlined,
    VisibilityOutlined,
} from "@mui/icons-material";

// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (amount) => {
    const value = Number(amount ?? 0);

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// -----------------------------------------------------

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(parsedDate);
};

// -----------------------------------------------------

const formatStatus = (status) => {
    if (!status) {
        return "Unknown";
    }

    return String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

// -----------------------------------------------------

const getStatusColor = (status) => {
    const normalized = String(status ?? "")
        .trim()
        .toLowerCase();

    switch (normalized) {
        case "pending":
            return "warning";

        case "processing":
            return "info";

        case "shipped":
            return "primary";

        case "delivered":
            return "success";

        case "completed":
            return "success";

        case "cancelled":
        case "canceled":
            return "error";

        case "returned":
            return "secondary";

        default:
            return "default";
    }
};

// -----------------------------------------------------

const getPaymentStatusColor = (status) => {
    const normalized = String(status ?? "")
        .trim()
        .toLowerCase();

    switch (normalized) {
        case "paid":
            return "success";

        case "failed":
            return "error";

        case "pending":
            return "warning";

        case "refunded":
            return "info";

        case "cancelled":
        case "canceled":
            return "error";

        default:
            return "default";
    }
};

// -----------------------------------------------------

const getPaymentMethodLabel = (method) => {
    const normalized = String(method ?? "")
        .trim()
        .toLowerCase();

    const methods = {
        cod: "Cash on Delivery",
        card: "Card",
        online: "Online Payment",
        wallet: "Wallet",
    };

    return methods[normalized] ?? method ?? "N/A";
};

// -----------------------------------------------------

const getProductName = (item) => {
    return (
        item?.product?.name ||
        item?.product?.title ||
        item?.product_name ||
        `Product #${item?.product_id ?? ""}`
    );
};

// -----------------------------------------------------

const getProductImage = (item) => {
    const product = item?.product ?? {};

    if (product?.image) {
        return product.image;
    }

    if (product?.image_url) {
        return product.image_url;
    }

    if (product?.thumbnail) {
        return product.thumbnail;
    }

    if (product?.featured_image) {
        return product.featured_image;
    }

    if (product?.main_image) {
        return product.main_image;
    }

    if (Array.isArray(product?.images) && product.images.length > 0) {
        const firstImage = product.images[0];

        if (typeof firstImage === "string") {
            return firstImage;
        }

        return (
            firstImage?.image ||
            firstImage?.url ||
            firstImage?.image_url ||
            null
        );
    }

    if (item?.image) {
        return item.image;
    }

    return null;
};

// -----------------------------------------------------

const getItemPrice = (item) => {
    return Number(
        item?.price ??
        item?.unit_price ??
        0
    );
};

// -----------------------------------------------------

const getItemTotal = (item) => {
    const quantity = Number(item?.quantity ?? 0);

    const price = getItemPrice(item);

    if (
        item?.total !== undefined &&
        item?.total !== null
    ) {
        return Number(item.total);
    }

    if (
        item?.subtotal !== undefined &&
        item?.subtotal !== null
    ) {
        return Number(item.subtotal);
    }

    return price * quantity;
};

// =====================================================
// COMPONENT
// =====================================================

const OrderCard = ({
    orders = [],
    loading = false,

    onView,
    onCancel,
    onDelete,

    cancellingOrderId = null,
    deletingOrderId = null,
}) => {
    // =================================================
    // SAFETY
    // =================================================

    const safeOrders = Array.isArray(orders)
        ? orders
        : [];

    // =================================================
    // LOADING
    // =================================================

    if (
        loading &&
        safeOrders.length === 0
    ) {
        return (
            <Card
                variant="outlined"
                elevation={0}
                sx={{
                    borderRadius: 3,
                }}
            >
                <CardContent
                    sx={{
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing={2}
                    >
                        <CircularProgress />

                        <Typography color="text.secondary">
                            Loading your orders...
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // EMPTY
    // =================================================

    if (safeOrders.length === 0) {
        return (
            <Card
                variant="outlined"
                elevation={0}
                sx={{
                    borderRadius: 3,
                }}
            >
                <CardContent
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography color="text.secondary">
                        No orders found.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Grid
            container
            spacing={3}
        >
            {safeOrders.map((order, orderIndex) => {
                if (!order) {
                    return null;
                }

                // =================================================
                // NORMALIZE STATUS
                // =================================================

                const status = String(
                    order.status ?? ""
                )
                    .trim()
                    .toLowerCase();

                // =================================================
                // CANCEL RULE
                // Only pending orders can be cancelled
                // =================================================

                const canCancel =
                    status === "pending";

                // =================================================
                // DELETE RULE
                //
                // Customer can delete:
                // - delivered
                // - completed
                // - cancelled
                // =================================================

                const canDelete =
                    status === "delivered" ||
                    status === "completed" ||
                    status === "cancelled" ||
                    status === "canceled";

                // =================================================
                // LOADING STATES
                // =================================================

                const isCancelling =
                    String(cancellingOrderId) ===
                    String(order.id);

                const isDeleting =
                    String(deletingOrderId) ===
                    String(order.id);

                // =================================================
                // ITEMS
                // =================================================

                const items = Array.isArray(order.items)
                    ? order.items
                    : [];

                // =================================================
                // QUANTITY
                // =================================================

                const totalQuantity = items.reduce(
                    (total, item) =>
                        total +
                        Number(item?.quantity ?? 0),
                    0
                );

                // =================================================
                // FALLBACK CALCULATED SUBTOTAL
                // Used only when backend subtotal is unavailable
                // =================================================

                const calculatedSubtotal = items.reduce(
                    (total, item) =>
                        total +
                        getItemTotal(item),
                    0
                );

                // =================================================
                // BACKEND SUBTOTAL
                //
                // Prefer the value saved in the orders table.
                // =================================================

                const backendSubtotal =
                    order?.subtotal_amount;

                const subtotal =
                    backendSubtotal !== undefined &&
                    backendSubtotal !== null &&
                    Number.isFinite(
                        Number(backendSubtotal)
                    )
                        ? Number(backendSubtotal)
                        : calculatedSubtotal;

                // =================================================
                // BACKEND DISCOUNT
                // =================================================

                const discountValue = Number(
                    order?.discount_amount ?? 0
                );

                const discount =
                    Number.isFinite(discountValue) &&
                    discountValue > 0
                        ? discountValue
                        : 0;

                // =================================================
                // COUPON CODE
                //
                // Prefer coupon_code because this is the historical
                // snapshot saved with the order.
                // =================================================

                const couponCode =
                    order?.coupon_code ||
                    order?.coupon?.code ||
                    null;

                // =================================================
                // BACKEND TOTAL
                //
                // Prefer total_amount saved by Laravel.
                // =================================================

                const backendTotal =
                    order?.total_amount ??
                    order?.total;

                const orderTotal =
                    backendTotal !== undefined &&
                    backendTotal !== null &&
                    Number.isFinite(
                        Number(backendTotal)
                    )
                        ? Number(backendTotal)
                        : Math.max(
                              0,
                              subtotal - discount
                          );

                // =================================================
                // KEY
                // =================================================

                const orderKey =
                    order.id ??
                    order.order_number ??
                    orderIndex;

                // =================================================
                // CARD
                // =================================================

                return (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={4}
                        key={orderKey}
                    >
                        <Card
                            variant="outlined"
                            elevation={0}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                overflow: "hidden",
                                transition:
                                    "all 0.2s ease",

                                "&:hover": {
                                    boxShadow: 3,
                                    transform:
                                        "translateY(-2px)",
                                },
                            }}
                        >
                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor:
                                        "action.hover",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={1}
                                >
                                    <Box
                                        sx={{
                                            minWidth: 0,
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={700}
                                            sx={{
                                                wordBreak:
                                                    "break-word",
                                            }}
                                        >
                                            Order #
                                            {order.order_number ??
                                                order.id}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 0.5,
                                            }}
                                        >
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={formatStatus(
                                            status
                                        )}
                                        color={getStatusColor(
                                            status
                                        )}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            flexShrink: 0,
                                        }}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* =================================================
                                CARD CONTENT
                            ================================================= */}

                            <CardContent
                                sx={{
                                    p: 2.5,
                                    flex: 1,
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                }}
                            >
                                {/* =================================================
                                    ORDER INFORMATION
                                ================================================= */}

                                <Stack spacing={1.5}>
                                    {/* Payment */}

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <PaymentOutlined
                                            fontSize="small"
                                            color="primary"
                                        />

                                        <Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                Payment
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {getPaymentMethodLabel(
                                                    order.payment_method
                                                )}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Payment Status */}

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Payment Status
                                        </Typography>

                                        <Chip
                                            label={formatStatus(
                                                order.payment_status ??
                                                    "pending"
                                            )}
                                            color={getPaymentStatusColor(
                                                order.payment_status
                                            )}
                                            size="small"
                                        />
                                    </Stack>

                                    {/* Items */}

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Items
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {totalQuantity}
                                        </Typography>
                                    </Stack>

                                    {/* =================================================
                                        SUBTOTAL
                                    ================================================= */}

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Subtotal
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatCurrency(
                                                subtotal
                                            )}
                                        </Typography>
                                    </Stack>

                                    {/* =================================================
                                        COUPON / DISCOUNT
                                    ================================================= */}

                                    {discount > 0 && (
                                        <Stack spacing={0.5}>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Discount
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    color="success.main"
                                                >
                                                    -
                                                    {formatCurrency(
                                                        discount
                                                    )}
                                                </Typography>
                                            </Stack>

                                            {couponCode && (
                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "flex-end",
                                                    }}
                                                >
                                                    <Chip
                                                        label={`Coupon: ${couponCode}`}
                                                        color="success"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Stack>
                                    )}

                                    {/* =================================================
                                        TOTAL
                                    ================================================= */}

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            color="primary"
                                        >
                                            {formatCurrency(
                                                orderTotal
                                            )}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Divider
                                    sx={{
                                        my: 2,
                                    }}
                                />

                                {/* =================================================
                                    PRODUCTS
                                ================================================= */}

                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    Products
                                </Typography>

                                <Stack spacing={1.5}>
                                    {items.length > 0 ? (
                                        items
                                            .slice(0, 3)
                                            .map(
                                                (
                                                    item,
                                                    itemIndex
                                                ) => {
                                                    const image =
                                                        getProductImage(
                                                            item
                                                        );

                                                    const productName =
                                                        getProductName(
                                                            item
                                                        );

                                                    const quantity =
                                                        Number(
                                                            item?.quantity ??
                                                                0
                                                        );

                                                    return (
                                                        <Stack
                                                            key={
                                                                item?.id ??
                                                                itemIndex
                                                            }
                                                            direction="row"
                                                            spacing={
                                                                1.5
                                                            }
                                                            alignItems="center"
                                                        >
                                                            {/* Image */}

                                                            <Box
                                                                sx={{
                                                                    width: 52,
                                                                    height: 52,
                                                                    borderRadius: 1.5,
                                                                    overflow:
                                                                        "hidden",
                                                                    bgcolor:
                                                                        "action.hover",
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {image ? (
                                                                    <Box
                                                                        component="img"
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            productName
                                                                        }
                                                                        sx={{
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            objectFit:
                                                                                "cover",
                                                                        }}
                                                                        onError={(
                                                                            event
                                                                        ) => {
                                                                            event.currentTarget.style.display =
                                                                                "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Inventory2Outlined
                                                                        color="disabled"
                                                                        fontSize="small"
                                                                    />
                                                                )}
                                                            </Box>

                                                            {/* Product */}

                                                            <Box
                                                                sx={{
                                                                    minWidth: 0,
                                                                    flex: 1,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={600}
                                                                    noWrap
                                                                >
                                                                    {
                                                                        productName
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    Qty:{" "}
                                                                    {
                                                                        quantity
                                                                    }
                                                                </Typography>
                                                            </Box>

                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                                sx={{
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    getItemTotal(
                                                                        item
                                                                    )
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                    );
                                                }
                                            )
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No product information
                                            available.
                                        </Typography>
                                    )}

                                    {items.length > 3 && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            +
                                            {items.length - 3}{" "}
                                            more product
                                            {items.length - 3 !== 1
                                                ? "s"
                                                : ""}
                                        </Typography>
                                    )}
                                </Stack>

                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <Box
                                    sx={{
                                        mt: "auto",
                                        pt: 2,
                                    }}
                                >
                                    <Divider
                                        sx={{
                                            mb: 2,
                                        }}
                                    />

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            sm: "row",
                                        }}
                                        spacing={1}
                                    >
                                        {/* =================================================
                                            VIEW ORDER
                                        ================================================= */}

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={
                                                <VisibilityOutlined />
                                            }
                                            onClick={() => {
                                                if (onView) {
                                                    onView(order);
                                                }
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform:
                                                    "none",
                                            }}
                                        >
                                            View Order
                                        </Button>

                                        {/* =================================================
                                            CANCEL
                                        ================================================= */}

                                        {canCancel && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                startIcon={
                                                    isCancelling ? (
                                                        <CircularProgress
                                                            size={17}
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        <CancelOutlined />
                                                    )
                                                }
                                                disabled={
                                                    isCancelling ||
                                                    isDeleting
                                                }
                                                onClick={() => {
                                                    if (
                                                        onCancel
                                                    ) {
                                                        onCancel(
                                                            order
                                                        );
                                                    }
                                                }}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform:
                                                        "none",
                                                }}
                                            >
                                                {isCancelling
                                                    ? "Cancelling..."
                                                    : "Cancel"}
                                            </Button>
                                        )}

                                        {/* =================================================
                                            DELETE
                                        ================================================= */}

                                        {canDelete && (
                                            <Tooltip
                                                title={
                                                    status ===
                                                        "cancelled" ||
                                                    status ===
                                                        "canceled"
                                                        ? "Delete cancelled order"
                                                        : "Delete order history"
                                                }
                                            >
                                                <span>
                                                    <IconButton
                                                        color="error"
                                                        disabled={
                                                            isDeleting ||
                                                            isCancelling
                                                        }
                                                        onClick={() => {
                                                            if (
                                                                isDeleting
                                                            ) {
                                                                return;
                                                            }

                                                            if (
                                                                !onDelete
                                                            ) {
                                                                console.error(
                                                                    "onDelete callback is missing from OrderCard."
                                                                );

                                                                return;
                                                            }

                                                            const confirmed =
                                                                window.confirm(
                                                                    "Are you sure you want to delete this order from your order history?"
                                                                );

                                                            if (
                                                                !confirmed
                                                            ) {
                                                                return;
                                                            }

                                                            onDelete(
                                                                order
                                                            );
                                                        }}
                                                        sx={{
                                                            border:
                                                                "1px solid",
                                                            borderColor:
                                                                "error.main",
                                                            borderRadius: 2,
                                                            minWidth: 44,
                                                            minHeight: 44,
                                                        }}
                                                    >
                                                        {isDeleting ? (
                                                            <CircularProgress
                                                                size={
                                                                    20
                                                                }
                                                                color="inherit"
                                                            />
                                                        ) : (
                                                            <DeleteOutline />
                                                        )}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default OrderCard;

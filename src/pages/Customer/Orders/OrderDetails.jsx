// src/pages/Customer/Orders/OrderDetails.jsx

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Link,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    AssignmentReturnOutlined,
    CancelOutlined,
    CheckCircleOutline,
    LocalShippingOutlined,
    LocationOnOutlined,
    PaymentOutlined,
    ReceiptLongOutlined,
    ShoppingBagOutlined,
} from "@mui/icons-material";

import OrderStatus from "../../../components/customer/orders/OrderStatus";

import {
    fetchOrder,
    cancelOrder,
    clearOrderError,
    selectCurrentOrder,
    selectOrderLoading,
    selectOrderError,
} from "../../../redux/customer/orderSlice";

// =====================================================
// HELPERS
// =====================================================

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount)) {
        return "Rs. 0.00";
    }

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// =====================================================

const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);
};

// =====================================================

const formatStatus = (status) => {
    if (!status) {
        return "N/A";
    }

    return String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};

// =====================================================

const getPaymentMethodLabel = (method) => {
    const methods = {
        cod: "Cash on Delivery",
        card: "Card",
        online: "Online Payment",
        wallet: "Wallet",
    };

    return (
        methods[method] ??
        method ??
        "N/A"
    );
};

// =====================================================

const getPaymentStatusLabel = (status) => {
    if (!status) {
        return "Pending";
    }

    return formatStatus(status);
};

// =====================================================
// RETURN ELIGIBILITY
// =====================================================

const isReturnEligible = (order) => {
    if (!order) {
        return false;
    }

    const status = String(
        order.status ?? ""
    )
        .trim()
        .toLowerCase();

    return (
        status === "delivered" ||
        status === "completed"
    );
};

// =====================================================
// PRODUCT IMAGE
// =====================================================

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

    if (
        Array.isArray(product?.images) &&
        product.images.length > 0
    ) {
        const firstImage =
            product.images[0];

        if (
            typeof firstImage ===
            "string"
        ) {
            return firstImage;
        }

        return (
            firstImage?.image ||
            firstImage?.image_url ||
            firstImage?.url ||
            null
        );
    }

    if (item?.image) {
        return item.image;
    }

    return null;
};

// =====================================================
// PRODUCT NAME
// =====================================================

const getProductName = (item) => {
    return (
        item?.product?.name ||
        item?.product?.title ||
        item?.product_name ||
        `Product #${
            item?.product_id ?? "N/A"
        }`
    );
};

// =====================================================
// VARIANT INFORMATION
// =====================================================

const getVariantInfo = (item) => {
    const variant =
        item?.productVariant ||
        item?.product_variant ||
        item?.variant;

    if (!variant) {
        return [];
    }

    const details = [];

    if (variant.color) {
        details.push(
            `Color: ${variant.color}`
        );
    }

    if (variant.size) {
        details.push(
            `Size: ${variant.size}`
        );
    }

    if (variant.name) {
        details.push(
            variant.name
        );
    }

    if (variant.sku) {
        details.push(
            `SKU: ${variant.sku}`
        );
    }

    return details;
};

// =====================================================
// COMPONENT
// =====================================================

const OrderDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    // =================================================
    // REDUX
    // =================================================

    const order = useSelector(
        selectCurrentOrder
    );

    const loading = useSelector(
        selectOrderLoading
    );

    const error = useSelector(
        selectOrderError
    );

    // =================================================
    // LOCAL STATE
    // =================================================

    const [cancelling, setCancelling] =
        useState(false);

    const [cancelError, setCancelError] =
        useState("");

    const [cancelSuccess, setCancelSuccess] =
        useState("");

    // =================================================
    // FETCH ORDER
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(fetchOrder(id));

        return () => {
            dispatch(clearOrderError());
        };
    }, [dispatch, id]);

    // =================================================
    // RETURN ELIGIBILITY
    // =================================================

    const returnEligible = useMemo(() => {
        return isReturnEligible(order);
    }, [order]);

    // =================================================
    // ITEMS
    // =================================================

    const items = useMemo(() => {
        return Array.isArray(
            order?.items
        )
            ? order.items
            : [];
    }, [order]);

    // =================================================
    // TOTAL QUANTITY
    // =================================================

    const totalQuantity = useMemo(() => {
        return items.reduce(
            (total, item) =>
                total +
                Number(
                    item?.quantity ?? 0
                ),
            0
        );
    }, [items]);

    // =================================================
    // SUBTOTAL
    //
    // IMPORTANT:
    // Use backend subtotal_amount first.
    // Fallback to item calculation only
    // for old orders.
    // =================================================

    const calculatedSubtotal = useMemo(() => {
        return items.reduce(
            (total, item) => {
                const quantity =
                    Number(
                        item?.quantity ?? 0
                    );

                const price =
                    Number(
                        item?.price ??
                            item?.unit_price ??
                            0
                    );

                const itemTotal =
                    item?.total !==
                        undefined &&
                    item?.total !== null
                        ? Number(
                              item.total
                          )
                        : item?.subtotal !==
                              undefined &&
                          item?.subtotal !==
                              null
                        ? Number(
                              item.subtotal
                          )
                        : price *
                          quantity;

                return (
                    total +
                    (Number.isFinite(
                        itemTotal
                    )
                        ? itemTotal
                        : 0)
                );
            },
            0
        );
    }, [items]);

    const orderSubtotal = useMemo(() => {
        const backendSubtotal =
            order?.subtotal_amount;

        if (
            backendSubtotal !==
                undefined &&
            backendSubtotal !== null &&
            Number.isFinite(
                Number(
                    backendSubtotal
                )
            )
        ) {
            return Number(
                backendSubtotal
            );
        }

        return calculatedSubtotal;
    }, [
        order,
        calculatedSubtotal,
    ]);

    // =================================================
    // DISCOUNT
    // =================================================

    const orderDiscount = useMemo(() => {
        const discount =
            order?.discount_amount;

        if (
            discount !== undefined &&
            discount !== null &&
            Number.isFinite(
                Number(discount)
            )
        ) {
            return Math.max(
                Number(discount),
                0
            );
        }

        return 0;
    }, [order]);

    // =================================================
    // COUPON CODE
    // =================================================

    const couponCode = useMemo(() => {
        return (
            order?.coupon_code ||
            order?.coupon?.code ||
            ""
        );
    }, [order]);

    // =================================================
    // ORDER TOTAL
    //
    // Backend total_amount is the FINAL
    // discounted amount.
    // =================================================

    const orderTotal = useMemo(() => {
        const backendTotal =
            order?.total_amount ??
            order?.total;

        if (
            backendTotal !==
                undefined &&
            backendTotal !== null &&
            Number.isFinite(
                Number(backendTotal)
            )
        ) {
            return Number(
                backendTotal
            );
        }

        return Math.max(
            orderSubtotal -
                orderDiscount,
            0
        );
    }, [
        order,
        orderSubtotal,
        orderDiscount,
    ]);

    // =================================================
    // CANCEL ORDER
    // =================================================

    const handleCancelOrder = async () => {
        if (!order?.id) {
            return;
        }

        const status = String(
            order.status ?? ""
        )
            .trim()
            .toLowerCase();

        if (status !== "pending") {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }

        setCancelling(true);
        setCancelError("");
        setCancelSuccess("");

        try {
            await dispatch(
                cancelOrder(order.id)
            ).unwrap();

            setCancelSuccess(
                "Order cancelled successfully."
            );

            await dispatch(
                fetchOrder(order.id)
            ).unwrap();
        } catch (cancelError) {
            console.error(
                "Cancel order error:",
                cancelError
            );

            const message =
                typeof cancelError ===
                "string"
                    ? cancelError
                    : cancelError?.message ??
                      cancelError?.error ??
                      "Failed to cancel the order.";

            setCancelError(message);
        } finally {
            setCancelling(false);
        }
    };

    // =================================================
    // RETURN PRODUCT
    // =================================================

    const handleReturnProduct = (
        orderItem
    ) => {
        if (!order?.id) {
            window.alert(
                "Order information is missing."
            );

            return;
        }

        if (!orderItem?.id) {
            window.alert(
                "Order item information is missing."
            );

            return;
        }

        navigate(
            "/customer/returns/create",
            {
                state: {
                    orderId: order.id,
                    orderItemId:
                        orderItem.id,
                },
            }
        );
    };

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: 8,
                }}
            >
                <Box
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        flexDirection:
                            "column",
                        gap: 2,
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading order
                        details...
                    </Typography>
                </Box>
            </Container>
        );
    }

    // =================================================
    // ORDER NOT FOUND
    // =================================================

    if (error || !order) {
        return (
            <Container
                maxWidth="lg"
                sx={{
                    py: 5,
                }}
            >
                <Breadcrumbs
                    sx={{
                        mb: 4,
                    }}
                >
                    <Link
                        component="button"
                        underline="hover"
                        color="inherit"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Home
                    </Link>

                    <Link
                        component="button"
                        underline="hover"
                        color="inherit"
                        onClick={() =>
                            navigate(
                                "/customer/orders"
                            )
                        }
                    >
                        Orders
                    </Link>

                    <Typography color="text.primary">
                        Order Details
                    </Typography>
                </Breadcrumbs>

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 3,
                            sm: 5,
                        },
                        textAlign:
                            "center",
                        border: "1px solid",
                        borderColor:
                            "divider",
                        borderRadius: 3,
                    }}
                >
                    <ReceiptLongOutlined
                        sx={{
                            fontSize: 70,
                            color: "text.secondary",
                            mb: 2,
                        }}
                    />

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Order Not Found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3,
                        }}
                    >
                        {typeof error ===
                        "string"
                            ? error
                            : error?.message ??
                              "We could not find this order."}
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/customer/orders"
                            )
                        }
                    >
                        Back to Orders
                    </Button>
                </Paper>
            </Container>
        );
    }

    // =================================================
    // NORMALIZED STATUS
    // =================================================

    const currentStatus =
        String(
            order.status ?? ""
        )
            .trim()
            .toLowerCase();

    const canCancel =
        currentStatus ===
        "pending";

    // =================================================
    // MAIN
    // =================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            {/* =================================================
                BREADCRUMBS
            ================================================= */}

            <Breadcrumbs
                sx={{
                    mb: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Home
                </Link>

                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={() =>
                        navigate(
                            "/customer/orders"
                        )
                    }
                >
                    Orders
                </Link>

                <Typography color="text.primary">
                    Order Details
                </Typography>
            </Breadcrumbs>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box sx={{ mb: 4 }}>
                <Button
                    variant="text"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/customer/orders"
                        )
                    }
                    sx={{
                        mb: 2,
                    }}
                >
                    Back to Orders
                </Button>

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    spacing={2}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    xs: "1.7rem",
                                    md: "2.2rem",
                                },
                            }}
                        >
                            Order Details
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
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
                            Placed on{" "}
                            {formatDate(
                                order.created_at
                            )}
                        </Typography>
                    </Box>

                    <OrderStatus
                        status={
                            order.status
                        }
                        paymentStatus={
                            order.payment_status
                        }
                        showPaymentStatus
                    />
                </Stack>
            </Box>

            {/* =================================================
                SUCCESS / ERROR
            ================================================= */}

            {cancelSuccess && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                    icon={
                        <CheckCircleOutline />
                    }
                    onClose={() =>
                        setCancelSuccess("")
                    }
                >
                    {cancelSuccess}
                </Alert>
            )}

            {cancelError && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                    onClose={() =>
                        setCancelError("")
                    }
                >
                    {cancelError}
                </Alert>
            )}

            {/* =================================================
                RETURN INFORMATION
            ================================================= */}

            {returnEligible ? (
                <Alert
                    severity="info"
                    icon={
                        <AssignmentReturnOutlined />
                    }
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    This order has
                    been delivered.
                    You can request
                    a return for
                    eligible products
                    below.
                </Alert>
            ) : (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                >
                    Return requests
                    are available
                    after the order
                    has been
                    delivered.
                </Alert>
            )}

            {/* =================================================
                ORDER STATUS CARD
            ================================================= */}

            <Card
                variant="outlined"
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                }}
            >
                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={3}
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                        justifyContent="space-between"
                    >
                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                <LocalShippingOutlined color="primary" />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Order Status
                                </Typography>
                            </Stack>

                            <Typography color="text.secondary">
                                Your order is
                                currently{" "}
                                <strong>
                                    {formatStatus(
                                        order.status
                                    )}
                                </strong>
                                .
                            </Typography>
                        </Box>

                        {canCancel && (
                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={
                                    cancelling ? (
                                        <CircularProgress
                                            size={
                                                18
                                            }
                                            color="inherit"
                                        />
                                    ) : (
                                        <CancelOutlined />
                                    )
                                }
                                disabled={
                                    cancelling
                                }
                                onClick={
                                    handleCancelOrder
                                }
                                sx={{
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                }}
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Order"}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Grid
                container
                spacing={3}
                alignItems="flex-start"
            >
                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >
                    <Stack spacing={3}>
                        {/* =================================================
                            ORDER ITEMS
                        ================================================= */}

                        <Card
                            elevation={0}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    <ShoppingBagOutlined color="primary" />

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >
                                            Order Items
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {
                                                items.length
                                            }{" "}
                                            product
                                            {items.length !==
                                            1
                                                ? "s"
                                                : ""}{" "}
                                            ·{" "}
                                            {
                                                totalQuantity
                                            }{" "}
                                            item
                                            {totalQuantity !==
                                            1
                                                ? "s"
                                                : ""}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 2,
                                    }}
                                />

                                {/* ITEMS */}

                                {items.length >
                                0 ? (
                                    <Stack spacing={2}>
                                        {items.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const productName =
                                                    getProductName(
                                                        item
                                                    );

                                                const image =
                                                    getProductImage(
                                                        item
                                                    );

                                                const quantity =
                                                    Number(
                                                        item?.quantity ??
                                                            0
                                                    );

                                                const price =
                                                    Number(
                                                        item?.price ??
                                                            item?.unit_price ??
                                                            0
                                                    );

                                                const total =
                                                    item?.total !==
                                                        undefined &&
                                                    item?.total !==
                                                        null
                                                        ? Number(
                                                              item.total
                                                          )
                                                        : item?.subtotal !==
                                                              undefined &&
                                                          item?.subtotal !==
                                                              null
                                                        ? Number(
                                                              item.subtotal
                                                          )
                                                        : price *
                                                          quantity;

                                                const variantInfo =
                                                    getVariantInfo(
                                                        item
                                                    );

                                                const itemId =
                                                    item?.id;

                                                return (
                                                    <Card
                                                        key={
                                                            itemId ??
                                                            index
                                                        }
                                                        variant="outlined"
                                                        elevation={
                                                            0
                                                        }
                                                        sx={{
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{
                                                                p: 2,
                                                                "&:last-child":
                                                                    {
                                                                        pb: 2,
                                                                    },
                                                            }}
                                                        >
                                                            <Stack
                                                                direction={{
                                                                    xs: "column",
                                                                    sm: "row",
                                                                }}
                                                                spacing={
                                                                    2
                                                                }
                                                                alignItems={{
                                                                    xs: "flex-start",
                                                                    sm: "center",
                                                                }}
                                                            >
                                                                {/* IMAGE */}

                                                                <Box
                                                                    sx={{
                                                                        width: {
                                                                            xs: 75,
                                                                            sm: 90,
                                                                        },
                                                                        height: {
                                                                            xs: 75,
                                                                            sm: 90,
                                                                        },
                                                                        flexShrink: 0,
                                                                        borderRadius: 2,
                                                                        overflow:
                                                                            "hidden",
                                                                        border: "1px solid",
                                                                        borderColor:
                                                                            "divider",
                                                                        bgcolor:
                                                                            "action.hover",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
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
                                                                        <ShoppingBagOutlined
                                                                            color="disabled"
                                                                        />
                                                                    )}
                                                                </Box>

                                                                {/* PRODUCT INFO */}

                                                                <Box
                                                                    sx={{
                                                                        flex: 1,
                                                                        minWidth: 0,
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        fontWeight={
                                                                            700
                                                                        }
                                                                        sx={{
                                                                            wordBreak:
                                                                                "break-word",
                                                                        }}
                                                                    >
                                                                        {
                                                                            productName
                                                                        }
                                                                    </Typography>

                                                                    {variantInfo.length >
                                                                        0 && (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={
                                                                                1
                                                                            }
                                                                            flexWrap="wrap"
                                                                            useFlexGap
                                                                            sx={{
                                                                                mt: 0.5,
                                                                            }}
                                                                        >
                                                                            {variantInfo.map(
                                                                                (
                                                                                    detail,
                                                                                    variantIndex
                                                                                ) => (
                                                                                    <Typography
                                                                                        key={`${detail}-${variantIndex}`}
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                    >
                                                                                        {
                                                                                            detail
                                                                                        }
                                                                                    </Typography>
                                                                                )
                                                                            )}
                                                                        </Stack>
                                                                    )}

                                                                    {item?.product_id && (
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                            display="block"
                                                                            sx={{
                                                                                mt: 0.5,
                                                                            }}
                                                                        >
                                                                            Product
                                                                            ID:{" "}
                                                                            {
                                                                                item.product_id
                                                                            }
                                                                        </Typography>
                                                                    )}

                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            mt: 1,
                                                                        }}
                                                                    >
                                                                        Quantity:{" "}
                                                                        <strong>
                                                                            {
                                                                                quantity
                                                                            }
                                                                        </strong>
                                                                    </Typography>

                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        Unit
                                                                        Price:{" "}
                                                                        {formatCurrency(
                                                                            price
                                                                        )}
                                                                    </Typography>
                                                                </Box>

                                                                {/* TOTAL + RETURN */}

                                                                <Box
                                                                    sx={{
                                                                        width: {
                                                                            xs: "100%",
                                                                            sm: "auto",
                                                                        },
                                                                        minWidth:
                                                                            {
                                                                                sm: 150,
                                                                            },
                                                                        textAlign:
                                                                            {
                                                                                xs: "left",
                                                                                sm: "right",
                                                                            },
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        Item
                                                                        Total
                                                                    </Typography>

                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight={
                                                                            700
                                                                        }
                                                                        color="primary"
                                                                    >
                                                                        {formatCurrency(
                                                                            total
                                                                        )}
                                                                    </Typography>

                                                                    {returnEligible ? (
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            color="warning"
                                                                            startIcon={
                                                                                <AssignmentReturnOutlined />
                                                                            }
                                                                            disabled={
                                                                                !itemId
                                                                            }
                                                                            onClick={() =>
                                                                                handleReturnProduct(
                                                                                    item
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                mt: 1,
                                                                                borderRadius: 2,
                                                                                textTransform:
                                                                                    "none",
                                                                                whiteSpace:
                                                                                    "nowrap",
                                                                            }}
                                                                        >
                                                                            Return
                                                                            Product
                                                                        </Button>
                                                                    ) : (
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                            display="block"
                                                                            sx={{
                                                                                mt: 1,
                                                                            }}
                                                                        >
                                                                            Return
                                                                            available
                                                                            after
                                                                            delivery
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            }
                                        )}
                                    </Stack>
                                ) : (
                                    <Box
                                        sx={{
                                            py: 5,
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        <ShoppingBagOutlined
                                            sx={{
                                                fontSize: 50,
                                                color: "text.secondary",
                                                mb: 1,
                                            }}
                                        />

                                        <Typography fontWeight={600}>
                                            No items found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No product
                                            information
                                            is available
                                            for this
                                            order.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* =================================================
                            SHIPPING ADDRESS
                        ================================================= */}

                        <Card
                            elevation={0}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    <LocationOnOutlined color="primary" />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Shipping Address
                                    </Typography>
                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 2,
                                    }}
                                />

                                <Typography
                                    sx={{
                                        whiteSpace:
                                            "pre-line",
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {order.shipping_address ??
                                        order.address ??
                                        "No shipping address available."}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* =================================================
                            PAYMENT INFORMATION
                        ================================================= */}

                        <Card
                            elevation={0}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    <PaymentOutlined color="primary" />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Payment Information
                                    </Typography>
                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 2,
                                    }}
                                />

                                <Grid
                                    container
                                    spacing={2}
                                >
                                    {/* PAYMENT METHOD */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Payment
                                            Method
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                mt: 0.5,
                                            }}
                                        >
                                            {getPaymentMethodLabel(
                                                order.payment_method
                                            )}
                                        </Typography>
                                    </Grid>

                                    {/* PAYMENT STATUS */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Payment
                                            Status
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                mt: 0.5,
                                            }}
                                        >
                                            {getPaymentStatusLabel(
                                                order.payment_status
                                            )}
                                        </Typography>
                                    </Grid>

                                    {/* TRANSACTION ID */}

                                    {order
                                        .payment
                                        ?.transaction_id && (
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Transaction
                                                ID
                                            </Typography>

                                            <Typography
                                                fontWeight={600}
                                                sx={{
                                                    mt: 0.5,
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {
                                                    order
                                                        .payment
                                                        .transaction_id
                                                }
                                            </Typography>
                                        </Grid>
                                    )}

                                    {/* PAID AT */}

                                    {order
                                        .payment
                                        ?.paid_at && (
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Paid At
                                            </Typography>

                                            <Typography
                                                fontWeight={600}
                                                sx={{
                                                    mt: 0.5,
                                                }}
                                            >
                                                {formatDate(
                                                    order
                                                        .payment
                                                        .paid_at
                                                )}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* =================================================
                    RIGHT SIDE - ORDER SUMMARY
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Box
                        sx={{
                            position: {
                                md: "sticky",
                            },
                            top: {
                                md: 24,
                            },
                        }}
                    >
                        <Card
                            elevation={0}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: {
                                        xs: 2,
                                        sm: 3,
                                    },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    Order Summary
                                </Typography>

                                <Divider
                                    sx={{
                                        mb: 2,
                                    }}
                                />

                                {/* ITEM COUNT */}

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        Items
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {totalQuantity}
                                    </Typography>
                                </Stack>

                                {/* PRODUCTS */}

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        Products
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {items.length}
                                    </Typography>
                                </Stack>

                                {/* =================================
                                    SUBTOTAL
                                ================================== */}

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        Subtotal
                                    </Typography>

                                    <Typography fontWeight={600}>
                                        {formatCurrency(
                                            orderSubtotal
                                        )}
                                    </Typography>
                                </Stack>

                                {/* =================================
                                    COUPON
                                ================================== */}

                                {couponCode && (
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        sx={{
                                            mb: 1.5,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                color="success.main"
                                                fontWeight={
                                                    600
                                                }
                                            >
                                                Coupon
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {
                                                    couponCode
                                                }
                                            </Typography>
                                        </Box>

                                        {orderDiscount >
                                            0 && (
                                            <Typography
                                                color="success.main"
                                                fontWeight={
                                                    700
                                                }
                                            >
                                                -{" "}
                                                {formatCurrency(
                                                    orderDiscount
                                                )}
                                            </Typography>
                                        )}
                                    </Stack>
                                )}

                                {/* =================================
                                    DISCOUNT
                                ================================== */}

                                {orderDiscount >
                                    0 &&
                                    !couponCode && (
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            sx={{
                                                mb: 1.5,
                                            }}
                                        >
                                            <Typography
                                                color="success.main"
                                                fontWeight={
                                                    600
                                                }
                                            >
                                                Discount
                                            </Typography>

                                            <Typography
                                                color="success.main"
                                                fontWeight={
                                                    700
                                                }
                                            >
                                                -{" "}
                                                {formatCurrency(
                                                    orderDiscount
                                                )}
                                            </Typography>
                                        </Stack>
                                    )}

                                {/* =================================
                                    SHIPPING
                                ================================== */}

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        Shipping
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                        color="success.main"
                                    >
                                        Free
                                    </Typography>
                                </Stack>

                                <Divider
                                    sx={{
                                        my: 2,
                                    }}
                                />

                                {/* =================================
                                    FINAL TOTAL
                                ================================== */}

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
                                        fontWeight={700}
                                        color="primary"
                                    >
                                        {formatCurrency(
                                            orderTotal
                                        )}
                                    </Typography>
                                </Stack>

                                {/* =================================
                                    PAYMENT SUMMARY
                                ================================== */}

                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor:
                                            "action.hover",
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <PaymentOutlined
                                            fontSize="small"
                                            color="primary"
                                        />

                                        <Typography
                                            variant="body2"
                                            fontWeight={
                                                600
                                            }
                                        >
                                            {getPaymentMethodLabel(
                                                order.payment_method
                                            )}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        Payment
                                        status:{" "}
                                        {getPaymentStatusLabel(
                                            order.payment_status
                                        )}
                                    </Typography>
                                </Box>

                                {/* =================================
                                    ORDER STATUS
                                ================================== */}

                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor:
                                            "action.hover",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Order status
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        {formatStatus(
                                            order.status
                                        )}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* CONTINUE SHOPPING */}

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <ShoppingBagOutlined />
                            }
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            sx={{
                                mt: 2,
                                py: 1.3,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform:
                                    "none",
                            }}
                        >
                            Continue Shopping
                        </Button>

                        {/* BACK TO ORDERS */}

                        <Button
                            fullWidth
                            variant="text"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(
                                    "/customer/orders"
                                )
                            }
                            sx={{
                                mt: 1,
                                textTransform:
                                    "none",
                            }}
                        >
                            Back to My Orders
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetails;
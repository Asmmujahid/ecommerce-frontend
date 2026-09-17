import { useEffect } from "react";
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
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import {
    getOrder,
    resetOrderState,
} from "../../../redux/admin/orderSlice";

// ==========================================
// Helpers
// ==========================================

const formatCurrency = (value) => {
    return `Rs. ${Number(
        value || 0
    ).toLocaleString()}`;
};

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    return new Date(
        value
    ).toLocaleString();
};

const getStatusColor = (status) => {
    switch (status) {
        case "pending":
            return "warning";

        case "processing":
            return "info";

        case "shipped":
            return "primary";

        case "delivered":
            return "success";

        case "cancelled":
            return "error";

        default:
            return "default";
    }
};

const getPaymentColor = (status) => {
    switch (status) {
        case "paid":
            return "success";

        case "pending":
            return "warning";

        case "failed":
            return "error";

        case "refunded":
            return "info";

        default:
            return "default";
    }
};

const formatStatus = (status) => {
    if (!status) {
        return "N/A";
    }

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const getOwnerType = (item) => {
    return (
        item?.product_owner_type ||
        item?.product?.owner_type ||
        "vendor"
    );
};

// ==========================================
// Component
// ==========================================

const ViewOrder = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    const {
        order,
        loading,
        error,
    } = useSelector(
        (state) => state.adminOrder
    );

    // ==========================================
    // Fetch Order
    // ==========================================

    useEffect(() => {
        dispatch(getOrder(id));

        return () => {
            dispatch(
                resetOrderState()
            );
        };
    }, [dispatch, id]);

    // ==========================================
    // Loading
    // ==========================================

    if (loading && !order) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    // ==========================================
    // Not Found
    // ==========================================

    if (!order) {
        return (
            <Box p={3}>
                <Alert severity="info">
                    Order not found.
                </Alert>
            </Box>
        );
    }

    const items = order.items || [];

    // Backend may use either total or total_amount
    const orderTotal =
        order.total ??
        order.total_amount ??
        0;

    const subtotal =
        order.subtotal ??
        0;

    const shipping =
        order.shipping_cost ??
        0;

    const tax =
        order.tax ??
        0;

    const discount =
        order.discount ??
        order.discount_amount ??
        0;

    return (
        <Box p={3}>

            {/* ======================================
                Header
            ====================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Order Details
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        {order.order_number ||
                            `Order #${order.id}`}
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <EditIcon />
                        }
                        onClick={() =>
                            navigate(
                                `/admin/orders/${id}/edit`
                            )
                        }
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBackIcon />
                        }
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Back
                    </Button>
                </Stack>
            </Stack>

            <Grid
                container
                spacing={3}
            >

                {/* ==================================
                    LEFT SIDE
                ================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >

                    {/* =================================
                        Order Information
                    ================================= */}

                    <Paper
                        sx={{
                            p: 3,
                            mb: 3,
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                Order Information
                            </Typography>

                            <ReceiptLongIcon />
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Grid
                            container
                            spacing={3}
                        >

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    Order Number
                                </Typography>

                                <Typography fontWeight="bold">
                                    {order.order_number ||
                                        `#${order.id}`}
                                </Typography>
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    Order Date
                                </Typography>

                                <Typography>
                                    {formatDate(
                                        order.created_at
                                    )}
                                </Typography>
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                    mb={0.5}
                                >
                                    Order Status
                                </Typography>

                                <Chip
                                    label={formatStatus(
                                        order.status
                                    )}
                                    color={getStatusColor(
                                        order.status
                                    )}
                                />
                            </Grid>

                            <Grid
                                size={{
                                    xs: 12,
                                    sm: 6,
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                    mb={0.5}
                                >
                                    Payment Status
                                </Typography>

                                <Chip
                                    label={formatStatus(
                                        order.payment_status
                                    )}
                                    color={getPaymentColor(
                                        order.payment_status
                                    )}
                                />
                            </Grid>

                            {order.tracking_number && (
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Tracking Number
                                    </Typography>

                                    <Typography fontWeight="bold">
                                        {
                                            order.tracking_number
                                        }
                                    </Typography>
                                </Grid>
                            )}

                        </Grid>
                    </Paper>

                    {/* =================================
                        Products
                    ================================= */}

                    <Paper
                        sx={{
                            p: 3,
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={2}
                        >
                            Order Items
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>

                                        <TableCell>
                                            Product
                                        </TableCell>

                                        <TableCell>
                                            Vendor Store
                                        </TableCell>

                                        <TableCell>
                                            Ownership
                                        </TableCell>

                                        <TableCell align="center">
                                            Qty
                                        </TableCell>

                                        <TableCell align="right">
                                            Price
                                        </TableCell>

                                        <TableCell align="right">
                                            Total
                                        </TableCell>

                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {items.map(
                                        (item) => {
                                            const ownerType =
                                                getOwnerType(
                                                    item
                                                );

                                            const isVendorOwned =
                                                ownerType ===
                                                "vendor";

                                            return (
                                                <TableRow
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    <TableCell>
                                                        <Typography fontWeight="bold">
                                                            {item
                                                                .product
                                                                ?.name ||
                                                                "Product"}
                                                        </Typography>

                                                        {item
                                                            .product_variant
                                                            ?.name && (
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                Variant:{" "}
                                                                {
                                                                    item
                                                                        .product_variant
                                                                        .name
                                                                }
                                                            </Typography>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {item
                                                            .vendor
                                                            ?.store_name ||
                                                            item
                                                                .vendor
                                                                ?.name ||
                                                            "N/A"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                isVendorOwned
                                                                    ? "Vendor Owned"
                                                                    : "Admin Owned"
                                                            }
                                                            color={
                                                                isVendorOwned
                                                                    ? "primary"
                                                                    : "secondary"
                                                            }
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        {
                                                            item.quantity
                                                        }
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {formatCurrency(
                                                            item.total ??
                                                                Number(
                                                                    item.price ||
                                                                        0
                                                                ) *
                                                                    Number(
                                                                        item.quantity ||
                                                                            0
                                                                    )
                                                        )}
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        }
                                    )}

                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                align="center"
                                            >
                                                No items found.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* =================================
                        Admin Note
                    ================================= */}

                    {order.admin_note && (
                        <Paper
                            sx={{
                                p: 3,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={1}
                            >
                                Admin Note
                            </Typography>

                            <Typography>
                                {
                                    order.admin_note
                                }
                            </Typography>
                        </Paper>
                    )}

                </Grid>

                {/* ==================================
                    RIGHT SIDE
                ================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 4,
                    }}
                >

                    {/* =================================
                        Customer
                    ================================= */}

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={2}
                            >
                                Customer
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1}>
                                <Typography>
                                    <strong>
                                        Name:
                                    </strong>{" "}
                                    {order
                                        .user
                                        ?.name ||
                                        "N/A"}
                                </Typography>

                                <Typography>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {order
                                        .user
                                        ?.email ||
                                        "N/A"}
                                </Typography>

                                <Typography>
                                    <strong>
                                        Phone:
                                    </strong>{" "}
                                    {order
                                        .user
                                        ?.phone ||
                                        "N/A"}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* =================================
                        Shipping Address
                    ================================= */}

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={2}
                            >
                                Shipping Address
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Typography>
                                {
                                    order
                                        .address
                                        ?.address
                                }
                            </Typography>

                            <Typography>
                                {
                                    order
                                        .address
                                        ?.city
                                }
                            </Typography>

                            <Typography>
                                {
                                    order
                                        .address
                                        ?.country
                                }
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* =================================
                        Payment
                    ================================= */}

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={2}
                            >
                                Payment
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Method
                                    </Typography>

                                    <Typography fontWeight="bold">
                                        {order
                                            .payment
                                            ?.payment_method ||
                                            order.payment_method ||
                                            "N/A"}
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Status
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={formatStatus(
                                            order.payment
                                                ?.status ||
                                                order.payment_status
                                        )}
                                        color={getPaymentColor(
                                            order.payment
                                                ?.status ||
                                                order.payment_status
                                        )}
                                    />
                                </Box>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Amount
                                    </Typography>

                                    <Typography fontWeight="bold">
                                        {formatCurrency(
                                            order
                                                .payment
                                                ?.amount ||
                                                orderTotal
                                        )}
                                    </Typography>
                                </Box>

                                {order
                                    .payment
                                    ?.transaction_id && (
                                    <Box>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            Transaction ID
                                        </Typography>

                                        <Typography
                                            fontWeight="bold"
                                            sx={{
                                                wordBreak:
                                                    "break-all",
                                            }}
                                        >
                                            {
                                                order
                                                    .payment
                                                    .transaction_id
                                            }
                                        </Typography>
                                    </Box>
                                )}

                            </Stack>
                        </CardContent>
                    </Card>

                    {/* =================================
                        Order Summary
                    ================================= */}

                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                mb={2}
                            >
                                Order Summary
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Subtotal
                                    </Typography>

                                    <Typography>
                                        {formatCurrency(
                                            subtotal
                                        )}
                                    </Typography>
                                </Box>

                                {discount > 0 && (
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                    >
                                        <Typography>
                                            Discount
                                        </Typography>

                                        <Typography>
                                            -{" "}
                                            {formatCurrency(
                                                discount
                                            )}
                                        </Typography>
                                    </Box>
                                )}

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Shipping
                                    </Typography>

                                    <Typography>
                                        {formatCurrency(
                                            shipping
                                        )}
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography>
                                        Tax
                                    </Typography>

                                    <Typography>
                                        {formatCurrency(
                                            tax
                                        )}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography
                                        fontWeight="bold"
                                    >
                                        Grand Total
                                    </Typography>

                                    <Typography
                                        fontWeight="bold"
                                    >
                                        {formatCurrency(
                                            orderTotal
                                        )}
                                    </Typography>
                                </Box>

                            </Stack>
                        </CardContent>
                    </Card>

                </Grid>

            </Grid>
        </Box>
    );
};

export default ViewOrder;


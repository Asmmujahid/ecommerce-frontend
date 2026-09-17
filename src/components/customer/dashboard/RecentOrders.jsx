import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useNavigate } from "react-router-dom";


// =====================================================
// Status Configuration
// =====================================================

const statusConfig = {
    pending: {
        label: "Pending",
        color: "warning",
    },

    processing: {
        label: "Processing",
        color: "info",
    },

    completed: {
        label: "Completed",
        color: "success",
    },

    cancelled: {
        label: "Cancelled",
        color: "error",
    },

    shipped: {
        label: "Shipped",
        color: "primary",
    },

    delivered: {
        label: "Delivered",
        color: "success",
    },
};


// =====================================================
// Helpers
// =====================================================

const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
    }).format(value);
};


const formatDate = (date) => {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};


// =====================================================
// Order Status
// =====================================================

const OrderStatus = ({ status }) => {
    const normalizedStatus =
        String(status || "pending").toLowerCase();

    const config =
        statusConfig[normalizedStatus] || {
            label:
                normalizedStatus.charAt(0).toUpperCase() +
                normalizedStatus.slice(1),

            color: "default",
        };

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            variant="outlined"
            sx={{
                fontWeight: 600,
                textTransform: "capitalize",
            }}
        />
    );
};


// =====================================================
// Loading State
// =====================================================

const OrdersLoading = () => {
    return (
        <Box
            sx={{
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress size={32} />
        </Box>
    );
};


// =====================================================
// Empty State
// =====================================================

const EmptyOrders = () => {
    return (
        <Box
            sx={{
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
            }}
        >
            <ShoppingBagOutlinedIcon
                sx={{
                    fontSize: 52,
                    color: "text.disabled",
                    mb: 1,
                }}
            />

            <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
            >
                No orders yet
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Your recent orders will appear here.
            </Typography>
        </Box>
    );
};


// =====================================================
// Recent Orders Component
// =====================================================

const RecentOrders = ({
    orders = [],
    loading = false,
    error = null,
}) => {

    const navigate = useNavigate();


    // =================================================
    // View Order
    // =================================================

    const handleViewOrder = (order) => {
        if (!order?.id) {
            return;
        }

        navigate(`/customer/orders/${order.id}`);
    };


    // =================================================
    // Loading
    // =================================================

    if (loading) {
        return (
            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <OrdersLoading />
                </CardContent>
            </Card>
        );
    }


    // =================================================
    // Error
    // =================================================

    if (error) {
        return (
            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Alert severity="error">
                        {error}
                    </Alert>
                </CardContent>
            </Card>
        );
    }


    // =================================================
    // Empty
    // =================================================

    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent
                    sx={{
                        p: 0,
                    }}
                >
                    <Box
                        sx={{
                            p: 2.5,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <ReceiptLongOutlinedIcon
                                color="primary"
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Recent Orders
                            </Typography>
                        </Stack>
                    </Box>

                    <Divider />

                    <EmptyOrders />
                </CardContent>
            </Card>
        );
    }


    // =================================================
    // Orders
    // =================================================

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >

            {/* =========================================
                Header
            ========================================= */}

            <Box
                sx={{
                    p: 2.5,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >

                    <ReceiptLongOutlinedIcon
                        color="primary"
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Recent Orders
                    </Typography>

                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Your latest orders
                </Typography>
            </Box>


            <Divider />


            {/* =========================================
                Table
            ========================================= */}

            <TableContainer
                sx={{
                    width: "100%",
                    overflowX: "auto",
                }}
            >

                <Table
                    sx={{
                        minWidth: 650,
                    }}
                >

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Order
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Date
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Items
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Total
                            </TableCell>

                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Status
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                Action
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {orders.slice(0, 5).map((order) => {

                            const orderNumber =
                                order.order_number ||
                                `#${order.id}`;

                            const itemCount =
                                Array.isArray(order.items)
                                    ? order.items.length
                                    : order.items_count ??
                                      order.total_items ??
                                      0;

                            const total =
                                order.total_amount ??
                                order.total ??
                                0;

                            return (
                                <TableRow
                                    key={order.id}
                                    hover
                                >

                                    {/* =================================
                                        Order Number
                                    ================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {orderNumber}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        Date
                                    ================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        Items
                                    ================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                        >
                                            {itemCount}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        Total
                                    ================================= */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {formatCurrency(total)}
                                        </Typography>

                                    </TableCell>


                                    {/* =================================
                                        Status
                                    ================================= */}

                                    <TableCell>

                                        <OrderStatus
                                            status={
                                                order.status
                                            }
                                        />

                                    </TableCell>


                                    {/* =================================
                                        Action
                                    ================================= */}

                                    <TableCell align="right">

                                        <Box
                                            component="button"
                                            type="button"
                                            onClick={() =>
                                                handleViewOrder(
                                                    order
                                                )
                                            }
                                            sx={{
                                                border: 0,
                                                background:
                                                    "transparent",
                                                cursor:
                                                    "pointer",

                                                display: "inline-flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                color:
                                                    "primary.main",

                                                borderRadius: 1,

                                                p: 0.75,

                                                "&:hover": {
                                                    backgroundColor:
                                                        "action.hover",
                                                },
                                            }}
                                            aria-label={`View order ${orderNumber}`}
                                        >
                                            <VisibilityOutlinedIcon
                                                fontSize="small"
                                            />
                                        </Box>

                                    </TableCell>

                                </TableRow>
                            );
                        })}

                    </TableBody>

                </Table>

            </TableContainer>

        </Card>
    );
};


export default RecentOrders;
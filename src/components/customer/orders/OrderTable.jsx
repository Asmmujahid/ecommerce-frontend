// src/components/customer/orders/OrderTable.jsx

import {
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Box,
} from "@mui/material";

import {
    VisibilityOutlined,
    CancelOutlined,
    DeleteOutline,
    ShoppingBagOutlined,
} from "@mui/icons-material";

// =====================================================
// Helpers
// =====================================================

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const getStatusLabel = (status) => {
    if (!status) {
        return "Pending";
    }

    return (
        String(status)
            .charAt(0)
            .toUpperCase() +
        String(status).slice(1)
    );
};

const isDeliveredOrder = (order) => {
    const status = String(
        order?.status ?? ""
    )
        .trim()
        .toLowerCase();

    return (
        status === "delivered" ||
        status === "completed"
    );
};

const isPendingOrder = (order) => {
    const status = String(
        order?.status ?? ""
    )
        .trim()
        .toLowerCase();

    return status === "pending";
};

// =====================================================
// Component
// =====================================================

const OrderTable = ({
    orders = [],
    loading = false,

    onView,
    onCancel,
    onDelete,

    cancellingOrderId = null,
    deletingOrderId = null,
}) => {
    // =================================================
    // Loading
    // =================================================

    if (
        loading &&
        orders.length === 0
    ) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    p: 5,
                    textAlign: "center",
                }}
            >
                <CircularProgress />

                <Typography
                    color="text.secondary"
                    sx={{
                        mt: 2,
                    }}
                >
                    Loading orders...
                </Typography>
            </Paper>
        );
    }

    // =================================================
    // Empty
    // =================================================

    if (orders.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    p: 5,
                    textAlign: "center",
                }}
            >
                <ShoppingBagOutlined
                    sx={{
                        fontSize: 60,
                        color:
                            "text.secondary",
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 1,
                    }}
                >
                    No orders found
                </Typography>
            </Paper>
        );
    }

    // =================================================
    // Table
    // =================================================

    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                borderRadius: 3,
                overflowX: "auto",
            }}
        >
            <Table
                sx={{
                    minWidth: 850,
                }}
            >
                {/* =================================================
                    TABLE HEAD
                ================================================= */}

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
                            align="center"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>
                    {orders.map(
                        (order) => {
                            const orderId =
                                order?.id;

                            const orderNumber =
                                order?.order_number ??
                                `#${orderId}`;

                            const status =
                                String(
                                    order?.status ??
                                        ""
                                )
                                    .trim()
                                    .toLowerCase();

                            const delivered =
                                isDeliveredOrder(
                                    order
                                );

                            const pending =
                                isPendingOrder(
                                    order
                                );

                            const cancelling =
                                cancellingOrderId ===
                                orderId;

                            const deleting =
                                deletingOrderId ===
                                orderId;

                            const itemsCount =
                                Array.isArray(
                                    order?.items
                                )
                                    ? order.items.reduce(
                                          (
                                              total,
                                              item
                                          ) =>
                                              total +
                                              Number(
                                                  item?.quantity ??
                                                      0
                                              ),
                                          0
                                      )
                                    : Number(
                                          order?.items_count ??
                                              0
                                      );

                            return (
                                <TableRow
                                    key={
                                        orderId
                                    }
                                    hover
                                >
                                    {/* Order */}

                                    <TableCell>
                                        <Typography
                                            fontWeight={
                                                700
                                            }
                                        >
                                            {
                                                orderNumber
                                            }
                                        </Typography>
                                    </TableCell>

                                    {/* Date */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                        >
                                            {order?.created_at
                                                ? new Date(
                                                      order.created_at
                                                  ).toLocaleDateString(
                                                      "en-PK",
                                                      {
                                                          day: "2-digit",
                                                          month: "short",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "N/A"}
                                        </Typography>
                                    </TableCell>

                                    {/* Items */}

                                    <TableCell>
                                        <Typography>
                                            {
                                                itemsCount
                                            }
                                        </Typography>
                                    </TableCell>

                                    {/* Total */}

                                    <TableCell>
                                        <Typography
                                            fontWeight={
                                                700
                                            }
                                        >
                                            {formatCurrency(
                                                order?.total_amount
                                            )}
                                        </Typography>
                                    </TableCell>

                                    {/* Status */}

                                    <TableCell>
                                        <Typography
                                            sx={{
                                                textTransform:
                                                    "capitalize",
                                                fontWeight:
                                                    600,
                                            }}
                                        >
                                            {getStatusLabel(
                                                status
                                            )}
                                        </Typography>
                                    </TableCell>

                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <TableCell>
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "center",
                                                alignItems:
                                                    "center",
                                                gap: 0.5,
                                            }}
                                        >
                                            {/* VIEW */}

                                            <Tooltip title="View Order">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() =>
                                                        onView?.(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <VisibilityOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* =================================================
                                                CANCEL
                                                Only pending orders
                                            ================================================= */}

                                            {pending && (
                                                <Tooltip
                                                    title={
                                                        cancelling
                                                            ? "Cancelling..."
                                                            : "Cancel Order"
                                                    }
                                                >
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={
                                                                cancelling ||
                                                                deleting
                                                            }
                                                            onClick={() =>
                                                                onCancel?.(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            {cancelling ? (
                                                                <CircularProgress
                                                                    size={
                                                                        18
                                                                    }
                                                                    color="inherit"
                                                                />
                                                            ) : (
                                                                <CancelOutlined fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}

                                            {/* =================================================
                                                DELETE
                                                Only delivered/completed
                                            ================================================= */}

                                            {delivered && (
                                                <Tooltip title="Delete Order">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={
                                                                deleting
                                                            }
                                                            onClick={() =>
                                                                onDelete?.(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            {deleting ? (
                                                                <CircularProgress
                                                                    size={
                                                                        18
                                                                    }
                                                                    color="inherit"
                                                                />
                                                            ) : (
                                                                <DeleteOutline fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrderTable;
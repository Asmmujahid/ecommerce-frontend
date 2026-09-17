import React from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

const PaymentCard = ({
    payment,
    onView,
    onEdit,
    onDelete,
}) => {
    if (!payment) {
        return null;
    }

    const getPaymentStatusColor = (status) => {
        switch (String(status || "").toLowerCase()) {
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

    const getEarningStatusColor = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "paid":
                return "success";

            case "pending":
                return "warning";

            case "reversed":
                return "error";

            default:
                return "default";
        }
    };

    const formatCurrency = (value) => {
        const amount = Number(value);

        return `Rs. ${(
            Number.isFinite(amount) ? amount : 0
        ).toLocaleString("en-PK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatStatus = (status) => {
        if (!status) {
            return "N/A";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) {
            return "Not paid yet";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const orderItems = Array.isArray(payment.order?.items)
        ? payment.order.items
        : [];

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Payment #{payment.id}
                    </Typography>

                    <Divider />

                    <Typography variant="body2">
                        <strong>Order:</strong>{" "}
                        {payment.order?.order_number ||
                            payment.order_id ||
                            "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Customer:</strong>{" "}
                        {payment.user?.name || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Email:</strong>{" "}
                        {payment.user?.email || "N/A"}
                    </Typography>

                    <Box>
                        <Typography variant="body2">
                            <strong>Customer Payment:</strong>
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatCurrency(payment.amount)}
                        </Typography>
                    </Box>

                    <Typography variant="body2">
                        <strong>Method:</strong>{" "}
                        {payment.payment_method
                            ? formatStatus(payment.payment_method)
                            : "N/A"}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Typography variant="body2">
                            <strong>Payment Status:</strong>
                        </Typography>

                        <Chip
                            label={formatStatus(payment.status)}
                            color={getPaymentStatusColor(
                                payment.status
                            )}
                            size="small"
                        />
                    </Stack>

                    <Typography variant="body2">
                        <strong>Transaction:</strong>{" "}
                        {payment.transaction_id || "N/A"}
                    </Typography>

                    {/* Customer payment date */}
                    <Typography variant="body2">
                        <strong>Paid At:</strong>{" "}
                        {payment.status === "paid"
                            ? formatDateTime(payment.paid_at)
                            : "Not paid yet"}
                    </Typography>

                    <Divider />

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                    >
                        Order Earnings
                    </Typography>

                    {orderItems.length === 0 ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No earning details found.
                        </Typography>
                    ) : (
                        orderItems.map((item) => {
                            const earning =
                                item.vendor_earning ||
                                item.vendorEarning ||
                                null;

                            const ownerType =
                                String(
                                    item.product_owner_type ||
                                        item.product?.owner_type ||
                                        "vendor"
                                ).toLowerCase();

                            const isAdminOwned =
                                ownerType === "admin";

                            const earningAmount =
                                earning?.commission_amount;

                            return (
                                <Box
                                    key={item.id}
                                    sx={{
                                        p: 1.5,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="body2">
                                            <strong>
                                                Vendor Store:
                                            </strong>{" "}
                                            {item.vendor?.store_name ||
                                                item.vendor?.name ||
                                                "N/A"}
                                        </Typography>

                                        <Typography variant="body2">
                                            <strong>
                                                Product:
                                            </strong>{" "}
                                            {item.product?.name ||
                                                "N/A"}
                                        </Typography>

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                component="span"
                                            >
                                                <strong>
                                                    Ownership:
                                                </strong>
                                            </Typography>

                                            <Chip
                                                size="small"
                                                label={
                                                    isAdminOwned
                                                        ? "Admin Owned"
                                                        : "Vendor Owned"
                                                }
                                                color={
                                                    isAdminOwned
                                                        ? "primary"
                                                        : "secondary"
                                                }
                                                sx={{
                                                    ml: 1,
                                                }}
                                            />
                                        </Box>

                                        {!earning ? (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Earning information is
                                                not available.
                                            </Typography>
                                        ) : (
                                            <>
                                                <Typography variant="body2">
                                                    <strong>
                                                        Gross Sale:
                                                    </strong>{" "}
                                                    {formatCurrency(
                                                        earning.gross_amount
                                                    )}
                                                </Typography>

                                                <Typography variant="body2">
                                                    <strong>
                                                        Rate:
                                                    </strong>{" "}
                                                    {Number(
                                                        earning.commission_rate ||
                                                            0
                                                    ).toFixed(2)}
                                                    %
                                                </Typography>

                                                {isAdminOwned ? (
                                                    <>
                                                        <Typography variant="body2">
                                                            <strong>
                                                                Vendor Selling
                                                                Fee:
                                                            </strong>{" "}
                                                            {formatCurrency(
                                                                earningAmount
                                                            )}
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            <strong>
                                                                Admin Net:
                                                            </strong>{" "}
                                                            {formatCurrency(
                                                                earning.net_amount
                                                            )}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography variant="body2">
                                                            <strong>
                                                                Admin
                                                                Commission:
                                                            </strong>{" "}
                                                            {formatCurrency(
                                                                earningAmount
                                                            )}
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            <strong>
                                                                Vendor Net:
                                                            </strong>{" "}
                                                            {formatCurrency(
                                                                earning.net_amount
                                                            )}
                                                        </Typography>
                                                    </>
                                                )}

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                >
                                                    <Typography variant="body2">
                                                        <strong>
                                                            Earning Status:
                                                        </strong>
                                                    </Typography>

                                                    <Chip
                                                        label={formatStatus(
                                                            earning.status
                                                        )}
                                                        color={getEarningStatusColor(
                                                            earning.status
                                                        )}
                                                        size="small"
                                                    />
                                                </Stack>

                                                {earning.status ===
                                                    "paid" &&
                                                    earning.paid_at && (
                                                        <Typography variant="body2">
                                                            <strong>
                                                                Vendor Paid At:
                                                            </strong>{" "}
                                                            {formatDateTime(
                                                                earning.paid_at
                                                            )}
                                                        </Typography>
                                                    )}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            );
                        })
                    )}
                </Stack>
            </CardContent>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    p: 2,
                    pt: 0,
                }}
            >
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onView?.(payment.id)}
                >
                    View
                </Button>

                <Button
                    size="small"
                    variant="contained"
                    onClick={() => onEdit?.(payment.id)}
                >
                    Edit
                </Button>

                <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => onDelete?.(payment.id)}
                >
                    Delete
                </Button>
            </Stack>
        </Card>
    );
};

export default PaymentCard;


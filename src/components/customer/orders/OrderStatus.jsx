
// src/components/customer/orders/OrderStatus.jsx

import React from "react";

import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import {
    CheckCircleOutlined,
    CancelOutlined,
    LocalShippingOutlined,
    HourglassEmptyOutlined,
    PaymentOutlined,
    ErrorOutlineOutlined,
    AutorenewOutlined,
} from "@mui/icons-material";

// =====================================================
// Format Status Text
// =====================================================

const formatStatus = (status) => {
    if (!status) {
        return "Unknown";
    }

    return status
        .toString()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};

// =====================================================
// Order Status Configuration
// =====================================================

const ORDER_STATUS_CONFIG = {
    pending: {
        label: "Pending",
        color: "warning",
        icon: HourglassEmptyOutlined,
    },

    processing: {
        label: "Processing",
        color: "info",
        icon: AutorenewOutlined,
    },

    shipped: {
        label: "Shipped",
        color: "primary",
        icon: LocalShippingOutlined,
    },

    delivered: {
        label: "Delivered",
        color: "success",
        icon: CheckCircleOutlined,
    },

    cancelled: {
        label: "Cancelled",
        color: "error",
        icon: CancelOutlined,
    },
};

// =====================================================
// Payment Status Configuration
// =====================================================

const PAYMENT_STATUS_CONFIG = {
    pending: {
        label: "Payment Pending",
        color: "warning",
        icon: HourglassEmptyOutlined,
    },

    paid: {
        label: "Paid",
        color: "success",
        icon: PaymentOutlined,
    },

    failed: {
        label: "Payment Failed",
        color: "error",
        icon: ErrorOutlineOutlined,
    },

    refunded: {
        label: "Refunded",
        color: "info",
        icon: PaymentOutlined,
    },

    cancelled: {
        label: "Payment Cancelled",
        color: "error",
        icon: CancelOutlined,
    },
};

// =====================================================
// Get Order Status Configuration
// =====================================================

export const getOrderStatusConfig = (status) => {
    const normalizedStatus = status
        ?.toString()
        .toLowerCase();

    return (
        ORDER_STATUS_CONFIG[normalizedStatus] ?? {
            label: formatStatus(status),
            color: "default",
            icon: HourglassEmptyOutlined,
        }
    );
};

// =====================================================
// Get Payment Status Configuration
// =====================================================

export const getPaymentStatusConfig = (status) => {
    const normalizedStatus = status
        ?.toString()
        .toLowerCase();

    return (
        PAYMENT_STATUS_CONFIG[normalizedStatus] ?? {
            label: formatStatus(status),
            color: "default",
            icon: PaymentOutlined,
        }
    );
};

// =====================================================
// Get Status Background Color
// =====================================================

const getBadgeStyles = (color, theme) => {
    const paletteColor =
        theme.palette[color] || theme.palette.grey;

    return {
        backgroundColor:
            paletteColor.light ||
            theme.palette.action.hover,

        color:
            paletteColor.dark ||
            theme.palette.text.primary,
    };
};

// =====================================================
// OrderStatus Component
// =====================================================

const OrderStatus = ({
    status = "pending",
    paymentStatus = null,

    // Show payment status
    showPaymentStatus = false,

    // chip | text | badge
    variant = "chip",

    // small | medium
    size = "small",

    // Custom styles
    sx = {},
}) => {
    // =================================================
    // Normalize Status
    // =================================================

    const normalizedOrderStatus = status
        ?.toString()
        .toLowerCase();

    const normalizedPaymentStatus = paymentStatus
        ?.toString()
        .toLowerCase();

    // =================================================
    // Order Status Configuration
    // =================================================

    const orderConfig =
        ORDER_STATUS_CONFIG[
            normalizedOrderStatus
        ] ?? {
            label: formatStatus(status),
            color: "default",
            icon: HourglassEmptyOutlined,
        };

    const OrderIcon = orderConfig.icon;

    // =================================================
    // Payment Status Configuration
    // =================================================

    const paymentConfig =
        PAYMENT_STATUS_CONFIG[
            normalizedPaymentStatus
        ] ?? {
            label: formatStatus(paymentStatus),
            color: "default",
            icon: PaymentOutlined,
        };

    const PaymentIcon = paymentConfig.icon;

    // =================================================
    // CHIP VARIANT
    // =================================================

    if (variant === "chip") {
        return (
            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={sx}
            >
                {/* Order Status */}

                <Chip
                    icon={<OrderIcon />}
                    label={orderConfig.label}
                    color={orderConfig.color}
                    size={size}
                />

                {/* Payment Status */}

                {showPaymentStatus &&
                    paymentStatus && (
                        <Chip
                            icon={<PaymentIcon />}
                            label={
                                paymentConfig.label
                            }
                            color={
                                paymentConfig.color
                            }
                            size={size}
                        />
                    )}
            </Stack>
        );
    }

    // =================================================
    // TEXT VARIANT
    // =================================================

    if (variant === "text") {
        return (
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={sx}
            >
                <OrderIcon
                    fontSize={
                        size === "medium"
                            ? "medium"
                            : "small"
                    }
                />

                <Typography
                    variant="body2"
                    fontWeight={600}
                >
                    {orderConfig.label}
                </Typography>

                {showPaymentStatus &&
                    paymentStatus && (
                        <>
                            <Typography
                                color="text.secondary"
                            >
                                •
                            </Typography>

                            <PaymentIcon
                                fontSize={
                                    size === "medium"
                                        ? "medium"
                                        : "small"
                                }
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {
                                    paymentConfig.label
                                }
                            </Typography>
                        </>
                    )}
            </Stack>
        );
    }

    // =================================================
    // BADGE VARIANT
    // =================================================

    if (variant === "badge") {
        return (
            <Box sx={sx}>
                <Box
                    sx={(theme) => ({
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        ...getBadgeStyles(
                            orderConfig.color,
                            theme
                        ),
                    })}
                >
                    <OrderIcon fontSize="small" />

                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        {orderConfig.label}
                    </Typography>
                </Box>

                {/* Payment Badge */}

                {showPaymentStatus &&
                    paymentStatus && (
                        <Box
                            sx={(theme) => ({
                                display:
                                    "inline-flex",
                                alignItems:
                                    "center",
                                gap: 1,
                                ml: 1,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 2,
                                ...getBadgeStyles(
                                    paymentConfig.color,
                                    theme
                                ),
                            })}
                        >
                            <PaymentIcon fontSize="small" />

                            <Typography
                                variant="body2"
                                fontWeight={600}
                            >
                                {
                                    paymentConfig.label
                                }
                            </Typography>
                        </Box>
                    )}
            </Box>
        );
    }

    // =================================================
    // DEFAULT
    // =================================================

    return (
        <Chip
            icon={<OrderIcon />}
            label={orderConfig.label}
            color={orderConfig.color}
            size={size}
            sx={sx}
        />
    );
};

export default OrderStatus;


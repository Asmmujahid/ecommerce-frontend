// src/components/customer/cart/CartSummary.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    Box,
    Button,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowForward,
    ShoppingCartCheckout,
} from "@mui/icons-material";

import {
    selectCartItems,
    selectCartTotal,
} from "../../../redux/customer/cartSlice";

// =====================================================
// Component
// =====================================================

const CartSummary = () => {
    // =================================================
    // Redux
    // =================================================

    const items = useSelector(selectCartItems);

    const cartTotal = useSelector(
        selectCartTotal
    );

    // =================================================
    // Safe Items
    // =================================================

    const safeItems = Array.isArray(items)
        ? items
        : [];

    // =================================================
    // Total Items
    // =================================================

    const totalItems = useMemo(() => {
        return safeItems.reduce(
            (total, item) =>
                total +
                Number(item?.quantity || 0),
            0
        );
    }, [safeItems]);

    // =================================================
    // Subtotal
    // =================================================

    const subtotal = useMemo(() => {
        return safeItems.reduce(
            (total, item) => {
                const price = Number(
                    item?.price || 0
                );

                const quantity = Number(
                    item?.quantity || 0
                );

                return (
                    total +
                    price * quantity
                );
            },
            0
        );
    }, [safeItems]);

    // =================================================
    // Final Total
    // =================================================

    const reduxTotal = Number(cartTotal);

    const total =
        Number.isFinite(reduxTotal) &&
        reduxTotal > 0
            ? reduxTotal
            : subtotal;

    // =================================================
    // Currency Formatter
    // =================================================

    const formatPrice = (amount) => {
        const value = Number(amount || 0);

        return value.toLocaleString("en-PK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    // =================================================
    // Empty Cart
    // =================================================

    if (safeItems.length === 0) {
        return null;
    }

    // =================================================
    // Render
    // =================================================

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                p: {
                    xs: 3,
                    sm: 4,
                },
                position: {
                    md: "sticky",
                },
                top: {
                    md: 100,
                },
            }}
        >
            {/* =================================================
                Title
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                    mb: 3,
                }}
            >
                Order Summary
            </Typography>

            {/* =================================================
                Summary
            ================================================= */}

            <Stack spacing={2}>

                {/* Items */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography color="text.secondary">
                        Items
                    </Typography>

                    <Typography fontWeight={600}>
                        {totalItems}
                    </Typography>
                </Stack>

                {/* Subtotal */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography color="text.secondary">
                        Subtotal
                    </Typography>

                    <Typography fontWeight={600}>
                        Rs.{" "}
                        {formatPrice(
                            subtotal
                        )}
                    </Typography>
                </Stack>

                {/* Shipping */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
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

            </Stack>

            <Divider
                sx={{
                    my: 3,
                }}
            />

            {/* =================================================
                Total
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    mb: 3,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Total
                </Typography>

                <Typography
                    variant="h5"
                    fontWeight={800}
                    color="primary"
                >
                    Rs.{" "}
                    {formatPrice(total)}
                </Typography>
            </Stack>

            {/* =================================================
                Checkout Button
            ================================================= */}
<Button
    component={Link}
    to="/customer/checkout"
    variant="contained"
    fullWidth
    size="large"
    startIcon={<ShoppingCartCheckout />}
    endIcon={<ArrowForward />}
    sx={{
        py: 1.5,
        borderRadius: 2,
        fontWeight: 700,
        textTransform: "none",
    }}
>
    Proceed to Checkout
</Button>

            {/* =================================================
                Continue Shopping
            ================================================= */}

            <Button
                component={Link}
                to="/shop"
                variant="text"
                fullWidth
                sx={{
                    mt: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                }}
            >
                Continue Shopping
            </Button>

            {/* =================================================
                Security
            ================================================= */}

            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                        "grey.50",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    🔒 Secure checkout and
                    protected payment
                </Typography>
            </Box>
        </Paper>
    );
};

export default CartSummary;
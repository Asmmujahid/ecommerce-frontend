
// src/components/customer/cart/CartList.jsx

import { useSelector } from "react-redux";

import {
    Box,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
} from "../../../redux/customer/cartSlice";

import CartItem from "./CartItem";

// =====================================================
// Component
// =====================================================

const CartList = () => {
    // =================================================
    // Redux State
    // =================================================

    const items = useSelector(selectCartItems);

    const loading = useSelector(
        selectCartLoading
    );

    const error = useSelector(
        selectCartError
    );

    // =================================================
    // Loading State
    // =================================================

    if (loading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 3,
                    p: 5,
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading your cart...
                    </Typography>
                </Stack>
            </Paper>
        );
    }

    // =================================================
    // Error State
    // =================================================

    if (error) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "error.200",
                    borderRadius: 3,
                    p: 4,
                    backgroundColor:
                        "error.50",
                }}
            >
                <Typography
                    color="error"
                    fontWeight={600}
                >
                    {error}
                </Typography>
            </Paper>
        );
    }

    // =================================================
    // Empty State
    // =================================================

    if (!Array.isArray(items) || items.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 3,
                    p: {
                        xs: 4,
                        sm: 6,
                    },
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                    >
                        Your cart is empty
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        You haven't added any
                        products to your cart yet.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    // =================================================
    // Render Cart Items
    // =================================================

    return (
        <Box>
            {/* =========================================
                Cart Header
            ========================================== */}

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Shopping Cart
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {items.length}{" "}
                        {items.length === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </Typography>
                </Box>
            </Stack>

            {/* =========================================
                Cart Items
            ========================================== */}

            <Stack spacing={2}>
                {items.map((item, index) => (
                    <Box key={item.id}>
                        <CartItem item={item} />

                        {index <
                            items.length - 1 && (
                            <Divider
                                sx={{
                                    mt: 2,
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default CartList;


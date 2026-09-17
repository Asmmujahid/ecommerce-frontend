
// src/pages/Customer/Cart/Cart.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import {
    Refresh,
    ShoppingCartOutlined,
} from "@mui/icons-material";

// =====================================================
// Redux
// =====================================================

import {
    fetchCart,
    selectCartItems,
    selectCartLoading,
    selectCartError,
} from "../../../redux/customer/cartSlice";

// =====================================================
// Components
// =====================================================

import CartList from "../../../components/customer/cart/CartList";
import CartSummary from "../../../components/customer/cart/CartSummary";
import EmptyCart from "../../../components/customer/cart/EmptyCart";

// =====================================================
// Component
// =====================================================

const Cart = () => {
    const dispatch = useDispatch();

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
    // Fetch Cart
    // =================================================

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // =================================================
    // Retry
    // =================================================

    const handleRetry = () => {
        dispatch(fetchCart());
    };

    // =================================================
    // Loading State
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "grey.50",
                }}
            >
                <Stack
                    alignItems="center"
                    spacing={2}
                >
                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading your cart...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =================================================
    // Error State
    // =================================================

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    backgroundColor: "grey.50",
                    py: 8,
                }}
            >
                <Container
                    maxWidth="md"
                >
                    <Alert
                        severity="error"
                        sx={{
                            borderRadius: 2,
                            mb: 3,
                        }}
                    >
                        {error}
                    </Alert>

                    <Stack
                        alignItems="center"
                        spacing={2}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={
                                handleRetry
                            }
                            sx={{
                                textTransform:
                                    "none",
                                fontWeight: 600,
                            }}
                        >
                            Try Again
                        </Button>
                    </Stack>
                </Container>
            </Box>
        );
    }

    // =================================================
    // Empty Cart
    // =================================================

    const isEmpty =
        !Array.isArray(items) ||
        items.length === 0;

    if (isEmpty) {
        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    backgroundColor: "grey.50",
                    py: {
                        xs: 4,
                        sm: 6,
                        md: 8,
                    },
                }}
            >
                <Container
                    maxWidth="lg"
                >
                    {/* =================================
                        Page Header
                    ================================== */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                            mb: 4,
                        }}
                    >
                        <ShoppingCartOutlined
                            sx={{
                                fontSize: 32,
                                color:
                                    "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Shopping Cart
                        </Typography>
                    </Stack>

                    {/* =================================
                        Empty Cart
                    ================================== */}

                    <EmptyCart />
                </Container>
            </Box>
        );
    }

    // =================================================
    // Cart With Items
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "70vh",
                backgroundColor: "grey.50",
                py: {
                    xs: 4,
                    sm: 6,
                    md: 8,
                },
            }}
        >
            <Container maxWidth="xl">
                {/* =====================================
                    Page Header
                ====================================== */}

                <Box sx={{ mb: 5 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >
                        <ShoppingCartOutlined
                            sx={{
                                fontSize: 34,
                                color:
                                    "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Shopping Cart
                        </Typography>
                    </Stack>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        Review your items before
                        proceeding to checkout.
                    </Typography>
                </Box>

                {/* =====================================
                    Cart Layout
                ====================================== */}

                <Box
                    sx={{
                        display: "grid",

                        gridTemplateColumns: {
                            xs: "1fr",
                            lg: "minmax(0, 1fr) 380px",
                        },

                        gap: {
                            xs: 3,
                            md: 4,
                            lg: 5,
                        },

                        alignItems: "start",
                    }}
                >
                    {/* =================================
                        Cart Items
                    ================================== */}

                    <Box>
                        <CartList />
                    </Box>

                    {/* =================================
                        Cart Summary
                    ================================== */}

                    <Box>
                        <CartSummary />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Cart;


// src/components/customer/cart/EmptyCart.jsx

import { Link } from "react-router-dom";

import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowForward,
    ShoppingBagOutlined,
} from "@mui/icons-material";

// =====================================================
// Component
// =====================================================

const EmptyCart = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: {
                    xs: 400,
                    sm: 500,
                },

                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                p: {
                    xs: 3,
                    sm: 5,
                },

                backgroundColor: "white",
            }}
        >
            <Stack
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                spacing={2}
                sx={{
                    maxWidth: 500,
                    width: "100%",
                }}
            >
                {/* =====================================
                    Shopping Bag Icon
                ====================================== */}

                <Box
                    sx={{
                        width: {
                            xs: 90,
                            sm: 110,
                        },

                        height: {
                            xs: 90,
                            sm: 110,
                        },

                        borderRadius: "50%",

                        backgroundColor:
                            "grey.100",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        mb: 1,
                    }}
                >
                    <ShoppingBagOutlined
                        sx={{
                            fontSize: {
                                xs: 48,
                                sm: 60,
                            },

                            color: "grey.500",
                        }}
                    />
                </Box>

                {/* =====================================
                    Title
                ====================================== */}

                <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                >
                    Your Cart is Empty
                </Typography>

                {/* =====================================
                    Description
                ====================================== */}

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: 430,
                        lineHeight: 1.7,
                    }}
                >
                    Looks like you haven't added
                    anything to your cart yet.
                    Explore our products and find
                    something you love.
                </Typography>

                {/* =====================================
                    Shop Now Button
                ====================================== */}

                <Button
                    component={Link}
                    to="/shop"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Continue Shopping
                </Button>

                {/* =====================================
                    Additional Message
                ====================================== */}

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                    }}
                >
                    Discover our latest products
                    and special offers.
                </Typography>
            </Stack>
        </Paper>
    );
};

export default EmptyCart;


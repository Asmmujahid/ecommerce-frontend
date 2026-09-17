// src/pages/customer/checkout/CheckoutPage.jsx

import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import {
    ShoppingBag,
} from "@mui/icons-material";

import CheckoutForm
    from "../../../components/customer/checkout/CheckoutForm";

const CheckoutPage = () => {
    return (
        <Box
            sx={{
                minHeight: "70vh",
                backgroundColor: "grey.50",
                py: {
                    xs: 3,
                    sm: 4,
                    md: 6,
                },
            }}
        >
            <Container maxWidth="lg">

                <Box
                    sx={{
                        mb: {
                            xs: 3,
                            md: 4,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1,
                        }}
                    >
                        <ShoppingBag
                            color="primary"
                            sx={{
                                fontSize: 32,
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Checkout
                        </Typography>
                    </Box>

                    <Typography
                        color="text.secondary"
                    >
                        Complete your order by
                        providing your shipping
                        address and selecting a
                        payment method.
                    </Typography>
                </Box>

                <CheckoutForm />

            </Container>
        </Box>
    );
};

export default CheckoutPage;

// src/pages/Customer/Brands/Brands.jsx

import { Box, Container, Typography } from "@mui/material";

import BrandList from "../../../components/customer/brands/BrandList";

const Brands = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8fafc",
                py: {
                    xs: 4,
                    sm: 5,
                    md: 7,
                },
            }}
        >
            <Container maxWidth="xl">
                {/* =====================================================
                    Page Header
                ===================================================== */}

                <Box
                    sx={{
                        textAlign: "center",
                        mb: {
                            xs: 4,
                            md: 6,
                        },
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight={700}
                        color="text.primary"
                        sx={{
                            fontSize: {
                                xs: "2rem",
                                sm: "2.5rem",
                                md: "3rem",
                            },
                        }}
                    >
                        Our Brands
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            mt: 2,
                            lineHeight: 1.7,
                        }}
                    >
                        Explore products from our trusted and
                        popular brands. Choose your favorite brand
                        and discover the products available in our
                        store.
                    </Typography>
                </Box>

                {/* =====================================================
                    Brands List
                ===================================================== */}

                <BrandList />
            </Container>
        </Box>
    );
};

export default Brands;


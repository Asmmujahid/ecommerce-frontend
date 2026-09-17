
// src/components/customer/products/ProductList.jsx

import {
    Alert,
    Box,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import ProductCard from "./ProductCard";

// =====================================================
// COMPONENT
// =====================================================

const ProductList = ({
    products = [],
    loading = false,
    error = null,
    limit = null,
    showTitle = true,
    title = "All Products",
}) => {
    // =================================================
    // DISPLAY PRODUCTS
    // =================================================

    const safeProducts =
        Array.isArray(products)
            ? products
            : [];

    const displayedProducts = limit
        ? safeProducts.slice(0, limit)
        : safeProducts;

    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "ProductList products:",
        safeProducts
    );

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    py: 8,
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems: "center",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Loading products...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (error) {
        return (
            <Box sx={{ py: 4 }}>
                <Alert severity="error">
                    {typeof error ===
                    "string"
                        ? error
                        : "Failed to load products."}
                </Alert>
            </Box>
        );
    }

    // =================================================
    // EMPTY
    // =================================================

    if (
        displayedProducts.length === 0
    ) {
        return (
            <Box
                sx={{
                    py: 8,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                >
                    No Products Found
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    There are currently no
                    products available.
                </Typography>
            </Box>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box sx={{ width: "100%" }}>
            {/* =============================================
                TITLE
            ============================================= */}

            {showTitle && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight={800}
                    >
                        {title}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Browse our latest
                        products.
                    </Typography>
                </Box>
            )}

            {/* =============================================
                PRODUCT GRID
            ============================================= */}

            <Grid
                container
                spacing={3}
            >
                {displayedProducts.map(
                    (product) => (
                        <Grid
                            key={product.id}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 3,
                            }}
                        >
                            <ProductCard
                                product={product}
                            />
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default ProductList;


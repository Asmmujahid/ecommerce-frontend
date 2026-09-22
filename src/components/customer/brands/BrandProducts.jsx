
// src/components/customer/brands/BrandProducts.jsx

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Home,
    Refresh,
    ShoppingBag,
} from "@mui/icons-material";

// =====================================================
// Redux - Brand
// =====================================================

import {
    fetchBrand,
    fetchBrandProducts,
    clearBrandProducts,
    selectBrand,
    selectBrandProducts,
    selectSingleBrandLoading,
    selectSingleBrandError,
    selectBrandProductsLoading,
    selectBrandProductsError,
} from "../../../redux/customer/brandSlice";

// =====================================================
// Product Card
// =====================================================

import ProductCard from "../products/ProductCard";

import { STORAGE_URL } from "../../../utils/storage";

// =====================================================
// Component
// =====================================================

const BrandProducts = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // Redux State
    // =================================================

    const brand = useSelector(
        selectBrand
    );

    const products = useSelector(
        selectBrandProducts
    );

    const brandLoading = useSelector(
        selectSingleBrandLoading
    );

    const brandError = useSelector(
        selectSingleBrandError
    );

    const productsLoading = useSelector(
        selectBrandProductsLoading
    );

    const productsError = useSelector(
        selectBrandProductsError
    );

    // =================================================
    // Loading
    // =================================================

    const loading =
        brandLoading ||
        productsLoading;

    // =================================================
    // Error
    // =================================================

    const error =
        brandError ||
        productsError;

    // =================================================
    // Fetch Brand + Products
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        // Clear previous brand products
        dispatch(clearBrandProducts());

        // Get brand details
        dispatch(fetchBrand(id));

        // Get products belonging to brand
        dispatch(fetchBrandProducts(id));
    }, [dispatch, id]);

    // =================================================
    // Retry
    // =================================================

    const handleRetry = () => {
        if (!id) {
            return;
        }

        dispatch(fetchBrand(id));

        dispatch(fetchBrandProducts(id));
    };

    // =================================================
    // Product Click
    // =================================================

    const handleProductClick = (
        productId
    ) => {
        if (!productId) {
            return;
        }

        navigate(
            `/products/${productId}`
        );
    };

    // =================================================
    // Invalid ID
    // =================================================

    if (!id) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                }}
            >
                <Alert severity="error">
                    Brand ID is missing.
                </Alert>
            </Box>
        );
    }

    // =================================================
    // Render
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
            }}
        >
            <Container maxWidth="xl">

                {/* =========================================
                    BREADCRUMBS
                ========================================= */}

                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{ mb: 3 }}
                >
                    <Link
                        to="/"
                        style={{
                            textDecoration:
                                "none",
                            color: "inherit",
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 4,
                        }}
                    >
                        <Home fontSize="small" />

                        Home
                    </Link>

                    <Link
                        to="/brands"
                        style={{
                            textDecoration:
                                "none",
                            color: "inherit",
                        }}
                    >
                        Brands
                    </Link>

                    <Typography
                        color="text.primary"
                        fontWeight={600}
                    >
                        {brand?.name ||
                            "Brand Products"}
                    </Typography>
                </Breadcrumbs>

                {/* =========================================
                    BACK BUTTON
                ========================================= */}

                <Button
                    component={Link}
                    to="/brands"
                    startIcon={<ArrowBack />}
                    sx={{
                        mb: 3,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Back to Brands
                </Button>

                {/* =========================================
                    BRAND HEADER
                ========================================= */}

                {!brandLoading && brand && (
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor:
                                "grey.200",
                            p: {
                                xs: 2.5,
                                sm: 3,
                                md: 4,
                            },
                            mb: 4,
                        }}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={3}
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                        >
                            {/* Brand Logo */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 100,
                                        sm: 120,
                                    },

                                    height: {
                                        xs: 100,
                                        sm: 120,
                                    },

                                    flexShrink: 0,

                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",

                                    backgroundColor:
                                        "#f8fafc",

                                    borderRadius: 2,

                                    p: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={
                                        brand.logo
                                            ? brand.logo.startsWith(
                                                  "http"
                                              )
                                                ? brand.logo
                                                : `${STORAGE_URL}/${String(
                                                      brand.logo
                                                  ).replace(
                                                      /^\/+/,
                                                      ""
                                                  )}`
                                            : "/images/no-image.png"
                                    }
                                    alt={
                                        brand.name ||
                                        "Brand"
                                    }
                                    onError={(
                                        event
                                    ) => {
                                        event.currentTarget.onerror =
                                            null;

                                        event.currentTarget.src =
                                            "/images/no-image.png";
                                    }}
                                    sx={{
                                        maxWidth:
                                            "100%",
                                        maxHeight:
                                            "100%",
                                        objectFit:
                                            "contain",
                                    }}
                                />
                            </Box>

                            {/* Brand Information */}

                            <Box sx={{ flexGrow: 1 }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    <ShoppingBag
                                        color="primary"
                                    />

                                    <Typography
                                        variant="overline"
                                        color="primary"
                                        fontWeight={700}
                                    >
                                        Brand
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="h4"
                                    component="h1"
                                    fontWeight={800}
                                    sx={{
                                        fontSize: {
                                            xs: "1.8rem",
                                            sm: "2.2rem",
                                            md: "2.5rem",
                                        },
                                    }}
                                >
                                    {brand.name ||
                                        "Brand Products"}
                                </Typography>

                                {brand.description && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            maxWidth: 800,
                                        }}
                                    >
                                        {
                                            brand.description
                                        }
                                    </Typography>
                                )}

                                {!loading &&
                                    !error && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 1.5,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {products.length}{" "}
                                            {products.length ===
                                            1
                                                ? "product"
                                                : "products"}{" "}
                                            available
                                        </Typography>
                                    )}
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (
                    <Box
                        sx={{
                            minHeight: 400,
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            gap: 2,
                        }}
                    >
                        <CircularProgress
                            size={45}
                        />

                        <Typography
                            color="text.secondary"
                        >
                            Loading brand products...
                        </Typography>
                    </Box>
                )}

                {/* =========================================
                    ERROR
                ========================================= */}

                {!loading && error && (
                    <Box
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            py: 5,
                        }}
                    >
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {error}
                        </Alert>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button
                                component={Link}
                                to="/brands"
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                }}
                            >
                                Back to Brands
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={
                                    <Refresh />
                                }
                                onClick={
                                    handleRetry
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                }}
                            >
                                Retry
                            </Button>
                        </Stack>
                    </Box>
                )}

                {/* =========================================
                    PRODUCTS SECTION
                ========================================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <Box>

                            {/* Section Header */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center",
                                }}
                                justifyContent="space-between"
                                sx={{
                                    mb: 3,
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                    >
                                        {brand?.name ||
                                            "Brand"}{" "}
                                        Products
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        Explore all
                                        products from
                                        this brand.
                                    </Typography>
                                </Box>

                                <Button
                                    component={Link}
                                    to="/shop"
                                    variant="outlined"
                                    startIcon={
                                        <ShoppingBag />
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    Shop All Products
                                </Button>
                            </Stack>

                            <Divider
                                sx={{ mb: 4 }}
                            />

                            {/* Product Grid */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(1, minmax(0, 1fr))",
                                    gap: 3,

                                    "@media (min-width:600px)":
                                        {
                                            gridTemplateColumns:
                                                "repeat(2, minmax(0, 1fr))",
                                        },

                                    "@media (min-width:900px)":
                                        {
                                            gridTemplateColumns:
                                                "repeat(3, minmax(0, 1fr))",
                                        },

                                    "@media (min-width:1200px)":
                                        {
                                            gridTemplateColumns:
                                                "repeat(4, minmax(0, 1fr))",
                                        },
                                }}
                            >
                                {products.map(
                                    (product) => (
                                        <Box
                                            key={
                                                product.id
                                            }
                                            onClick={() =>
                                                handleProductClick(
                                                    product.id
                                                )
                                            }
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <ProductCard
                                                product={
                                                    product
                                                }
                                            />
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>
                    )}

                {/* =========================================
                    EMPTY
                ========================================= */}

                {!loading &&
                    !error &&
                    products.length ===
                        0 && (
                        <Box
                            sx={{
                                minHeight: 350,
                                backgroundColor:
                                    "#fff",
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor:
                                    "grey.200",

                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",

                                textAlign:
                                    "center",

                                p: 4,
                            }}
                        >
                            <ShoppingBag
                                sx={{
                                    fontSize: 60,
                                    color: "grey.400",
                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                No Products Found
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                    maxWidth: 500,
                                }}
                            >
                                There are currently
                                no active products
                                available for this
                                brand.
                            </Typography>

                            <Button
                                component={Link}
                                to="/brands"
                                variant="contained"
                                startIcon={
                                    <ArrowBack />
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                }}
                            >
                                Back to Brands
                            </Button>
                        </Box>
                    )}
            </Container>
        </Box>
    );
};

export default BrandProducts;


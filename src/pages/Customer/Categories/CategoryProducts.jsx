
// src/pages/Customer/Categories/CategoryProducts.jsx

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
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Category as CategoryIcon,
    Home,
    Refresh,
} from "@mui/icons-material";

// =====================================================
// COMPONENT
// =====================================================

import CategoryProductsList from "../../../components/customer/categories/CategoryProducts";

// =====================================================
// REDUX
// =====================================================

import {
    getCategory,
    getCategoryProducts,
    clearCategory,
    selectCategory,
    selectCategoryProducts,
    selectCategoryDetailsLoading,
    selectCategoryProductsLoading,
    selectCategoryError,
} from "../../../redux/customer/categorySlice";

// =====================================================
// COMPONENT
// =====================================================

const CategoryProducts = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // REDUX STATE
    // =================================================

    const category = useSelector(
        selectCategory
    );

    const products = useSelector(
        selectCategoryProducts
    );

    const categoryLoading = useSelector(
        selectCategoryDetailsLoading
    );

    const productsLoading = useSelector(
        selectCategoryProductsLoading
    );

    const error = useSelector(
        selectCategoryError
    );

    // =================================================
    // LOADING
    // =================================================

    const loading =
        categoryLoading ||
        productsLoading;

    // =================================================
    // FETCH CATEGORY DATA
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(getCategory(id));

        dispatch(getCategoryProducts(id));

        // -------------------------------------------------
        // Cleanup
        // -------------------------------------------------

        return () => {
            dispatch(clearCategory());
        };
    }, [dispatch, id]);

    // =================================================
    // RETRY
    // =================================================

    const handleRetry = () => {
        if (!id) {
            return;
        }

        dispatch(getCategory(id));

        dispatch(getCategoryProducts(id));
    };

    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {
        navigate("/categories");
    };

    // =================================================
    // RENDER
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
            <Container
                maxWidth="xl"
            >
                {/* =================================================
                    BREADCRUMBS
                ================================================= */}

                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        mb: 3,
                    }}
                >
                    <Link
                        to="/"
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "4px",
                            textDecoration:
                                "none",
                            color: "inherit",
                        }}
                    >
                        <Home fontSize="small" />

                        Home
                    </Link>

                    <Link
                        to="/categories"
                        style={{
                            textDecoration:
                                "none",
                            color: "inherit",
                        }}
                    >
                        Categories
                    </Link>

                    <Typography
                        color="text.primary"
                        fontWeight={600}
                    >
                        {category?.name ||
                            "Category Products"}
                    </Typography>
                </Breadcrumbs>

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={handleBack}
                    sx={{
                        mb: 3,
                        textTransform:
                            "none",
                        fontWeight: 600,
                        borderRadius: 2,
                    }}
                >
                    Back to Categories
                </Button>

                {/* =================================================
                    CATEGORY HEADER
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: {
                            xs: 2.5,
                            sm: 3,
                            md: 4,
                        },
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor:
                            "grey.200",
                        backgroundColor:
                            "#ffffff",
                    }}
                >
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
                    >
                        {/* LEFT */}

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            {/* CATEGORY ICON */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 48,
                                        sm: 56,
                                    },
                                    height: {
                                        xs: 48,
                                        sm: 56,
                                    },
                                    borderRadius: 2,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "primary.50",
                                    color:
                                        "primary.main",
                                    flexShrink: 0,
                                }}
                            >
                                <CategoryIcon
                                    fontSize="large"
                                />
                            </Box>

                            {/* CATEGORY INFORMATION */}

                            <Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    fontWeight={800}
                                    sx={{
                                        fontSize: {
                                            xs: "1.7rem",
                                            sm: "2rem",
                                            md: "2.25rem",
                                        },
                                    }}
                                >
                                    {category?.name ||
                                        "Category Products"}
                                </Typography>

                                {category
                                    ?.description && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            mt: 0.7,
                                            maxWidth: 800,
                                        }}
                                    >
                                        {
                                            category.description
                                        }
                                    </Typography>
                                )}

                                {!loading &&
                                    !error && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
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

                        {/* RIGHT */}

                        {!loading &&
                            !error &&
                            products.length >
                                0 && (
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <CategoryIcon />
                                    }
                                    onClick={
                                        handleBack
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                    }}
                                >
                                    All Categories
                                </Button>
                            )}
                    </Stack>
                </Paper>

                <Divider sx={{ mb: 4 }} />

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <Box
                        sx={{
                            minHeight: 400,
                            display:
                                "flex",
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
                            size={42}
                        />

                        <Typography
                            color="text.secondary"
                            fontWeight={500}
                        >
                            Loading category
                            products...
                        </Typography>
                    </Box>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading &&
                    error && (
                        <Paper
                            elevation={0}
                            sx={{
                                maxWidth: 700,
                                mx: "auto",
                                p: 4,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor:
                                    "error.light",
                                backgroundColor:
                                    "#fff",
                            }}
                        >
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                }}
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
                                    variant="outlined"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleBack
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                    }}
                                >
                                    Categories
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
                                        fontWeight: 600,
                                    }}
                                >
                                    Retry
                                </Button>
                            </Stack>
                        </Paper>
                    )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    products.length ===
                        0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                minHeight: 350,
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                textAlign:
                                    "center",
                                p: 4,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor:
                                    "grey.200",
                                backgroundColor:
                                    "#ffffff",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius:
                                        "50%",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        "grey.100",
                                    color:
                                        "text.secondary",
                                    mb: 2,
                                }}
                            >
                                <CategoryIcon
                                    fontSize="large"
                                />
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                No Products Found
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    mb: 3,
                                    maxWidth: 500,
                                }}
                            >
                                There are currently
                                no active products
                                available in this
                                category.
                            </Typography>

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleBack
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                    }}
                                >
                                    Back to Categories
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={
                                        <Refresh />
                                    }
                                    onClick={
                                        handleRetry
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Stack>
                        </Paper>
                    )}

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <CategoryProductsList
                            products={products}
                        />
                    )}
            </Container>
        </Box>
    );
};

export default CategoryProducts;


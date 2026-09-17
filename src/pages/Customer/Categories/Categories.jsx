// src/pages/Customer/Categories/Categories.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import CategoryList from "../../../components/customer/categories/CategoryList";

import {
    getCategories,
    selectCategories,
    selectCategoryLoading,
    selectCategoryError,
} from "../../../redux/customer/categorySlice";

// =====================================================
// Component
// =====================================================

const Categories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =================================================
    // Redux state
    // =================================================

    const categories = useSelector(selectCategories);

    const loading = useSelector(
        selectCategoryLoading
    );

    const error = useSelector(
        selectCategoryError
    );

    // =================================================
    // Fetch categories
    // =================================================

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // =================================================
    // Category click
    // =================================================

    const handleCategoryClick = (category) => {
        if (!category?.id) {
            return;
        }

        navigate(
            `/categories/${category.id}/products`
        );
    };

    // =================================================
    // Retry
    // =================================================

    const handleRetry = () => {
        dispatch(getCategories());
    };

    // =================================================
    // Render
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8f9fa",
                py: {
                    xs: 3,
                    sm: 4,
                    md: 5,
                },
            }}
        >
            <Container maxWidth="xl">
                {/* =========================================
                    Header
                ========================================= */}

                <Box
                    sx={{
                        mb: 4,
                        textAlign: {
                            xs: "center",
                            md: "left",
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight={700}
                        gutterBottom
                    >
                        Shop by Category
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: 700,
                            mx: {
                                xs: "auto",
                                md: 0,
                            },
                        }}
                    >
                        Explore our product categories
                        and find the products you are
                        looking for.
                    </Typography>
                </Box>

                {/* =========================================
                    Loading
                ========================================= */}

                {loading && (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            flexDirection:
                                "column",
                            justifyContent:
                                "center",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <CircularProgress />

                        <Typography
                            color="text.secondary"
                        >
                            Loading categories...
                        </Typography>
                    </Box>
                )}

                {/* =========================================
                    Error
                ========================================= */}

                {!loading && error && (
                    <Box
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                        }}
                    >
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    startIcon={
                                        <RefreshIcon />
                                    }
                                    onClick={
                                        handleRetry
                                    }
                                >
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Box>
                )}

                {/* =========================================
                    Categories
                ========================================= */}

                {!loading &&
                    !error &&
                    categories.length > 0 && (
                        <CategoryList
                            categories={categories}
                            onCategoryClick={
                                handleCategoryClick
                            }
                            showHeader={false}
                        />
                    )}

                {/* =========================================
                    Empty
                ========================================= */}

                {!loading &&
                    !error &&
                    categories.length === 0 && (
                        <Box
                            sx={{
                                minHeight: 300,
                                display: "flex",
                                flexDirection:
                                    "column",
                                justifyContent:
                                    "center",
                                alignItems:
                                    "center",
                                textAlign: "center",
                                backgroundColor:
                                    "#fff",
                                borderRadius: 2,
                                p: 4,
                                boxShadow:
                                    "0 2px 10px rgba(0,0,0,0.06)",
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                No Categories Found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                There are currently no
                                active categories
                                available.
                            </Typography>

                            <Button
                                variant="outlined"
                                startIcon={
                                    <RefreshIcon />
                                }
                                onClick={
                                    handleRetry
                                }
                                sx={{ mt: 2 }}
                            >
                                Try Again
                            </Button>
                        </Box>
                    )}
            </Container>
        </Box>
    );
};

export default Categories;
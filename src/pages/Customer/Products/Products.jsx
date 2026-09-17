
// src/pages/Customer/Products/Products.jsx

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchProducts,
    searchProducts,
    filterProducts,
    clearProductError,
    selectProducts,
    selectProductLoading,
    selectProductError,
} from "../../../redux/customer/productSlice";

import {
    getCategories,
    selectCategories,
    selectCategoryLoading,
    selectCategoryError,
} from "../../../redux/customer/categorySlice";

import {
    fetchBrands,
    selectBrands,
    selectBrandLoading,
    selectBrandError,
} from "../../../redux/customer/brandSlice";

import ProductList from "../../../components/customer/products/ProductList";

import ProductSearch from "../../../components/customer/products/ProductSearch";

import ProductFilter from "../../../components/customer/products/ProductFilter";

import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const Products = () => {
    const dispatch = useDispatch();

    // =========================================================
    // PRODUCT REDUX STATE
    // =========================================================

    const products = useSelector(
        selectProducts
    );

    const productLoading = useSelector(
        selectProductLoading
    );

    const productError = useSelector(
        selectProductError
    );

    // =========================================================
    // CATEGORY REDUX STATE
    // =========================================================

    const categories = useSelector(
        selectCategories
    );

    const categoryLoading = useSelector(
        selectCategoryLoading
    );

    const categoryError = useSelector(
        selectCategoryError
    );

    // =========================================================
    // BRAND REDUX STATE
    // =========================================================

    const brands = useSelector(
        selectBrands
    );

    const brandLoading = useSelector(
        selectBrandLoading
    );

    const brandError = useSelector(
        selectBrandError
    );

    // =========================================================
    // LOCAL STATE
    // =========================================================

    const [search, setSearch] =
        useState("");

    const [filters, setFilters] =
        useState({
            category_id: "",
            brand_id: "",
            featured: "",
        });

    // =========================================================
    // FETCH PRODUCTS + CATEGORIES + BRANDS
    // =========================================================

    useEffect(() => {
        /*
        |--------------------------------------------------------------------------
        | Fetch Products
        |--------------------------------------------------------------------------
        */

        dispatch(
            fetchProducts()
        );

        /*
        |--------------------------------------------------------------------------
        | Fetch Categories
        |--------------------------------------------------------------------------
        */

        dispatch(
            getCategories()
        );

        /*
        |--------------------------------------------------------------------------
        | Fetch Brands
        |--------------------------------------------------------------------------
        */

        dispatch(
            fetchBrands()
        );
    }, [dispatch]);

    // =========================================================
    // DEBUG
    // =========================================================

    useEffect(() => {
        console.log(
            "Products:",
            products
        );

        console.log(
            "Categories:",
            categories
        );

        console.log(
            "Brands:",
            brands
        );
    }, [
        products,
        categories,
        brands,
    ]);

    // =========================================================
    // SEARCH PRODUCTS
    // =========================================================

    const handleSearch = (value) => {
        const keyword =
            typeof value === "string"
                ? value
                : value?.target?.value || "";

        setSearch(keyword);

        dispatch(
            clearProductError()
        );

        // =====================================================
        // EMPTY SEARCH
        // =====================================================

        if (!keyword.trim()) {
            /*
             * If filters are active, keep
             * the filters instead of removing them.
             */

            const hasFilters =
                filters.category_id !== "" ||
                filters.brand_id !== "" ||
                filters.featured !== "";

            if (hasFilters) {
                dispatch(
                    filterProducts(
                        filters
                    )
                );
            } else {
                dispatch(
                    fetchProducts()
                );
            }

            return;
        }

        // =====================================================
        // SEARCH API
        // =====================================================

        dispatch(
            searchProducts(
                keyword.trim()
            )
        );
    };

    // =========================================================
    // FILTER PRODUCTS
    // =========================================================

    const handleFilter = (
        newFilters
    ) => {
        const updatedFilters = {
            category_id:
                newFilters?.category_id ??
                "",

            brand_id:
                newFilters?.brand_id ??
                "",

            featured:
                newFilters?.featured ??
                "",
        };

        setFilters(
            updatedFilters
        );

        dispatch(
            clearProductError()
        );

        // =====================================================
        // CHECK ACTIVE FILTERS
        // =====================================================

        const hasFilters =
            updatedFilters.category_id !== "" ||
            updatedFilters.brand_id !== "" ||
            updatedFilters.featured !== "";

        // =====================================================
        // NO FILTERS
        // =====================================================

        if (!hasFilters) {
            dispatch(
                fetchProducts()
            );

            return;
        }

        // =====================================================
        // FILTER API
        // =====================================================

        dispatch(
            filterProducts(
                updatedFilters
            )
        );
    };

    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const handleClearFilters = () => {
        const emptyFilters = {
            category_id: "",
            brand_id: "",
            featured: "",
        };

        setFilters(
            emptyFilters
        );

        dispatch(
            clearProductError()
        );

        /*
         * Fetch all products again.
         */

        dispatch(
            fetchProducts()
        );
    };

    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = () => {
        setSearch("");

        dispatch(
            clearProductError()
        );

        /*
         * If filters are active,
         * keep the filters.
         */

        const hasFilters =
            filters.category_id !== "" ||
            filters.brand_id !== "" ||
            filters.featured !== "";

        if (hasFilters) {
            dispatch(
                filterProducts(
                    filters
                )
            );
        } else {
            dispatch(
                fetchProducts()
            );
        }
    };

    // =========================================================
    // VISIBLE PRODUCTS
    // =========================================================

    const visibleProducts =
        useMemo(() => {
            return Array.isArray(
                products
            )
                ? products
                : [];
        }, [products]);

    // =========================================================
    // FILTER LOADING
    // =========================================================

    const filterLoading =
        categoryLoading ||
        brandLoading;

    // =========================================================
    // FILTER ERROR
    // =========================================================

    const filterError =
        categoryError ||
        brandError;

    // =========================================================
    // MAIN LOADING
    // =========================================================

    const loading =
        productLoading;

    // =========================================================
    // MAIN ERROR
    // =========================================================

    const error =
        productError;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor:
                    "#f8fafc",
                py: 5,
            }}
        >
            <Container maxWidth="xl">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <Box
                    sx={{
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight={700}
                        color="text.primary"
                    >
                        All Products
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        Browse our latest
                        products and
                        find everything
                        you need.
                    </Typography>
                </Box>

                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor:
                            "divider",
                    }}
                >
                    <Stack
                        spacing={3}
                    >

                        {/* =========================================
                            SEARCH
                        ========================================= */}

                        <ProductSearch
                            value={search}
                            search={search}
                            onSearch={
                                handleSearch
                            }
                            onChange={
                                handleSearch
                            }
                            onClear={
                                handleClearSearch
                            }
                        />

                        {/* =========================================
                            FILTER
                        ========================================= */}

                        <ProductFilter
                            categories={
                                categories
                            }
                            brands={
                                brands
                            }
                            filters={
                                filters
                            }
                            onFilter={
                                handleFilter
                            }
                            onClear={
                                handleClearFilters
                            }
                            loading={
                                filterLoading ||
                                productLoading
                            }
                        />

                    </Stack>
                </Paper>

                {/* =================================================
                    CATEGORY / BRAND ERROR
                ================================================= */}

                {filterError && (
                    <Alert
                        severity="warning"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                        }}
                    >
                        {typeof filterError ===
                        "string"
                            ? filterError
                            : "Failed to load categories or brands."}
                    </Alert>
                )}

                {/* =================================================
                    PRODUCT ERROR
                ================================================= */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 4,
                            borderRadius: 2,
                        }}
                    >
                        {typeof error ===
                        "string"
                            ? error
                            : "Failed to load products."}
                    </Alert>
                )}

                {/* =================================================
                    PRODUCT COUNT
                ================================================= */}

                {!loading &&
                    !error && (
                        <Box
                            sx={{
                                mb: 3,
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="text.secondary"
                            >
                                {
                                    visibleProducts.length
                                }{" "}
                                {visibleProducts.length ===
                                1
                                    ? "product"
                                    : "products"}{" "}
                                found
                            </Typography>
                        </Box>
                    )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            flexDirection:
                                "column",
                            gap: 2,
                        }}
                    >
                        <CircularProgress />

                        <Typography
                            color="text.secondary"
                        >
                            Loading products...
                        </Typography>
                    </Box>
                ) : (
                    /* =============================================
                        PRODUCT LIST
                    ============================================= */

                    <ProductList
                        products={
                            visibleProducts
                        }
                        loading={
                            loading
                        }
                        error={error}
                        showTitle={
                            false
                        }
                    />
                )}

            </Container>
        </Box>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default Products;


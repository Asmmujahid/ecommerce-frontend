
// src/pages/Customer/Brands/BrandProducts.jsx

import {
    useEffect,
} from "react";

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
    ArrowBack,
    Home,
    Inventory2,
} from "@mui/icons-material";

import {
    Box,
    Breadcrumbs,
    Button,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

// =====================================================
// REDUX
// =====================================================

import {
    fetchBrandProducts,
    clearBrandProducts,
    selectBrand,
    selectBrandProducts,
    selectBrandProductsLoading,
    selectBrandProductsError,
} from "../../../redux/customer/brandSlice";

// =====================================================
// COMPONENTS
// =====================================================

import ProductCard from "../../../components/customer/products/ProductCard";

import ProductSkeleton from "../../../components/ui/Skeleton/ProductSkeleton/ProductSkeleton";

import ErrorState from "../../../components/Common/ErrorState/ErrorState";

import EmptyState from "../../../components/Common/EmptyState/EmptyState";

// =====================================================
// STORAGE URL
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

// =====================================================
// COMPONENT
// =====================================================

const BrandProducts = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    // =================================================
    // REDUX STATE
    // =================================================

    const brand = useSelector(
        selectBrand
    );

    const products = useSelector(
        selectBrandProducts
    );

    const loading = useSelector(
        selectBrandProductsLoading
    );

    const error = useSelector(
        selectBrandProductsError
    );

    // =================================================
    // FETCH BRAND PRODUCTS
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(
            fetchBrandProducts(id)
        );

        return () => {
            dispatch(
                clearBrandProducts()
            );
        };
    }, [dispatch, id]);

    // =================================================
    // PRODUCT IMAGE
    // =================================================

    const getImage = (product) => {
        // ---------------------------------------------
        // Product images
        // ---------------------------------------------

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            const firstImage =
                product.images[0];

            const imagePath =
                typeof firstImage ===
                "string"
                    ? firstImage
                    : firstImage?.image ||
                      firstImage?.path;

            if (imagePath) {
                const cleanPath =
                    String(imagePath)
                        .trim()
                        .replace(/^\/+/, "");

                if (
                    cleanPath.startsWith(
                        "http://"
                    ) ||
                    cleanPath.startsWith(
                        "https://"
                    )
                ) {
                    return cleanPath;
                }

                if (
                    cleanPath.startsWith(
                        "storage/"
                    )
                ) {
                    return `http://127.0.0.1:8000/${cleanPath}`;
                }

                return `${STORAGE_URL}/${cleanPath}`;
            }
        }

        // ---------------------------------------------
        // Thumbnail
        // ---------------------------------------------

        if (product?.thumbnail) {
            const thumbnail =
                String(product.thumbnail)
                    .trim()
                    .replace(/^\/+/, "");

            if (
                thumbnail.startsWith(
                    "http://"
                ) ||
                thumbnail.startsWith(
                    "https://"
                )
            ) {
                return thumbnail;
            }

            if (
                thumbnail.startsWith(
                    "storage/"
                )
            ) {
                return `http://127.0.0.1:8000/${thumbnail}`;
            }

            return `${STORAGE_URL}/${thumbnail}`;
        }

        // ---------------------------------------------
        // Single image
        // ---------------------------------------------

        if (product?.image) {
            const image =
                String(product.image)
                    .trim()
                    .replace(/^\/+/, "");

            if (
                image.startsWith(
                    "http://"
                ) ||
                image.startsWith(
                    "https://"
                )
            ) {
                return image;
            }

            if (
                image.startsWith(
                    "storage/"
                )
            ) {
                return `http://127.0.0.1:8000/${image}`;
            }

            return `${STORAGE_URL}/${image}`;
        }

        return "/images/no-image.png";
    };

    // =================================================
    // DISCOUNT
    // =================================================

    const getDiscountPercentage = (
        product
    ) => {
        const price = Number(
            product?.price || 0
        );

        const discountPrice = Number(
            product?.discount_price || 0
        );

        if (
            price <= 0 ||
            discountPrice <= 0 ||
            discountPrice >= price
        ) {
            return 0;
        }

        return Math.round(
            ((price - discountPrice) /
                price) *
                100
        );
    };

    // =================================================
    // BRAND NAME
    // =================================================

    const brandName =
        brand?.name ||
        brand?.brand_name ||
        "Brand Products";

    // =================================================
    // INVALID BRAND ID
    // =================================================

    if (!id) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "#f8fafc",
                    py: 6,
                }}
            >
                <Container
                    maxWidth="lg"
                >
                    <ErrorState
                        message="Brand ID is missing."
                    />
                </Container>
            </Box>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f8fafc",
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            <Container
                maxWidth="lg"
            >
                {/* =========================================
                    BREADCRUMBS
                ========================================= */}

                <Breadcrumbs
                    sx={{
                        mb: 3,
                    }}
                    aria-label="breadcrumb"
                >
                    <Link
                        to="/"
                        style={{
                            textDecoration:
                                "none",
                            color: "inherit",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                        >
                            <Home fontSize="small" />

                            <Typography
                                variant="body2"
                            >
                                Home
                            </Typography>
                        </Stack>
                    </Link>

                    <Typography
                        color="text.primary"
                        fontWeight={600}
                    >
                        {brandName}
                    </Typography>
                </Breadcrumbs>

                {/* =========================================
                    PAGE HEADER
                ========================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2.5,
                            sm: 3,
                            md: 4,
                        },
                        mb: 4,
                        borderRadius: 2,
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
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 2,

                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",

                                    bgcolor:
                                        "primary.50",
                                    color:
                                        "primary.main",

                                    flexShrink: 0,
                                }}
                            >
                                <Inventory2 />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {brandName}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Browse all
                                    products from
                                    this brand.
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={() =>
                                navigate(-1)
                            }
                            sx={{
                                textTransform:
                                    "none",
                            }}
                        >
                            Back
                        </Button>
                    </Stack>
                </Paper>

                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({
                            length: 8,
                        }).map(
                            (_, index) => (
                                <ProductSkeleton
                                    key={
                                        index
                                    }
                                />
                            )
                        )}
                    </div>
                )}

                {/* =========================================
                    ERROR
                ========================================= */}

                {!loading && error && (
                    <ErrorState
                        message={error}
                    />
                )}

                {/* =========================================
                    EMPTY
                ========================================= */}

                {!loading &&
                    !error &&
                    products.length ===
                        0 && (
                        <EmptyState
                            title="No Products Found"
                            subtitle={`There are currently no products available for ${brandName}.`}
                        />
                    )}

                {/* =========================================
                    PRODUCTS
                ========================================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <>
                            <Box
                                sx={{
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={
                                        700
                                    }
                                >
                                    {products.length}{" "}
                                    {products.length ===
                                    1
                                        ? "Product"
                                        : "Products"}
                                </Typography>
                            </Box>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map(
                                    (
                                        product
                                    ) => (
                                        <ProductCard
                                            key={
                                                product.id
                                            }
                                            product={
                                                product
                                            }
                                            image={getImage(
                                                product
                                            )}
                                            discount={getDiscountPercentage(
                                                product
                                            )}
                                        />
                                    )
                                )}
                            </div>
                        </>
                    )}
            </Container>
        </Box>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default BrandProducts;


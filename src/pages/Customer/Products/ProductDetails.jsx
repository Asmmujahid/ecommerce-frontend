
// src/pages/Customer/Products/ProductDetails.jsx

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
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Add,
    Remove,
    ShoppingCart,
    Favorite,
    FavoriteBorder,
    Home as HomeIcon,
} from "@mui/icons-material";

import {
    fetchProduct,
    clearProduct,
    selectProduct,
    selectSingleProductLoading,
    selectSingleProductError,
} from "../../../redux/customer/productSlice";

import {
    addToCart,
    selectAddCartLoading,
} from "../../../redux/customer/cartSlice";

import {
    addToWishlist,
    removeFromWishlist,
    selectAddWishlistLoading,
    selectRemoveWishlistLoading,
} from "../../../redux/customer/wishlistSlice";

import { STORAGE_URL } from "../../../utils/storage";
// ============================================================
// COMPONENT
// ============================================================

const ProductDetails = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // ========================================================
    // REDUX
    // ========================================================

    const product = useSelector(
        selectProduct
    );

    const loading = useSelector(
        selectSingleProductLoading
    );

    const error = useSelector(
        selectSingleProductError
    );

    const addCartLoading =
        useSelector(
            selectAddCartLoading
        );

    const addWishlistLoading =
        useSelector(
            selectAddWishlistLoading
        );

    const removeWishlistLoading =
        useSelector(
            selectRemoveWishlistLoading
        );

    // ========================================================
    // LOCAL STATE
    // ========================================================

    const [quantity, setQuantity] =
        useState(1);

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    // ========================================================
    // FETCH PRODUCT
    // ========================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(
            fetchProduct(id)
        );

        return () => {
            dispatch(
                clearProduct()
            );
        };
    }, [dispatch, id]);

    // ========================================================
    // PRODUCT IMAGES
    // ========================================================

    const images = useMemo(() => {
        if (!product) {
            return [];
        }

        const productImages = [];

        // =============================================
        // THUMBNAIL
        // =============================================

        if (product.thumbnail) {
            productImages.push(
                product.thumbnail
            );
        }

        // =============================================
        // GALLERY
        // =============================================

        if (
            Array.isArray(
                product.images
            )
        ) {
            product.images.forEach(
                (image) => {
                    const imagePath =
                        typeof image ===
                        "string"
                            ? image
                            : image?.image;

                    if (
                        imagePath &&
                        !productImages.includes(
                            imagePath
                        )
                    ) {
                        productImages.push(
                            imagePath
                        );
                    }
                }
            );
        }

        return productImages;
    }, [product]);

    // ========================================================
    // IMAGE URL
    // ========================================================

    const getImageUrl = (
        image
    ) => {
        if (!image) {
            return "/images/no-image.png";
        }

        const imageString =
            String(image);

        // =============================================
        // ALREADY COMPLETE URL
        // =============================================

        if (
            imageString.startsWith(
                "http://"
            ) ||
            imageString.startsWith(
                "https://"
            )
        ) {
            return imageString;
        }

        // =============================================
        // REMOVE LEADING SLASH
        // =============================================

        const cleanPath =
            imageString.replace(
                /^\/+/,
                ""
            );

        // =============================================
        // ALREADY STORAGE PATH
        // =============================================

        if (
            cleanPath.startsWith(
                "storage/"
            )
        ) {
            return `${STORAGE_URL.replace(/\/storage$/, "")}/${cleanPath}`;
        }

        // =============================================
        // LARAVEL STORAGE
        // =============================================

        return `${STORAGE_URL}/${cleanPath}`;
    };

    // ========================================================
    // SET FIRST IMAGE
    // ========================================================

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(
                images[0]
            );
        } else {
            setSelectedImage(null);
        }
    }, [images]);

    // ========================================================
    // PRICE
    // ========================================================

    const price = Number(
        product?.price || 0
    );

    const discountPrice =
        Number(
            product?.discount_price ||
                0
        );

    const hasDiscount =
        discountPrice > 0 &&
        discountPrice < price;

    const finalPrice =
        hasDiscount
            ? discountPrice
            : price;

    // ========================================================
    // DISCOUNT
    // ========================================================

    const discountPercentage =
        hasDiscount && price > 0
            ? Math.round(
                  ((price -
                      discountPrice) /
                      price) *
                      100
              )
            : 0;

    // ========================================================
    // STOCK
    // ========================================================

    const stock = Number(
        product?.stock || 0
    );

    const isOutOfStock =
        stock <= 0;

    // ========================================================
    // QUANTITY
    // ========================================================

    const increaseQuantity = () => {
        if (quantity < stock) {
            setQuantity(
                (previous) =>
                    previous + 1
            );
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(
                (previous) =>
                    previous - 1
            );
        }
    };

    // ========================================================
    // ADD TO CART
    // ========================================================

    const handleAddToCart =
        async () => {
            if (
                !product?.id ||
                isOutOfStock
            ) {
                return;
            }

            try {
                const result =
                    await dispatch(
                        addToCart({
                            product_id:
                                product.id,

                            product_variant_id:
                                null,

                            quantity,
                        })
                    );

                if (
                    addToCart.fulfilled.match(
                        result
                    )
                ) {
                    console.log(
                        "Product added to cart:",
                        result.payload
                    );
                } else {
                    console.error(
                        "Add to cart failed:",
                        result.payload
                    );
                }
            } catch (error) {
                console.error(
                    "Add to cart error:",
                    error
                );
            }
        };

    // ========================================================
    // BUY NOW
    // ========================================================

    const handleBuyNow =
        async () => {
            if (
                !product?.id ||
                isOutOfStock
            ) {
                return;
            }

            try {
                const result =
                    await dispatch(
                        addToCart({
                            product_id:
                                product.id,

                            product_variant_id:
                                null,

                            quantity,
                        })
                    );

                if (
                    addToCart.fulfilled.match(
                        result
                    )
                ) {
                    navigate(
                        "/cart"
                    );
                }
            } catch (error) {
                console.error(
                    "Buy now error:",
                    error
                );
            }
        };

    // ========================================================
    // WISHLIST
    // ========================================================

    const handleWishlist =
        async () => {
            if (!product?.id) {
                return;
            }

            try {
                if (isWishlisted) {
                    const result =
                        await dispatch(
                            removeFromWishlist(
                                product.id
                            )
                        );

                    if (
                        removeFromWishlist.fulfilled.match(
                            result
                        )
                    ) {
                        setIsWishlisted(
                            false
                        );
                    }

                    return;
                }

                const result =
                    await dispatch(
                        addToWishlist(
                            product.id
                        )
                    );

                if (
                    addToWishlist.fulfilled.match(
                        result
                    )
                ) {
                    setIsWishlisted(
                        true
                    );
                }
            } catch (error) {
                console.error(
                    "Wishlist error:",
                    error
                );
            }
        };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight:
                        "70vh",
                    display: "flex",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    flexDirection:
                        "column",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading product...
                </Typography>
            </Box>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 8 }}
            >
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {typeof error ===
                    "string"
                        ? error
                        : "Failed to load product."}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/products"
                        )
                    }
                >
                    Back to Products
                </Button>
            </Container>
        );
    }

    // ========================================================
    // PRODUCT NOT FOUND
    // ========================================================

    if (!product) {
        return (
            <Container
                maxWidth="lg"
                sx={{ py: 8 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign:
                            "center",
                        border:
                            "1px solid",
                        borderColor:
                            "divider",
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Product Not Found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        The product you
                        are looking for
                        does not exist
                        or is no longer
                        available.
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Back to Products
                    </Button>
                </Paper>
            </Container>
        );
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor:
                    "#f8fafc",
                py: 4,
            }}
        >
            <Container maxWidth="xl">
                {/* ============================================
                    BREADCRUMBS
                ============================================ */}

                <Breadcrumbs
                    sx={{ mb: 4 }}
                >
                    <Button
                        component={Link}
                        to="/"
                        startIcon={
                            <HomeIcon />
                        }
                        color="inherit"
                    >
                        Home
                    </Button>

                    <Button
                        component={Link}
                        to="/products"
                        color="inherit"
                    >
                        Products
                    </Button>

                    <Typography color="text.primary">
                        {product.name}
                    </Typography>
                </Breadcrumbs>

                {/* ============================================
                    MAIN PRODUCT
                ============================================ */}

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid",
                        borderColor:
                            "divider",
                        overflow:
                            "hidden",
                    }}
                >
                    <Grid container>
                        {/* =====================================
                            IMAGES
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <Box
                                sx={{
                                    p: {
                                        xs: 2,
                                        md: 4,
                                    },
                                }}
                            >
                                {/* MAIN IMAGE */}

                                <Box
                                    sx={{
                                        height: {
                                            xs: 300,
                                            sm: 400,
                                            md: 500,
                                        },
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        backgroundColor:
                                            "#fff",
                                        borderRadius: 3,
                                        overflow:
                                            "hidden",
                                        border:
                                            "1px solid",
                                        borderColor:
                                            "divider",
                                        position:
                                            "relative",
                                    }}
                                >
                                    {hasDiscount && (
                                        <Chip
                                            label={`${discountPercentage}% OFF`}
                                            color="error"
                                            sx={{
                                                position:
                                                    "absolute",
                                                top: 15,
                                                left: 15,
                                                zIndex: 2,
                                                fontWeight:
                                                    700,
                                            }}
                                        />
                                    )}

                                    <Box
                                        component="img"
                                        src={getImageUrl(
                                            selectedImage
                                        )}
                                        alt={
                                            product.name
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
                                            width:
                                                "100%",
                                            height:
                                                "100%",
                                            objectFit:
                                                "contain",
                                            p: 3,
                                        }}
                                    />
                                </Box>

                                {/* THUMBNAILS */}

                                {images.length >
                                    0 && (
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        sx={{
                                            mt: 2,
                                            overflowX:
                                                "auto",
                                            pb: 1,
                                        }}
                                    >
                                        {images.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <Box
                                                    key={`${image}-${index}`}
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            image
                                                        )
                                                    }
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        flexShrink: 0,
                                                        borderRadius: 2,
                                                        overflow:
                                                            "hidden",
                                                        cursor:
                                                            "pointer",
                                                        border:
                                                            "2px solid",
                                                        borderColor:
                                                            selectedImage ===
                                                            image
                                                                ? "primary.main"
                                                                : "divider",
                                                        backgroundColor:
                                                            "#fff",
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={getImageUrl(
                                                            image
                                                        )}
                                                        alt={`${product.name} ${index + 1}`}
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.onerror =
                                                                null;

                                                            event.currentTarget.src =
                                                                "/images/no-image.png";
                                                        }}
                                                        sx={{
                                                            width:
                                                                "100%",
                                                            height:
                                                                "100%",
                                                            objectFit:
                                                                "contain",
                                                        }}
                                                    />
                                                </Box>
                                            )
                                        )}
                                    </Stack>
                                )}
                            </Box>
                        </Grid>

                        {/* =====================================
                            PRODUCT INFORMATION
                        ===================================== */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: {
                                        xs: 3,
                                        md: 5,
                                    },
                                    height:
                                        "100%",
                                }}
                            >
                                {/* BRAND */}

                                {product.brand && (
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        fontWeight={
                                            700
                                        }
                                        sx={{
                                            mb: 1,
                                            textTransform:
                                                "uppercase",
                                        }}
                                    >
                                        {
                                            product
                                                .brand
                                                .name
                                        }
                                    </Typography>
                                )}

                                {/* NAME */}

                                <Typography
                                    variant="h4"
                                    component="h1"
                                    fontWeight={
                                        700
                                    }
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    {
                                        product.name
                                    }
                                </Typography>

                                {/* SKU */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 2,
                                    }}
                                >
                                    SKU:{" "}
                                    {product.sku ||
                                        "N/A"}
                                </Typography>

                                {/* RATING */}

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    <Rating
                                        value={Number(
                                            product.average_rating ||
                                                product.rating ||
                                                0
                                        )}
                                        precision={
                                            0.5
                                        }
                                        readOnly
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        (
                                        {product
                                            ?.reviews
                                            ?.length ||
                                            0}{" "}
                                        reviews)
                                    </Typography>
                                </Stack>

                                <Divider
                                    sx={{
                                        mb: 3,
                                    }}
                                />

                                {/* PRICE */}

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        fontWeight={
                                            800
                                        }
                                        color="primary"
                                    >
                                        Rs.{" "}
                                        {finalPrice.toLocaleString(
                                            "en-PK"
                                        )}
                                    </Typography>

                                    {hasDiscount && (
                                        <Typography
                                            variant="h6"
                                            color="text.secondary"
                                            sx={{
                                                textDecoration:
                                                    "line-through",
                                            }}
                                        >
                                            Rs.{" "}
                                            {price.toLocaleString(
                                                "en-PK"
                                            )}
                                        </Typography>
                                    )}
                                </Stack>

                                {/* DESCRIPTION */}

                                {product.short_description && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            mb: 3,
                                            lineHeight:
                                                1.8,
                                        }}
                                    >
                                        {
                                            product.short_description
                                        }
                                    </Typography>
                                )}

                                {/* STOCK */}

                                <Box
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    {isOutOfStock ? (
                                        <Chip
                                            label="Out of Stock"
                                            color="error"
                                        />
                                    ) : stock <=
                                      5 ? (
                                        <Chip
                                            label={`Only ${stock} left in stock`}
                                            color="warning"
                                        />
                                    ) : (
                                        <Chip
                                            label="In Stock"
                                            color="success"
                                        />
                                    )}
                                </Box>

                                {/* QUANTITY */}

                                {!isOutOfStock && (
                                    <Box
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={
                                                600
                                            }
                                            sx={{
                                                mb: 1,
                                            }}
                                        >
                                            Quantity
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={
                                                1
                                            }
                                        >
                                            <IconButton
                                                onClick={
                                                    decreaseQuantity
                                                }
                                                disabled={
                                                    quantity <=
                                                    1
                                                }
                                                sx={{
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                }}
                                            >
                                                <Remove />
                                            </IconButton>

                                            <Typography
                                                sx={{
                                                    minWidth: 45,
                                                    textAlign:
                                                        "center",
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                {
                                                    quantity
                                                }
                                            </Typography>

                                            <IconButton
                                                onClick={
                                                    increaseQuantity
                                                }
                                                disabled={
                                                    quantity >=
                                                    stock
                                                }
                                                sx={{
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                )}

                                {/* ACTIONS */}

                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={2}
                                    sx={{
                                        mb: 4,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={
                                            addCartLoading ? (
                                                <CircularProgress
                                                    size={
                                                        18
                                                    }
                                                    color="inherit"
                                                />
                                            ) : (
                                                <ShoppingCart />
                                            )
                                        }
                                        disabled={
                                            isOutOfStock ||
                                            addCartLoading
                                        }
                                        onClick={
                                            handleAddToCart
                                        }
                                        sx={{
                                            flex: 1,
                                            py: 1.5,
                                        }}
                                    >
                                        {addCartLoading
                                            ? "Adding..."
                                            : "Add to Cart"}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        disabled={
                                            isOutOfStock ||
                                            addCartLoading
                                        }
                                        onClick={
                                            handleBuyNow
                                        }
                                        sx={{
                                            flex: 1,
                                            py: 1.5,
                                        }}
                                    >
                                        Buy Now
                                    </Button>

                                    <IconButton
                                        onClick={
                                            handleWishlist
                                        }
                                        disabled={
                                            addWishlistLoading ||
                                            removeWishlistLoading
                                        }
                                        sx={{
                                            border:
                                                "1px solid",
                                            borderColor:
                                                "divider",
                                        }}
                                    >
                                        {addWishlistLoading ||
                                        removeWishlistLoading ? (
                                            <CircularProgress
                                                size={
                                                    22
                                                }
                                            />
                                        ) : isWishlisted ? (
                                            <Favorite color="error" />
                                        ) : (
                                            <FavoriteBorder />
                                        )}
                                    </IconButton>
                                </Stack>

                                {/* PRODUCT INFORMATION */}

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        backgroundColor:
                                            "#f8fafc",
                                        borderRadius: 2,
                                    }}
                                >
                                    <Stack
                                        spacing={
                                            1.5
                                        }
                                    >
                                        {product.category && (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                gap={
                                                    2
                                                }
                                            >
                                                <Typography color="text.secondary">
                                                    Category
                                                </Typography>

                                                <Typography fontWeight={600}>
                                                    {
                                                        product
                                                            .category
                                                            .name
                                                    }
                                                </Typography>
                                            </Stack>
                                        )}

                                        {product.brand && (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                gap={
                                                    2
                                                }
                                            >
                                                <Typography color="text.secondary">
                                                    Brand
                                                </Typography>

                                                <Typography fontWeight={600}>
                                                    {
                                                        product
                                                            .brand
                                                            .name
                                                    }
                                                </Typography>
                                            </Stack>
                                        )}

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                        >
                                            <Typography color="text.secondary">
                                                Stock
                                            </Typography>

                                            <Typography fontWeight={600}>
                                                {
                                                    stock
                                                }
                                            </Typography>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            gap={
                                                2
                                            }
                                        >
                                            <Typography color="text.secondary">
                                                SKU
                                            </Typography>

                                            <Typography fontWeight={600}>
                                                {product.sku ||
                                                    "N/A"}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* ============================================
                    DESCRIPTION
                ============================================ */}

                <Card
                    elevation={0}
                    sx={{
                        mt: 4,
                        borderRadius: 3,
                        border:
                            "1px solid",
                        borderColor:
                            "divider",
                    }}
                >
                    <CardContent
                        sx={{ p: 4 }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ mb: 3 }}
                        >
                            Product Description
                        </Typography>

                        <Divider
                            sx={{ mb: 3 }}
                        />

                        <Typography
                            color="text.secondary"
                            sx={{
                                lineHeight: 1.9,
                                whiteSpace:
                                    "pre-line",
                            }}
                        >
                            {product.description ||
                                product.short_description ||
                                "No description available."}
                        </Typography>
                    </CardContent>
                </Card>

                {/* ============================================
                    VARIANTS
                ============================================ */}

                {Array.isArray(
                    product.variants
                ) &&
                    product.variants
                        .length > 0 && (
                        <Card
                            elevation={0}
                            sx={{
                                mt: 4,
                                borderRadius: 3,
                                border:
                                    "1px solid",
                                borderColor:
                                    "divider",
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: 4,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={
                                        700
                                    }
                                    sx={{
                                        mb: 3,
                                    }}
                                >
                                    Available
                                    Variants
                                </Typography>

                                <Grid
                                    container
                                    spacing={2}
                                >
                                    {product.variants.map(
                                        (
                                            variant
                                        ) => (
                                            <Grid
                                                size={{
                                                    xs: 12,
                                                    sm: 6,
                                                    md: 4,
                                                }}
                                                key={
                                                    variant.id
                                                }
                                            >
                                                <Paper
                                                    elevation={
                                                        0
                                                    }
                                                    sx={{
                                                        p: 2.5,
                                                        border:
                                                            "1px solid",
                                                        borderColor:
                                                            "divider",
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                        sx={{
                                                            mb: 1,
                                                        }}
                                                    >
                                                        {variant.sku ||
                                                            "Variant"}
                                                    </Typography>

                                                    {variant.size && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Size:{" "}
                                                            {
                                                                variant.size
                                                            }
                                                        </Typography>
                                                    )}

                                                    {variant.color && (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Color:{" "}
                                                            {
                                                                variant.color
                                                            }
                                                        </Typography>
                                                    )}

                                                    <Typography
                                                        sx={{
                                                            mt: 1,
                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        Rs.{" "}
                                                        {Number(
                                                            variant.price ||
                                                                finalPrice
                                                        ).toLocaleString(
                                                            "en-PK"
                                                        )}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color={
                                                            Number(
                                                                variant.stock ||
                                                                    0
                                                            ) >
                                                            0
                                                                ? "success.main"
                                                                : "error.main"
                                                        }
                                                    >
                                                        {Number(
                                                            variant.stock ||
                                                                0
                                                        ) >
                                                        0
                                                            ? `${variant.stock} available`
                                                            : "Out of stock"}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                {/* ============================================
                    CONTINUE SHOPPING
                ============================================ */}

                <Box
                    sx={{
                        mt: 4,
                        mb: 4,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

// ============================================================
// EXPORT
// ============================================================

export default ProductDetails;


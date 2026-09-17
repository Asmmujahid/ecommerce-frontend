// src/components/customer/products/ProductCard.jsx

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    ShoppingCart,
    Favorite,
    FavoriteBorder,
    Visibility,
} from "@mui/icons-material";

// =====================================================
// CART
// =====================================================

import {
    addToCart,
    selectAddCartLoading,
} from "../../../redux/customer/cartSlice";

// =====================================================
// WISHLIST
// =====================================================

import {
    addToWishlist,
    removeFromWishlist,
    selectAddWishlistLoading,
    selectRemoveWishlistLoading,
} from "../../../redux/customer/wishlistSlice";

// =====================================================
// STORAGE URL
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

// =====================================================
// GET PRODUCT IMAGE
// =====================================================

const getProductImage = (
    product
) => {
    if (product?.thumbnail) {
        const thumbnail = String(
            product.thumbnail
        );

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

        return `${STORAGE_URL}/${thumbnail.replace(
            /^\/+/,
            ""
        )}`;
    }

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
                : firstImage?.image;

        if (imagePath) {
            const image = String(
                imagePath
            );

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

            return `${STORAGE_URL}/${image.replace(
                /^\/+/,
                ""
            )}`;
        }
    }

    return "/images/no-image.png";
};

// =====================================================
// PRICE
// =====================================================

const getPriceData = (
    product
) => {
    const price = Number(
        product?.price || 0
    );

    const discountPrice =
        Number(
            product?.discount_price ||
                0
        );

    if (
        discountPrice > 0 &&
        discountPrice < price
    ) {
        return {
            currentPrice:
                discountPrice,

            originalPrice: price,

            hasDiscount: true,
        };
    }

    return {
        currentPrice: price,

        originalPrice: price,

        hasDiscount: false,
    };
};

// =====================================================
// DISCOUNT
// =====================================================

const getDiscountPercentage = (
    product
) => {
    const price = Number(
        product?.price || 0
    );

    const discountPrice =
        Number(
            product?.discount_price ||
                0
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

// =====================================================
// COMPONENT
// =====================================================

const ProductCard = ({
    product,
    isWishlisted = false,
}) => {
    const dispatch = useDispatch();

    // =================================================
    // LOADING
    // =================================================

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

    // =================================================
    // SAFETY
    // =================================================

    if (!product) {
        return null;
    }

    // =================================================
    // DATA
    // =================================================

    const image =
        getProductImage(product);

    const {
        currentPrice,
        originalPrice,
        hasDiscount,
    } = getPriceData(product);

    const discount =
        getDiscountPercentage(
            product
        );

    const isFeatured =
        product?.featured === 1 ||
        product?.featured === true;

    const isInStock =
        Number(
            product?.stock || 0
        ) > 0;

    // =================================================
    // CART
    // =================================================

    const handleCart = async () => {
        if (!product?.id) {
            console.error(
                "Product ID is missing:",
                product
            );

            return;
        }

        if (!isInStock) {
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

                        quantity: 1,
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

    // =================================================
    // WISHLIST
    // =================================================

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
                        console.log(
                            "Removed from wishlist:",
                            result.payload
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
                    console.log(
                        "Added to wishlist:",
                        result.payload
                    );
                }
            } catch (error) {
                console.error(
                    "Wishlist error:",
                    error
                );
            }
        };

    // =================================================
    // WISHLIST LOADING
    // =================================================

    const wishlistLoading =
        addWishlistLoading ||
        removeWishlistLoading;

    // =================================================
    // RENDER
    // =================================================

    return (
        <Card
            sx={{
                height: "100%",

                display: "flex",

                flexDirection:
                    "column",

                borderRadius: 3,

                overflow: "hidden",

                border: "1px solid",

                borderColor:
                    "grey.200",

                backgroundColor:
                    "#fff",

                transition:
                    "transform 0.25s ease, box-shadow 0.25s ease",

                "&:hover": {
                    transform:
                        "translateY(-5px)",

                    boxShadow: 6,
                },
            }}
        >
            {/* =================================================
                IMAGE
            ================================================= */}

            <Box
                sx={{
                    position:
                        "relative",

                    width: "100%",

                    height: 250,

                    backgroundColor:
                        "#f8fafc",

                    overflow: "hidden",
                }}
            >
                <CardMedia
                    component="img"
                    src={image}
                    alt={
                        product?.name ||
                        "Product image"
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
                        width: "100%",

                        height: "100%",

                        objectFit:
                            "contain",

                        p: 2,

                        transition:
                            "transform 0.3s ease",

                        "&:hover": {
                            transform:
                                "scale(1.05)",
                        },
                    }}
                />

                {/* Discount */}

                {discount > 0 && (
                    <Chip
                        label={`-${discount}%`}
                        size="small"
                        color="error"
                        sx={{
                            position:
                                "absolute",

                            top: 12,

                            left: 12,

                            fontWeight: 700,
                        }}
                    />
                )}

                {/* Featured */}

                {isFeatured && (
                    <Chip
                        label="Featured"
                        size="small"
                        color="warning"
                        sx={{
                            position:
                                "absolute",

                            top: 12,

                            right: 12,

                            fontWeight: 700,
                        }}
                    />
                )}

                {/* Wishlist */}

                <Tooltip
                    title={
                        isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                    }
                >
                    <span>
                        <IconButton
                            onClick={
                                handleWishlist
                            }
                            disabled={
                                wishlistLoading
                            }
                            sx={{
                                position:
                                    "absolute",

                                right: 12,

                                bottom: 12,

                                backgroundColor:
                                    "#fff",

                                boxShadow: 2,

                                "&:hover": {
                                    backgroundColor:
                                        "#fff",
                                },
                            }}
                        >
                            {wishlistLoading ? (
                                <CircularProgress
                                    size={22}
                                />
                            ) : isWishlisted ? (
                                <Favorite color="error" />
                            ) : (
                                <FavoriteBorder />
                            )}
                        </IconButton>
                    </span>
                </Tooltip>

                {/* Out Of Stock */}

                {!isInStock && (
                    <Chip
                        label="Out of Stock"
                        size="small"
                        sx={{
                            position:
                                "absolute",

                            bottom: 12,

                            left: 12,

                            backgroundColor:
                                "grey.800",

                            color: "#fff",

                            fontWeight: 700,
                        }}
                    />
                )}
            </Box>

            {/* =================================================
                CONTENT
            ================================================= */}

            <CardContent
                sx={{
                    flexGrow: 1,

                    display: "flex",

                    flexDirection:
                        "column",

                    p: 2.5,
                }}
            >
                {/* Category */}

                {product?.category
                    ?.name && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            textTransform:
                                "uppercase",

                            fontWeight: 700,

                            mb: 0.5,
                        }}
                    >
                        {
                            product
                                .category
                                .name
                        }
                    </Typography>
                )}

                {/* Brand */}

                {product?.brand?.name && (
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                            fontWeight: 700,

                            mb: 0.5,
                        }}
                    >
                        {
                            product.brand
                                .name
                        }
                    </Typography>
                )}

                {/* Name */}

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 700,

                        lineHeight: 1.3,

                        mb: 1,

                        display:
                            "-webkit-box",

                        WebkitLineClamp: 2,

                        WebkitBoxOrient:
                            "vertical",

                        overflow:
                            "hidden",
                    }}
                >
                    {product?.name ||
                        "Unnamed Product"}
                </Typography>

                {/* Description */}

                {product
                    ?.short_description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,

                            display:
                                "-webkit-box",

                            WebkitLineClamp: 2,

                            WebkitBoxOrient:
                                "vertical",

                            overflow:
                                "hidden",
                        }}
                    >
                        {
                            product.short_description
                        }
                    </Typography>
                )}

                {/* Price */}

                <Box
                    sx={{
                        mt: "auto",

                        mb: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Typography
                            variant="h6"
                            color="primary"
                            fontWeight={800}
                        >
                            Rs.{" "}
                            {currentPrice.toLocaleString(
                                "en-PK"
                            )}
                        </Typography>

                        {hasDiscount && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    textDecoration:
                                        "line-through",
                                }}
                            >
                                Rs.{" "}
                                {originalPrice.toLocaleString(
                                    "en-PK"
                                )}
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Stock */}

                <Typography
                    variant="caption"
                    sx={{
                        color: isInStock
                            ? "success.main"
                            : "error.main",

                        fontWeight: 700,

                        mb: 2,
                    }}
                >
                    {isInStock
                        ? `${product.stock} in stock`
                        : "Currently unavailable"}
                </Typography>

                {/* Buttons */}

                <Stack spacing={1.2}>
                    {/* Add To Cart */}

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={
                            addCartLoading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <ShoppingCart />
                            )
                        }
                        disabled={
                            !isInStock ||
                            addCartLoading
                        }
                        onClick={
                            handleCart
                        }
                        sx={{
                            borderRadius: 2,

                            py: 1.2,

                            fontWeight: 700,

                            textTransform:
                                "none",
                        }}
                    >
                        {addCartLoading
                            ? "Adding..."
                            : isInStock
                            ? "Add to Cart"
                            : "Out of Stock"}
                    </Button>

                    {/* View Product */}

                    <Button
                        component={Link}
                        to={`/products/${product.id}`}
                        variant="outlined"
                        fullWidth
                        startIcon={
                            <Visibility />
                        }
                        sx={{
                            borderRadius: 2,

                            py: 1.2,

                            fontWeight: 700,

                            textTransform:
                                "none",
                        }}
                    >
                        View Product
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import {
    removeFromWishlist,
} from "../../../redux/customer/wishlistSlice";

import {
    addToCart,
} from "../../../redux/customer/cartSlice";

const WishlistCard = ({ wishlist }) => {

    const dispatch = useDispatch();

    const [removing, setRemoving] = useState(false);

    // =====================================================
    // Product
    // =====================================================

    const product = wishlist?.product;

    if (!product) {
        return null;
    }

    // =====================================================
    // Product Information
    // =====================================================

    const productName =
        product?.name || "Unnamed Product";

    const categoryName =
        product?.category?.name || "Uncategorized";

    const brandName =
        product?.brand?.name || "No Brand";

    const price =
        Number(product?.price ?? 0);

    const stock =
        Number(product?.stock ?? product?.quantity ?? 0);

    // =====================================================
    // Product Image
    // =====================================================

    const firstImage =
        Array.isArray(product?.images) &&
        product.images.length > 0
            ? product.images[0]
            : null;

    const imageUrl =
        firstImage?.image ||
        firstImage?.image_url ||
        firstImage?.url ||
        product?.thumbnail ||
        product?.image ||
        "/images/no-image.png";

    // =====================================================
    // Variants
    // =====================================================

    const variants =
        Array.isArray(product?.variants)
            ? product.variants
            : [];

    // =====================================================
    // Remove Wishlist
    // =====================================================

    const handleRemove = async () => {

        if (!wishlist?.id) {
            return;
        }

        try {

            setRemoving(true);

            await dispatch(
                removeFromWishlist(wishlist.id)
            ).unwrap();

        } catch (error) {

            console.error(
                "Remove wishlist error:",
                error
            );

        } finally {

            setRemoving(false);
        }
    };

    // =====================================================
    // Add To Cart
    // =====================================================

    const handleAddToCart = async () => {

        if (!product?.id) {
            return;
        }

        if (stock <= 0) {
            return;
        }

        try {

            await dispatch(
                addToCart({
                    product_id: product.id,
                    product_variant_id:
                        variants.length > 0
                            ? variants[0]?.id ?? null
                            : null,
                    quantity: 1,
                })
            ).unwrap();

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

        }
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                transition: "0.2s",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5,
                },
            }}
        >

            {/* =================================================
                Product Image
            ================================================= */}

            <Box
                sx={{
                    position: "relative",
                    backgroundColor: "#f5f5f5",
                }}
            >

                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={productName}
                    sx={{
                        width: "100%",
                        height: 230,
                        objectFit: "contain",
                        p: 2,
                    }}
                    onError={(event) => {
                        event.currentTarget.src =
                            "/images/no-image.png";
                    }}
                />

                {/* Remove */}

                <IconButton
                    onClick={handleRemove}
                    disabled={removing}
                    aria-label="remove from wishlist"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "#ffffff",

                        "&:hover": {
                            backgroundColor: "#ffebee",
                        },
                    }}
                >
                    <DeleteOutlineIcon
                        color="error"
                    />
                </IconButton>

            </Box>

            {/* =================================================
                Content
            ================================================= */}

            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >

                {/* Product Name */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {productName}
                </Typography>

                {/* Brand / Category */}

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{
                        mb: 1.5,
                    }}
                >

                    <Chip
                        size="small"
                        label={brandName}
                        variant="outlined"
                    />

                    <Chip
                        size="small"
                        label={categoryName}
                        variant="outlined"
                    />

                </Stack>

                <Divider sx={{ mb: 1.5 }} />

                {/* Price */}

                <Typography
                    variant="h6"
                    color="primary"
                    fontWeight={700}
                    sx={{
                        mb: 1,
                    }}
                >
                    Rs. {price.toLocaleString()}
                </Typography>

                {/* Stock */}

                {stock > 0 ? (
                    <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ mb: 1 }}
                    >
                        In Stock
                    </Typography>
                ) : (
                    <Typography
                        variant="body2"
                        color="error.main"
                        sx={{ mb: 1 }}
                    >
                        Out of Stock
                    </Typography>
                )}

                {/* Variants */}

                {variants.length > 0 && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {variants.length} variant
                        {variants.length > 1
                            ? "s"
                            : ""}
                    </Typography>
                )}

                {/* =================================================
                    Buttons
                ================================================= */}

                <Stack
                    spacing={1}
                    sx={{
                        mt: "auto",
                    }}
                >

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={
                            <ShoppingCartOutlinedIcon />
                        }
                        disabled={
                            stock <= 0
                        }
                        onClick={
                            handleAddToCart
                        }
                    >
                        {stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={
                            <DeleteOutlineIcon />
                        }
                        disabled={removing}
                        onClick={
                            handleRemove
                        }
                    >
                        {removing
                            ? "Removing..."
                            : "Remove"}
                    </Button>

                </Stack>

            </CardContent>

        </Card>
    );
};

export default WishlistCard;
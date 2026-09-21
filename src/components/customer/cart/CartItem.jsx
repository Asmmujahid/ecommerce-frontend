
// src/components/customer/cart/CartItem.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    Add,
    DeleteOutline,
    Remove,
} from "@mui/icons-material";

import {
    updateCartItem,
    removeCartItem,
    selectUpdateCartLoading,
    selectRemoveCartLoading,
} from "../../../redux/customer/cartSlice";

// =====================================================
// Component
// =====================================================

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    // =================================================
    // Redux State
    // =================================================

    const updateLoading = useSelector(
        selectUpdateCartLoading
    );

    const removeLoading = useSelector(
        selectRemoveCartLoading
    );

    // =================================================
    // Local Quantity
    // =================================================

    const [quantity, setQuantity] = useState(
        Number(item?.quantity || 1)
    );

    // =================================================
    // Product
    // =================================================

    const product = item?.product;

    const variant = item?.product_variant;

    // =================================================
    // Price
    // =================================================

    const price = Number(item?.price || 0);

    const subtotal = price * quantity;

    // =================================================
    // Product Image
    // =================================================

    const getProductImage = () => {
        // ---------------------------------------------
        // Product images
        // ---------------------------------------------

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            const firstImage = product.images[0];

            const imagePath =
                typeof firstImage === "string"
                    ? firstImage
                    : firstImage?.image ||
                      firstImage?.path ||
                      firstImage?.url;

            if (imagePath) {
                if (
                    imagePath.startsWith("http://") ||
                    imagePath.startsWith("https://")
                ) {
                    return imagePath;
                }

                return `${STORAGE_URL}/${imagePath}`;
            }
        }

        // ---------------------------------------------
        // Product thumbnail
        // ---------------------------------------------

        if (product?.thumbnail) {
            if (
                product.thumbnail.startsWith("http://") ||
                product.thumbnail.startsWith("https://")
            ) {
                return product.thumbnail;
            }

            return `${STORAGE_URL}/${product.thumbnail}`;
        }

        // ---------------------------------------------
        // Default image
        // ---------------------------------------------

        return "/images/no-image.png";
    };

    // =================================================
    // Increase Quantity
    // =================================================

    const increaseQuantity = () => {
        setQuantity((previous) => previous + 1);
    };

    // =================================================
    // Decrease Quantity
    // =================================================

    const decreaseQuantity = () => {
        setQuantity((previous) =>
            previous > 1
                ? previous - 1
                : 1
        );
    };

    // =================================================
    // Update Quantity
    // =================================================

    const handleUpdate = () => {
        if (!item?.id) {
            return;
        }

        dispatch(
            updateCartItem({
                id: item.id,
                quantity,
            })
        );
    };

    // =================================================
    // Remove Item
    // =================================================

    const handleRemove = () => {
        if (!item?.id) {
            return;
        }

        dispatch(
            removeCartItem(item.id)
        );
    };

    // =================================================
    // Variant Name
    // =================================================

    const getVariantName = () => {
        if (!variant) {
            return null;
        }

        // Common variant fields
        if (variant?.name) {
            return variant.name;
        }

        if (variant?.sku) {
            return `SKU: ${variant.sku}`;
        }

        // If your variant stores attributes
        if (variant?.attributes) {
            if (
                typeof variant.attributes ===
                "string"
            ) {
                return variant.attributes;
            }

            if (
                typeof variant.attributes ===
                "object"
            ) {
                return Object.entries(
                    variant.attributes
                )
                    .map(
                        ([key, value]) =>
                            `${key}: ${value}`
                    )
                    .join(" • ");
            }
        }

        return null;
    };

    const variantName = getVariantName();

    // =================================================
    // Render
    // =================================================

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 3,
                p: {
                    xs: 2,
                    sm: 3,
                },
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={3}
                alignItems={{
                    xs: "stretch",
                    sm: "center",
                }}
            >
                {/* =====================================
                    Product Image
                ====================================== */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: 120,
                        },
                        height: {
                            xs: 220,
                            sm: 120,
                        },
                        flexShrink: 0,
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor:
                            "grey.100",
                    }}
                >
                    <Box
                        component="img"
                        src={getProductImage()}
                        alt={
                            product?.name ||
                            "Product"
                        }
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                        onError={(event) => {
                            event.currentTarget.src =
                                "/images/no-image.png";
                        }}
                    />
                </Box>

                {/* =====================================
                    Product Information
                ====================================== */}

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace: {
                                xs: "normal",
                                sm: "nowrap",
                            },
                        }}
                    >
                        {product?.name ||
                            "Product"}
                    </Typography>

                    {/* SKU */}

                    {product?.sku && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                        >
                            SKU: {product.sku}
                        </Typography>
                    )}

                    {/* Variant */}

                    {variantName && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Variant:{" "}
                            {variantName}
                        </Typography>
                    )}

                    {/* Price */}

                    <Typography
                        variant="body1"
                        fontWeight={600}
                        color="primary"
                    >
                        Rs.{" "}
                        {price.toLocaleString(
                            "en-PK"
                        )}
                    </Typography>
                </Box>

                {/* =====================================
                    Quantity Controls
                ====================================== */}

                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            textAlign: {
                                xs: "left",
                                sm: "center",
                            },
                        }}
                    >
                        Quantity
                    </Typography>

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <IconButton
                            size="small"
                            onClick={
                                decreaseQuantity
                            }
                            disabled={
                                quantity <= 1 ||
                                updateLoading ||
                                removeLoading
                            }
                            sx={{
                                border: "1px solid",
                                borderColor:
                                    "grey.300",
                            }}
                        >
                            <Remove fontSize="small" />
                        </IconButton>

                        <Typography
                            sx={{
                                minWidth: 35,
                                textAlign:
                                    "center",
                                fontWeight: 700,
                            }}
                        >
                            {quantity}
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={
                                increaseQuantity
                            }
                            disabled={
                                updateLoading ||
                                removeLoading
                            }
                            sx={{
                                border: "1px solid",
                                borderColor:
                                    "grey.300",
                            }}
                        >
                            <Add fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>

                {/* =====================================
                    Subtotal
                ====================================== */}

                <Box
                    sx={{
                        minWidth: {
                            xs: "auto",
                            sm: 130,
                        },
                        textAlign: {
                            xs: "left",
                            sm: "right",
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                    >
                        Subtotal
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Rs.{" "}
                        {subtotal.toLocaleString(
                            "en-PK"
                        )}
                    </Typography>
                </Box>

                {/* =====================================
                    Actions
                ====================================== */}

                <Stack
                    direction={{
                        xs: "row",
                        sm: "column",
                    }}
                    spacing={1}
                    alignItems="center"
                >
                    {/* Update */}

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleUpdate}
                        disabled={
                            updateLoading ||
                            removeLoading
                        }
                    >
                        {updateLoading ? (
                            <CircularProgress
                                size={18}
                            />
                        ) : (
                            "Update"
                        )}
                    </Button>

                    {/* Remove */}

                    <IconButton
                        color="error"
                        onClick={handleRemove}
                        disabled={
                            updateLoading ||
                            removeLoading
                        }
                        title="Remove from cart"
                    >
                        {removeLoading ? (
                            <CircularProgress
                                size={22}
                                color="error"
                            />
                        ) : (
                            <DeleteOutline />
                        )}
                    </IconButton>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default CartItem;


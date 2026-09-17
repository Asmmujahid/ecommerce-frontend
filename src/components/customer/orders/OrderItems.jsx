import React from "react";

import {
    Box,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    Inventory2Outlined,
} from "@mui/icons-material";

// =====================================================
// Currency
// =====================================================

const formatCurrency = (amount) => {
    const value = Number(amount ?? 0);

    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// =====================================================
// Product Image
// =====================================================

const getProductImage = (item) => {
    const product = item?.product ?? {};

    if (
        typeof product?.image === "string" &&
        product.image.trim()
    ) {
        return product.image;
    }

    if (
        typeof product?.image_url === "string" &&
        product.image_url.trim()
    ) {
        return product.image_url;
    }

    if (
        typeof product?.thumbnail === "string" &&
        product.thumbnail.trim()
    ) {
        return product.thumbnail;
    }

    if (
        typeof product?.featured_image === "string" &&
        product.featured_image.trim()
    ) {
        return product.featured_image;
    }

    if (
        typeof product?.main_image === "string" &&
        product.main_image.trim()
    ) {
        return product.main_image;
    }

    if (
        Array.isArray(product?.images) &&
        product.images.length > 0
    ) {
        const firstImage = product.images[0];

        if (typeof firstImage === "string") {
            return firstImage;
        }

        return (
            firstImage?.image_url ||
            firstImage?.url ||
            firstImage?.image ||
            null
        );
    }

    if (
        typeof item?.image === "string" &&
        item.image.trim()
    ) {
        return item.image;
    }

    return null;
};

// =====================================================
// Product Name
// =====================================================

const getProductName = (item) => {
    return (
        item?.product?.name ||
        item?.product?.title ||
        item?.product_name ||
        `Product #${item?.product_id ?? "N/A"}`
    );
};

// =====================================================
// Variant Information
// =====================================================

const getVariantInfo = (item) => {
    const variant =
        item?.productVariant ??
        item?.product_variant ??
        item?.variant ??
        null;

    if (!variant) {
        return [];
    }

    const details = [];

    if (variant.color) {
        details.push(
            `Color: ${variant.color}`
        );
    }

    if (variant.size) {
        details.push(
            `Size: ${variant.size}`
        );
    }

    if (
        variant.name &&
        !variant.color &&
        !variant.size
    ) {
        details.push(variant.name);
    }

    if (variant.sku) {
        details.push(
            `SKU: ${variant.sku}`
        );
    }

    return details;
};

// =====================================================
// Single Order Item
// =====================================================

const OrderItemRow = ({
    item,
    showDivider = true,
}) => {
    const image = getProductImage(item);

    const productName =
        getProductName(item);

    const quantity =
        Number(item?.quantity ?? 0);

    const price =
        Number(
            item?.price ??
                item?.unit_price ??
                0
        );

    const total =
        Number(
            item?.total ??
                item?.subtotal ??
                price * quantity
        );

    const variantInfo =
        getVariantInfo(item);

    return (
        <>
            <Box
                sx={{
                    py: 2,
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                }}
            >
                {/* =========================================
                    IMAGE
                ========================================= */}

                <Box
                    sx={{
                        width: {
                            xs: 70,
                            sm: 90,
                        },
                        height: {
                            xs: 70,
                            sm: 90,
                        },
                        flexShrink: 0,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor:
                            "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {image ? (
                        <Box
                            component="img"
                            src={image}
                            alt={productName}
                            sx={{
                                width: "100%",
                                height: "100%",
                                objectFit:
                                    "cover",
                                display:
                                    "block",
                            }}
                            onError={(event) => {
                                event.currentTarget.style.display =
                                    "none";
                            }}
                        />
                    ) : (
                        <Inventory2Outlined
                            sx={{
                                fontSize: 35,
                                color:
                                    "text.secondary",
                            }}
                        />
                    )}
                </Box>

                {/* =========================================
                    PRODUCT INFO
                ========================================= */}

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                            wordBreak:
                                "break-word",
                        }}
                    >
                        {productName}
                    </Typography>

                    {/* Variant */}

                    {variantInfo.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            sx={{
                                mt: 0.75,
                            }}
                        >
                            {variantInfo.map(
                                (
                                    detail,
                                    index
                                ) => (
                                    <Typography
                                        key={`${detail}-${index}`}
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {detail}
                                    </Typography>
                                )
                            )}
                        </Stack>
                    )}

                    {/* Product ID */}

                    {item?.product_id && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Product ID:{" "}
                            {item.product_id}
                        </Typography>
                    )}

                    {/* Quantity */}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                        }}
                    >
                        Quantity:{" "}
                        <strong>
                            {quantity}
                        </strong>
                    </Typography>
                </Box>

                {/* =========================================
                    PRICE
                ========================================= */}

                <Box
                    sx={{
                        minWidth: {
                            xs: 90,
                            sm: 120,
                        },
                        textAlign: "right",
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {formatCurrency(price)} ×{" "}
                        {quantity}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        {formatCurrency(total)}
                    </Typography>
                </Box>
            </Box>

            {showDivider && <Divider />}
        </>
    );
};

// =====================================================
// OrderItems
// =====================================================

const OrderItems = ({
    items = [],
    loading = false,
    showHeader = true,
    showDivider = true,
    sx = {},
}) => {
    const safeItems = Array.isArray(items)
        ? items
        : [];

    // =================================================
    // Loading
    // =================================================

    if (loading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 3,
                    ...sx,
                }}
            >
                <Typography color="text.secondary">
                    Loading order items...
                </Typography>
            </Paper>
        );
    }

    // =================================================
    // Empty
    // =================================================

    if (safeItems.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    ...sx,
                }}
            >
                <Inventory2Outlined
                    sx={{
                        fontSize: 45,
                        color: "text.secondary",
                        mb: 1,
                    }}
                />

                <Typography fontWeight={600}>
                    No items found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    This order does not contain
                    any items.
                </Typography>
            </Paper>
        );
    }

    // =================================================
    // Total Quantity
    // =================================================

    const totalQuantity =
        safeItems.reduce(
            (total, item) =>
                total +
                Number(
                    item?.quantity ?? 0
                ),
            0
        );

    // =================================================
    // Render
    // =================================================

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                ...sx,
            }}
        >
            {/* Header */}

            {showHeader && (
                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                        py: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Order Items
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {safeItems.length}{" "}
                                product
                                {safeItems.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                ·{" "}
                                {totalQuantity}{" "}
                                item
                                {totalQuantity !==
                                1
                                    ? "s"
                                    : ""}
                            </Typography>
                        </Box>

                        <Inventory2Outlined color="action" />
                    </Stack>
                </Box>
            )}

            {/* Items */}

            <Box
                sx={{
                    px: {
                        xs: 2,
                        sm: 3,
                    },
                }}
            >
                {safeItems.map(
                    (item, index) => (
                        <OrderItemRow
                            key={
                                item?.id ??
                                `${item?.product_id}-${index}`
                            }
                            item={item}
                            showDivider={
                                showDivider &&
                                index <
                                    safeItems.length -
                                        1
                            }
                        />
                    )
                )}
            </Box>
        </Paper>
    );
};

export default OrderItems;
import React from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StoreIcon from "@mui/icons-material/Store";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const ProductCard = ({
    product,
    onView,
    onEdit,
    onDelete,
}) => {
    if (!product) {
        return null;
    }

    // =========================================================
    // OWNERSHIP
    // =========================================================

    const ownerType = String(
        product.owner_type || "vendor"
    ).toLowerCase();

    const isVendorOwned = ownerType === "vendor";
    const isAdminOwned = ownerType === "admin";

    // =========================================================
    // PRODUCT DATA
    // =========================================================

    const productName =
        product.name || "Unnamed Product";

    const productImage =
        product.images?.[0]?.image ||
        product.images?.[0]?.url ||
        product.image ||
        "/images/product-placeholder.png";

    const storeName =
        product.vendor?.store_name ||
        product.vendor?.name ||
        product.vendor?.business_name ||
        "Vendor Store";

    const price = Number(product.price || 0);

    const discountPrice =
        product.discount_price !== null &&
        product.discount_price !== undefined
            ? Number(product.discount_price)
            : null;

    const stock = Number(product.stock || 0);

    // =========================================================
    // HANDLERS
    // =========================================================

    const handleView = () => {
        if (onView) {
            onView(product);
        }
    };

    const handleEdit = () => {
        if (!isVendorOwned) {
            return;
        }

        if (onEdit) {
            onEdit(product);
        }
    };

    const handleDelete = () => {
        if (!isVendorOwned) {
            return;
        }

        if (onDelete) {
            onDelete(product);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* PRODUCT IMAGE */}
            <Box
                sx={{
                    height: 220,
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Box
                    component="img"
                    src={productImage}
                    alt={productName}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    onError={(event) => {
                        event.currentTarget.src =
                            "/images/product-placeholder.png";
                    }}
                />
            </Box>

            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {/* PRODUCT NAME */}
                <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    noWrap
                >
                    {productName}
                </Typography>

                {/* OWNERSHIP */}
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                >
                    {isAdminOwned ? (
                        <Chip
                            icon={
                                <AdminPanelSettingsIcon />
                            }
                            label="Admin Owned"
                            size="small"
                            color="warning"
                        />
                    ) : (
                        <Chip
                            icon={<StoreIcon />}
                            label="Your Product"
                            size="small"
                            color="primary"
                        />
                    )}
                </Stack>

                {/* STORE */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Store: {storeName}
                </Typography>

                {/* PRICE */}
                <Box sx={{ mb: 1 }}>
                    {discountPrice !== null &&
                    discountPrice < price ? (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Rs.{" "}
                                {discountPrice.toLocaleString()}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    textDecoration:
                                        "line-through",
                                }}
                                color="text.secondary"
                            >
                                Rs.{" "}
                                {price.toLocaleString()}
                            </Typography>
                        </Stack>
                    ) : (
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Rs. {price.toLocaleString()}
                        </Typography>
                    )}
                </Box>

                {/* STOCK */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Stock: {stock}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Divider sx={{ mb: 2 }} />

                {/* ACTIONS */}
                <Stack spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={handleView}
                        fullWidth
                    >
                        View
                    </Button>

                    {isVendorOwned && (
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                                fullWidth
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                fullWidth
                            >
                                Delete
                            </Button>
                        </>
                    )}

                    {isAdminOwned && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                textAlign: "center",
                                display: "block",
                                mt: 1,
                            }}
                        >
                            Admin-managed product.
                            You can sell/view it, but
                            cannot edit or delete it.
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProductCard;


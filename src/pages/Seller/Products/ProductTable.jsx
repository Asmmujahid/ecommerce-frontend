import React from "react";

import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StoreIcon from "@mui/icons-material/Store";

const ProductTable = ({
    products = [],
    onView,
    onEdit,
    onDelete,
}) => {
    // =========================================================
    // IMAGE
    // =========================================================

    const getProductImage = (product) => {
        return (
            product?.images?.[0]?.image ||
            product?.images?.[0]?.url ||
            product?.image ||
            "/images/product-placeholder.png"
        );
    };

    // =========================================================
    // STORE
    // =========================================================

    const getStoreName = (product) => {
        return (
            product?.vendor?.store_name ||
            product?.vendor?.name ||
            product?.vendor?.business_name ||
            "Vendor Store"
        );
    };

    // =========================================================
    // OWNER
    // =========================================================

    const getOwnerType = (product) => {
        return String(
            product?.owner_type || "vendor"
        ).toLowerCase();
    };

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (!products.length) {
        return (
            <Paper sx={{ p: 4 }}>
                <Typography
                    textAlign="center"
                    color="text.secondary"
                >
                    No products found.
                </Typography>
            </Paper>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>

                        <TableCell>
                            Product
                        </TableCell>

                        <TableCell>
                            Ownership
                        </TableCell>

                        <TableCell>
                            Store
                        </TableCell>

                        <TableCell>
                            Category
                        </TableCell>

                        <TableCell>
                            Brand
                        </TableCell>

                        <TableCell>
                            Price
                        </TableCell>

                        <TableCell>
                            Discount Price
                        </TableCell>

                        <TableCell>
                            Stock
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {products.map(
                        (product, index) => {
                            const ownerType =
                                getOwnerType(product);

                            const isVendorOwned =
                                ownerType === "vendor";

                            const isAdminOwned =
                                ownerType === "admin";

                            const image =
                                getProductImage(
                                    product
                                );

                            const category =
                                product?.category
                                    ?.name ||
                                "-";

                            const brand =
                                product?.brand
                                    ?.name ||
                                "-";

                            const price = Number(
                                product?.price || 0
                            );

                            const discountPrice =
                                product
                                    ?.discount_price !==
                                    null &&
                                product
                                    ?.discount_price !==
                                    undefined
                                    ? Number(
                                          product.discount_price
                                      )
                                    : null;

                            const stock = Number(
                                product?.stock || 0
                            );

                            const status =
                                product?.status ||
                                "active";

                            return (
                                <TableRow
                                    key={product.id}
                                    hover
                                >
                                    {/* NUMBER */}
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>

                                    {/* PRODUCT */}
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={
                                                    image
                                                }
                                                alt={
                                                    product.name
                                                }
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit:
                                                        "cover",
                                                    borderRadius:
                                                        1,
                                                }}
                                                onError={(
                                                    event
                                                ) => {
                                                    event.currentTarget.src =
                                                        "/images/product-placeholder.png";
                                                }}
                                            />

                                            <Box>
                                                <Typography
                                                    fontWeight={
                                                        600
                                                    }
                                                >
                                                    {
                                                        product.name
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    ID:{" "}
                                                    {
                                                        product.id
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    {/* OWNERSHIP */}
                                    <TableCell>
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
                                                icon={
                                                    <StoreIcon />
                                                }
                                                label="Vendor Owned"
                                                size="small"
                                                color="primary"
                                            />
                                        )}
                                    </TableCell>

                                    {/* STORE */}
                                    <TableCell>
                                        {getStoreName(
                                            product
                                        )}
                                    </TableCell>

                                    {/* CATEGORY */}
                                    <TableCell>
                                        {category}
                                    </TableCell>

                                    {/* BRAND */}
                                    <TableCell>
                                        {brand}
                                    </TableCell>

                                    {/* PRICE */}
                                    <TableCell>
                                        Rs.{" "}
                                        {price.toLocaleString()}
                                    </TableCell>

                                    {/* DISCOUNT */}
                                    <TableCell>
                                        {discountPrice !==
                                            null &&
                                        discountPrice >
                                            0
                                            ? `Rs. ${discountPrice.toLocaleString()}`
                                            : "-"}
                                    </TableCell>

                                    {/* STOCK */}
                                    <TableCell>
                                        {stock}
                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>
                                        <Chip
                                            label={status}
                                            size="small"
                                            color={
                                                status ===
                                                "active"
                                                    ? "success"
                                                    : "default"
                                            }
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell align="center">
                                        <Tooltip title="View">
                                            <IconButton
                                                color="info"
                                                onClick={() =>
                                                    onView?.(
                                                        product
                                                    )
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {isVendorOwned && (
                                            <>
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() =>
                                                            onEdit?.(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            onDelete?.(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        {isAdminOwned && (
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                color="text.secondary"
                                            >
                                                Admin
                                                managed
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;


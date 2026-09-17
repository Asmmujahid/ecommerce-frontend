import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import OrderStatusChip from "./OrderStatusChip";
import OrderPaymentChip from "./OrderPaymentChip";

const OrderDetailsCard = ({ order }) => {
    if (!order) {
        return null;
    }

    const getTotalAmount = () => {
        return Number(
            order.total_amount ??
                order.total ??
                0
        ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const getItemPrice = (item) => {
        return Number(
            item?.price ?? 0
        ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const getItemTotal = (item) => {
        const total =
            item?.total ??
            Number(item?.price ?? 0) *
                Number(item?.quantity ?? 0);

        return Number(total || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    const getOwnerType = (item) => {
        return (
            item?.product_owner_type ??
            item?.product?.owner_type ??
            "vendor"
        );
    };

    const isAdminOwned = (item) => {
        return getOwnerType(item) === "admin";
    };

    const getVendorName = (item) => {
        return (
            item?.vendor?.store_name ??
            item?.vendor?.name ??
            item?.product?.vendor?.store_name ??
            item?.product?.vendor?.name ??
            "N/A"
        );
    };

    const getVendorId = (item) => {
        return (
            item?.vendor_id ??
            item?.vendor?.id ??
            item?.product?.vendor_id ??
            null
        );
    };

    const getOwnerLabel = (item) => {
        return isAdminOwned(item)
            ? "Admin Owned"
            : "Vendor Owned";
    };

    const getOwnerColor = (item) => {
        return isAdminOwned(item)
            ? "info"
            : "success";
    };

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
            }}
        >
            <CardContent>
                {/* HEADER */}

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    gap={2}
                    mb={3}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Order #
                            {order.order_number ??
                                order.id}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            ID: {order.id}
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                    >
                        <OrderStatusChip
                            status={order.status}
                        />

                        <OrderPaymentChip
                            paymentStatus={
                                order.payment_status
                            }
                        />
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* CUSTOMER */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Customer Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                    mb={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Name
                        </Typography>

                        <Typography fontWeight={600}>
                            {order.user?.name || "-"}
                        </Typography>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Email
                        </Typography>

                        <Typography>
                            {order.user?.email || "-"}
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Shipping Address
                        </Typography>

                        <Typography>
                            {order.shipping_address || "-"}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* ORDER INFORMATION */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Order Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                    mb={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Payment Method
                        </Typography>

                        <Typography fontWeight={600}>
                            {order.payment_method ??
                                order.payment
                                    ?.payment_method ??
                                "-"}
                        </Typography>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            fontWeight="bold"
                            color="primary"
                        >
                            Rs. {getTotalAmount()}
                        </Typography>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Created At
                        </Typography>

                        <Typography>
                            {order.created_at
                                ? new Date(
                                      order.created_at
                                  ).toLocaleString()
                                : "-"}
                        </Typography>
                    </Grid>

                    {order.payment?.transaction_id && (
                        <Grid size={12}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Transaction ID
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                {
                                    order.payment
                                        .transaction_id
                                }
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* PRODUCTS */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Order Items
                </Typography>

                <List disablePadding>
                    {order.items?.length > 0 ? (
                        order.items.map((item) => {
                            const adminOwned =
                                isAdminOwned(item);

                            return (
                                <ListItem
                                    key={item.id}
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        borderBottom:
                                            "1px solid",
                                        borderColor:
                                            "divider",
                                        alignItems:
                                            "flex-start",
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Inventory2OutlinedIcon />
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                fontWeight={
                                                    600
                                                }
                                            >
                                                {item.product
                                                    ?.name ??
                                                    "Product"}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box mt={1}>
                                                <Typography
                                                    variant="body2"
                                                >
                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                >
                                                    Unit
                                                    Price:
                                                    {" "}
                                                    Rs.{" "}
                                                    {getItemPrice(
                                                        item
                                                    )}
                                                </Typography>

                                                {item.productVariant && (
                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        Variant:{" "}
                                                        {item
                                                            .productVariant
                                                            ?.name ??
                                                            item
                                                                .productVariant
                                                                ?.sku ??
                                                            "-"}
                                                    </Typography>
                                                )}

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    mt={1}
                                                >
                                                    <Chip
                                                        size="small"
                                                        icon={
                                                            <StorefrontIcon />
                                                        }
                                                        label={`Store: ${getVendorName(
                                                            item
                                                        )}`}
                                                        variant="outlined"
                                                    />

                                                    <Chip
                                                        size="small"
                                                        icon={
                                                            adminOwned ? (
                                                                <AdminPanelSettingsOutlinedIcon />
                                                            ) : (
                                                                <StorefrontIcon />
                                                            )
                                                        }
                                                        label={getOwnerLabel(
                                                            item
                                                        )}
                                                        color={getOwnerColor(
                                                            item
                                                        )}
                                                    />
                                                </Stack>

                                                {getVendorId(
                                                    item
                                                ) && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        display="block"
                                                        mt={0.5}
                                                    >
                                                        Vendor
                                                        Store
                                                        ID:{" "}
                                                        {getVendorId(
                                                            item
                                                        )}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />

                                    <Chip
                                        icon={
                                            <ShoppingBagIcon />
                                        }
                                        label={`Rs. ${getItemTotal(
                                            item
                                        )}`}
                                        color="primary"
                                        sx={{
                                            ml: 2,
                                            mt: 1,
                                            fontWeight: 600,
                                        }}
                                    />
                                </ListItem>
                            );
                        })
                    ) : (
                        <Typography color="text.secondary">
                            No items found.
                        </Typography>
                    )}
                </List>

                <Divider sx={{ mt: 3, mb: 2 }} />

                {/* MARKETPLACE EXPLANATION */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        mb={1}
                    >
                        Marketplace Ownership
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Vendor-owned products generate a
                        10% marketplace commission for the
                        admin and 90% earnings for the
                        vendor.
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                    >
                        Admin-owned products assigned to a
                        vendor store generate a 10% selling
                        fee for that vendor, while the
                        remaining 90% belongs to the admin.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderDetailsCard;


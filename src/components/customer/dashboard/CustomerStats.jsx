import {
    Box,
    Card,
    CardContent,
    Grid,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

// =====================================================
// Dashboard Statistics Configuration
// =====================================================

const statistics = [
    {
        key: "total_orders",
        title: "Total Orders",
        icon: ShoppingBagOutlinedIcon,
    },
    {
        key: "pending_orders",
        title: "Pending Orders",
        icon: HourglassEmptyOutlinedIcon,
    },
    {
        key: "processing_orders",
        title: "Processing Orders",
        icon: LocalShippingOutlinedIcon,
    },
    {
        key: "completed_orders",
        title: "Completed Orders",
        icon: CheckCircleOutlineIcon,
    },
    {
        key: "cancelled_orders",
        title: "Cancelled Orders",
        icon: CancelOutlinedIcon,
    },
    {
        key: "wishlist_items",
        title: "Wishlist Items",
        icon: FavoriteBorderOutlinedIcon,
    },
    {
        key: "cart_items",
        title: "Cart Items",
        icon: ShoppingCartOutlinedIcon,
    },
    {
        key: "addresses",
        title: "Addresses",
        icon: LocationOnOutlinedIcon,
    },
];

// =====================================================
// Loading Skeleton
// =====================================================

const StatsSkeleton = () => {
    return (
        <Grid container spacing={2}>

            {statistics.map((item) => (
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 3,
                    }}
                    key={item.key}
                >
                    <Card
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                        }}
                    >
                        <CardContent>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={52}
                                    height={52}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Skeleton
                                        width="75%"
                                        height={20}
                                    />

                                    <Skeleton
                                        width="45%"
                                        height={35}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

        </Grid>
    );
};

// =====================================================
// Customer Stats Component
// =====================================================

const CustomerStats = ({
    statistics: dashboardStatistics = {},
    loading = false,
}) => {

    // -------------------------------------------------
    // Loading
    // -------------------------------------------------

    if (loading) {
        return <StatsSkeleton />;
    }

    // -------------------------------------------------
    // Default Values
    // -------------------------------------------------

    const stats = {
        total_orders: 0,
        pending_orders: 0,
        processing_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        wishlist_items: 0,
        cart_items: 0,
        addresses: 0,

        ...dashboardStatistics,
    };

    // -------------------------------------------------
    // Render
    // -------------------------------------------------

    return (
        <Grid container spacing={2}>

            {statistics.map((item) => {

                const Icon = item.icon;

                const value = Number(
                    stats[item.key] ?? 0
                );

                return (
                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                        key={item.key}
                    >

                        <Card
                            elevation={0}
                            sx={{
                                height: "100%",

                                border: "1px solid",
                                borderColor: "divider",

                                borderRadius: 3,

                                backgroundColor: "#ffffff",

                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",

                                "&:hover": {
                                    transform:
                                        "translateY(-3px)",

                                    boxShadow: 4,
                                },
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: 2.5,
                                }}
                            >

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                >

                                    {/* =================================
                                        Icon
                                    ================================= */}

                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            minWidth: 52,

                                            display: "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            borderRadius: 2,

                                            backgroundColor:
                                                "primary.50",

                                            color:
                                                "primary.main",
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 28,
                                            }}
                                        />
                                    </Box>

                                    {/* =================================
                                        Text
                                    ================================= */}

                                    <Box
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                fontWeight: 500,
                                                mb: 0.5,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            component="div"
                                            fontWeight={700}
                                        >
                                            {value}
                                        </Typography>

                                    </Box>

                                </Stack>

                            </CardContent>

                        </Card>

                    </Grid>
                );
            })}

        </Grid>
    );
};

export default CustomerStats;
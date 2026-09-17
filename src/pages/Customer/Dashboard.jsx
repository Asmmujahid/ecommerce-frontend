
import { useEffect } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
    Button,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
    getCustomerDashboard,
} from "../../redux/customer/dashboardSlice";

import CustomerStats from "../../components/customer/dashboard/CustomerStats";
import RecentOrders from "../../components/customer/dashboard/RecentOrders";
import RecentNotifications from "../../components/customer/dashboard/RecentNotifications";

const Dashboard = () => {
    const dispatch = useDispatch();

    const dashboard = useSelector(
        (state) =>
            state.customerDashboard || {}
    );

    const {
        customer = null,
        statistics = {},
        recentOrders = [],
        recentNotifications = [],
        loading = false,
        error = null,
    } = dashboard;

    useEffect(() => {
        dispatch(
            getCustomerDashboard()
        );
    }, [dispatch]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading dashboard...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Container
                maxWidth="xl"
                sx={{ py: 3 }}
            >
                <Alert
                    severity="error"
                    action={
                        <Button
                            size="small"
                            startIcon={
                                <RefreshIcon />
                            }
                            onClick={() =>
                                dispatch(
                                    getCustomerDashboard()
                                )
                            }
                        >
                            Retry
                        </Button>
                    }
                >
                    {typeof error === "string"
                        ? error
                        : "Unable to load customer dashboard."}
                </Alert>
            </Container>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 2,
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        sm: "center",
                    }}
                    spacing={2}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                        >
                            Welcome back
                            {customer?.name
                                ? `, ${customer.name}`
                                : ""}
                            !
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            Here is an overview
                            of your account,
                            orders, wishlist,
                            cart and
                            notifications.
                        </Typography>
                    </Box>

                    {customer?.email && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {customer.email}
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Account Overview
                </Typography>

                <CustomerStats
                    statistics={
                        statistics || {}
                    }
                />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <Box sx={{ mb: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Recent Orders
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Latest 5 orders
                    </Typography>
                </Stack>

                <RecentOrders
                    orders={
                        recentOrders || []
                    }
                />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Box sx={{ mb: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Recent Notifications
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Latest 5
                        notifications
                    </Typography>
                </Stack>

                <RecentNotifications
                    notifications={
                        recentNotifications ||
                        []
                    }
                />
            </Box>
        </Container>
    );
};

export default Dashboard;


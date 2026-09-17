// src/pages/Admin/AdminDashboard.jsx

import { useEffect } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Alert,
    Box,
    Button,
    Container,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
    getDashboard,
} from "../../redux/admin/dashboardSlice";

import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import DashboardCards from "../../components/admin/dashboard/DashboardCards";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import RecentUsers from "../../components/admin/dashboard/RecentUsers";
import DashboardSkeleton from "../../components/admin/dashboard/DashboardSkeleton";

// =====================================================
// COMPONENT
// =====================================================

const AdminDashboard = () => {
    const dispatch = useDispatch();

    // =================================================
    // REDUX STATE
    // =================================================

    const dashboardState = useSelector(
        (state) => state.adminDashboard || {}
    );

    const {
        loading = false,
        statistics = {},
        monthlySales = [],
        monthlyRevenue = [],
        recentOrders = [],
        recentUsers = [],
        error = null,
    } = dashboardState;

    // =================================================
    // FETCH DASHBOARD DATA
    // =================================================

    useEffect(() => {
        dispatch(getDashboard());
    }, [dispatch]);

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minWidth: 0,
                }}
            >
                <DashboardSkeleton />
            </Box>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (error) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    py: 4,
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {typeof error === "string"
                        ? error
                        : "Unable to load admin dashboard."}
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={() =>
                        dispatch(getDashboard())
                    }
                >
                    Try Again
                </Button>
            </Container>
        );
    }

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                minHeight: "100%",

                backgroundColor: "#f5f5f5",

                py: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },

                boxSizing: "border-box",
                overflowX: "hidden",
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    width: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",
                }}
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,
                    }}
                >
                    <DashboardHeader />
                </Box>

                {/* =================================================
                    STATISTICS CARDS
                ================================================= */}

                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,
                        mt: 3,
                    }}
                >
                    <DashboardCards
                        statistics={statistics}
                    />
                </Box>

                {/* =================================================
                    SALES + REVENUE
                ================================================= */}

                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,

                        display: "grid",

                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "minmax(0, 1fr)",
                            lg: "minmax(0, 1fr)",
                            xl: "minmax(0, 1fr) minmax(0, 1fr)",
                        },

                        gap: 3,
                        mt: 3,

                        "& > *": {
                            minWidth: 0,
                            maxWidth: "100%",
                        },
                    }}
                >
                    <SalesChart
                        data={monthlySales}
                    />

                    <RevenueChart
                        data={monthlyRevenue}
                    />
                </Box>

                {/* =================================================
                    RECENT ORDERS + RECENT USERS
                ================================================= */}

                <Box
                    sx={{
                        width: "100%",
                        minWidth: 0,

                        display: "grid",

                        gridTemplateColumns: {
                            xs: "minmax(0, 1fr)",
                            sm: "minmax(0, 1fr)",
                            lg: "minmax(0, 1fr)",
                            xl: "minmax(0, 1fr) minmax(0, 1fr)",
                        },

                        gap: 3,
                        mt: 3,
                        pb: 4,

                        "& > *": {
                            minWidth: 0,
                            maxWidth: "100%",
                        },
                    }}
                >
                    <RecentOrders
                        orders={recentOrders}
                    />

                    <RecentUsers
                        users={recentUsers}
                    />
                </Box>
            </Container>
        </Box>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default AdminDashboard;
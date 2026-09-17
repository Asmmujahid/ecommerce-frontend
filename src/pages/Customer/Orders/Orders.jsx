// src/pages/Customer/Orders/Orders.jsx

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Refresh,
    ShoppingBagOutlined,
} from "@mui/icons-material";

import OrderCard from "../../../components/customer/orders/OrderCard";

import {
    fetchOrders,
    cancelOrder,
    deleteOrder,
    selectOrders,
    selectOrdersLoading,
    selectOrdersError,
    selectOrderDeleteLoading,
} from "../../../redux/customer/orderSlice";

// =====================================================
// COMPONENT
// =====================================================

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =================================================
    // REDUX
    // =================================================

    const orders = useSelector(selectOrders);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const deleteLoading = useSelector(
        selectOrderDeleteLoading
    );

    // =================================================
    // LOCAL STATE
    // =================================================

    const [cancellingOrderId, setCancellingOrderId] =
        useState(null);

    const [deletingOrderId, setDeletingOrderId] =
        useState(null);

    // =================================================
    // FETCH ORDERS
    // =================================================

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // =================================================
    // SAFE ORDERS
    // =================================================

    const safeOrders = useMemo(() => {
        return Array.isArray(orders) ? orders : [];
    }, [orders]);

    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = () => {
        dispatch(fetchOrders());
    };

    // =================================================
    // CONTINUE SHOPPING
    // =================================================

    const handleContinueShopping = () => {
        navigate("/products");
    };

    // =================================================
    // VIEW ORDER
    // =================================================

    const handleViewOrder = (order) => {
        if (!order?.id) {
            return;
        }

        navigate(`/customer/orders/${order.id}`);
    };

    // =================================================
    // CANCEL ORDER
    // =================================================

    const handleCancelOrder = async (order) => {
        if (!order?.id) {
            return;
        }

        const status = String(order.status ?? "")
            .trim()
            .toLowerCase();

        // Only pending orders can be cancelled
        if (status !== "pending") {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to cancel order ${
                order.order_number || `#${order.id}`
            }?`
        );

        if (!confirmed) {
            return;
        }

        setCancellingOrderId(order.id);

        try {
            await dispatch(
                cancelOrder(order.id)
            ).unwrap();

            // Refresh after cancellation
            await dispatch(
                fetchOrders()
            ).unwrap();
        } catch (cancelError) {
            console.error(
                "Cancel order error:",
                cancelError
            );

            let message =
                "Failed to cancel the order.";

            if (typeof cancelError === "string") {
                message = cancelError;
            } else if (cancelError?.message) {
                message = cancelError.message;
            } else if (cancelError?.error) {
                message = cancelError.error;
            }

            window.alert(message);
        } finally {
            setCancellingOrderId(null);
        }
    };

    // =================================================
    // DELETE ORDER FROM HISTORY
    // =================================================

    const handleDeleteOrder = async (order) => {
        if (!order?.id) {
            return;
        }

        const status = String(order.status ?? "")
            .trim()
            .toLowerCase();

        /*
         * Allow deleting cancelled orders.
         *
         * You can also allow delivered/completed if
         * you want those removed from order history.
         */
        const canDelete =
            status === "cancelled" ||
            status === "delivered" ||
            status === "completed";

        if (!canDelete) {
            window.alert(
                "Only cancelled, delivered, or completed orders can be deleted from history."
            );

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to permanently remove order ${
                order.order_number || `#${order.id}`
            } from your order history?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingOrderId(order.id);

        try {
            /*
             * unwrap() is important.
             *
             * If the DELETE API fails, it will go to catch().
             */
            await dispatch(
                deleteOrder(order.id)
            ).unwrap();

            /*
             * deleteOrder already removes the order
             * from Redux state.
             *
             * Fetch again to make sure the UI is
             * synchronized with the database.
             */
            await dispatch(
                fetchOrders()
            ).unwrap();
        } catch (deleteError) {
            console.error(
                "Delete order error:",
                deleteError
            );

            let message =
                "Failed to delete the order.";

            if (typeof deleteError === "string") {
                message = deleteError;
            } else if (deleteError?.message) {
                message = deleteError.message;
            } else if (deleteError?.error) {
                message = deleteError.error;
            }

            window.alert(message);
        } finally {
            setDeletingOrderId(null);
        }
    };

    // =================================================
    // ERROR MESSAGE
    // =================================================

    const getErrorMessage = () => {
        if (!error) {
            return "";
        }

        if (typeof error === "string") {
            return error;
        }

        if (error?.message) {
            return error.message;
        }

        if (error?.error) {
            return error.error;
        }

        return "Failed to load your orders. Please try again.";
    };

    // =================================================
    // LOADING
    // =================================================

    if (loading && safeOrders.length === 0) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >
                <Breadcrumbs sx={{ mb: 4 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/")}
                        sx={{
                            minWidth: 0,
                            p: 0,
                            textTransform: "none",
                        }}
                    >
                        Home
                    </Button>

                    <Typography color="text.primary">
                        Orders
                    </Typography>
                </Breadcrumbs>

                <Paper
                    elevation={0}
                    sx={{
                        minHeight: 350,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading your orders...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (
        !loading &&
        error &&
        safeOrders.length === 0
    ) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >
                <Breadcrumbs sx={{ mb: 4 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/")}
                        sx={{
                            minWidth: 0,
                            p: 0,
                            textTransform: "none",
                        }}
                    >
                        Home
                    </Button>

                    <Typography color="text.primary">
                        Orders
                    </Typography>
                </Breadcrumbs>

                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={handleRefresh}
                        >
                            Retry
                        </Button>
                    }
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    {getErrorMessage()}
                </Alert>
            </Container>
        );
    }

    // =================================================
    // EMPTY
    // =================================================

    if (
        !loading &&
        safeOrders.length === 0
    ) {
        return (
            <Container
                maxWidth="xl"
                sx={{
                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >
                <Breadcrumbs sx={{ mb: 4 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/")}
                        sx={{
                            minWidth: 0,
                            p: 0,
                            textTransform: "none",
                        }}
                    >
                        Home
                    </Button>

                    <Typography color="text.primary">
                        Orders
                    </Typography>
                </Breadcrumbs>

                <Paper
                    elevation={0}
                    sx={{
                        minHeight: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 4,
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing={2}
                    >
                        <ShoppingBagOutlined
                            sx={{
                                fontSize: 75,
                                color: "text.secondary",
                            }}
                        />

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            No orders yet
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                maxWidth: 500,
                            }}
                        >
                            You haven't placed any
                            orders yet. Start shopping
                            and your orders will appear
                            here.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={
                                <ShoppingBagOutlined />
                            }
                            onClick={
                                handleContinueShopping
                            }
                            sx={{
                                mt: 1,
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                            }}
                        >
                            Start Shopping
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    // =================================================
    // MAIN
    // =================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            {/* BREADCRUMBS */}

            <Breadcrumbs
                sx={{
                    mb: {
                        xs: 3,
                        md: 4,
                    },
                }}
            >
                <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate("/")}
                    sx={{
                        minWidth: 0,
                        p: 0,
                        textTransform: "none",
                        color: "text.secondary",
                    }}
                >
                    Home
                </Button>

                <Typography color="text.primary">
                    Orders
                </Typography>
            </Breadcrumbs>

            {/* HEADER */}

            <Box sx={{ mb: 4 }}>
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
                            sx={{
                                fontSize: {
                                    xs: "1.8rem",
                                    md: "2.2rem",
                                },
                            }}
                        >
                            My Orders
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            View and manage your
                            order history.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Refresh />
                            )
                        }
                        disabled={loading}
                        onClick={handleRefresh}
                        sx={{
                            borderRadius: 2,
                        }}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Box>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={handleRefresh}
                        >
                            Retry
                        </Button>
                    }
                >
                    {getErrorMessage()}
                </Alert>
            )}

            {/* COUNT */}

            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {safeOrders.length} order
                    {safeOrders.length !== 1
                        ? "s"
                        : ""}{" "}
                    found
                </Typography>
            </Box>

            {/* ORDER CARD */}

            <OrderCard
                orders={safeOrders}
                loading={loading}
                onView={handleViewOrder}
                onCancel={handleCancelOrder}
                cancellingOrderId={
                    cancellingOrderId
                }

                /*
                 * IMPORTANT:
                 * This was missing from your old code.
                 */
                onDelete={handleDeleteOrder}
                deletingOrderId={deletingOrderId}
                deleteLoading={deleteLoading}
            />

            {/* CONTINUE SHOPPING */}

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="text"
                    startIcon={<ArrowBack />}
                    onClick={
                        handleContinueShopping
                    }
                >
                    Continue Shopping
                </Button>
            </Box>
        </Container>
    );
};

export default Orders;


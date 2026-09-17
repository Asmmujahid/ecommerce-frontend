import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableRowsIcon from "@mui/icons-material/TableRows";

import {
    getOrders,
    deleteOrder,
} from "../../../redux/admin/orderSlice";

import OrderTable from "../../../components/admin/orders/OrderTable";
import OrderDetailsCard from "../../../components/admin/orders/OrderDetailsCard";
import OrderSearch from "../../../components/admin/orders/OrderSearch";
import OrderFilter from "../../../components/admin/orders/OrderFilter";
import OrderPagination from "../../../components/admin/orders/OrderPagination";
import DeleteOrderDialog from "../../../components/admin/orders/DeleteOrderDialog";
import OrderSkeleton from "../../../components/admin/orders/OrderSkeleton";

const Orders = () => {
    const dispatch = useDispatch();

    // ==========================================
    // Redux State
    // ==========================================

    const {
        orders = [],
        loading = false,
        error = null,
        pagination = {},
    } = useSelector(
        (state) => state.adminOrder || {}
    );

    // ==========================================
    // Local State
    // ==========================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");

    const [viewMode, setViewMode] = useState("table");

    const [page, setPage] = useState(1);

    const [refreshing, setRefreshing] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const rowsPerPage = 10;

    // ==========================================
    // Build Request Parameters
    // ==========================================

    const getRequestParams = useCallback(
        (customPage = page) => {
            return {
                search: search.trim(),
                status: statusFilter,
                payment_status: paymentFilter,
                page: customPage,
                per_page: rowsPerPage,
            };
        },
        [
            search,
            statusFilter,
            paymentFilter,
            page,
        ]
    );

    // ==========================================
    // Fetch Orders
    // ==========================================

    const loadOrders = useCallback(
        async (customPage = page) => {
            try {
                await dispatch(
                    getOrders(
                        getRequestParams(customPage)
                    )
                ).unwrap();
            } catch (err) {
                console.error(
                    "Failed to load admin orders:",
                    err
                );
            }
        },
        [
            dispatch,
            getRequestParams,
            page,
        ]
    );

    // ==========================================
    // Initial Load + Filter/Search Changes
    // ==========================================

    useEffect(() => {
        const timer = setTimeout(() => {
            loadOrders(page);
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [
        search,
        statusFilter,
        paymentFilter,
        page,
        loadOrders,
    ]);

    // ==========================================
    // Refresh When Admin Returns to This Tab
    // ==========================================

    useEffect(() => {
        const handleFocus = () => {
            loadOrders(page);
        };

        window.addEventListener(
            "focus",
            handleFocus
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleFocus
            );
        };
    }, [loadOrders, page]);

    // ==========================================
    // Search
    // ==========================================

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    // ==========================================
    // Status Filter
    // ==========================================

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    // ==========================================
    // Payment Filter
    // ==========================================

    const handlePaymentChange = (value) => {
        setPaymentFilter(value);
        setPage(1);
    };

    // ==========================================
    // View Mode
    // ==========================================

    const handleViewModeChange = (
        event,
        value
    ) => {
        if (value) {
            setViewMode(value);
        }
    };

    // ==========================================
    // Manual Refresh
    // ==========================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            await dispatch(
                getOrders(
                    getRequestParams(page)
                )
            ).unwrap();
        } catch (err) {
            console.error(
                "Failed to refresh orders:",
                err
            );
        } finally {
            setRefreshing(false);
        }
    };

    // ==========================================
    // Delete Dialog
    // ==========================================

    const handleDeleteClick = (order) => {
        setSelectedOrder(order);
        setDeleteDialogOpen(true);
    };

    // ==========================================
    // Close Delete Dialog
    // ==========================================

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
        setSelectedOrder(null);
    };

    // ==========================================
    // Confirm Delete
    // ==========================================

    const handleDeleteConfirm = async () => {
        if (!selectedOrder?.id) {
            return;
        }

        try {
            await dispatch(
                deleteOrder(
                    selectedOrder.id
                )
            ).unwrap();

            setDeleteDialogOpen(false);
            setSelectedOrder(null);

            /*
             * If the deleted order was the only item
             * on the current page and we are not on
             * the first page, move to previous page.
             */
            if (
                orders.length === 1 &&
                page > 1
            ) {
                setPage(
                    (currentPage) =>
                        currentPage - 1
                );

                return;
            }

            /*
             * Otherwise refresh the current page
             * from backend.
             */
            await loadOrders(page);
        } catch (err) {
            console.error(
                "Failed to delete order:",
                err
            );
        }
    };

    // ==========================================
    // Pagination
    // ==========================================

    const handlePageChange = (newPage) => {
        if (!newPage) {
            return;
        }

        setPage(newPage);
    };

    // ==========================================
    // Loading Skeleton
    // ==========================================

    if (
        loading &&
        orders.length === 0
    ) {
        return <OrderSkeleton />;
    }

    // ==========================================
    // Render
    // ==========================================

    return (
        <Box p={3}>

            {/* ======================================
                Header
            ====================================== */}

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
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Orders
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Manage all customer orders
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={
                        refreshing ? (
                            <CircularProgress
                                size={18}
                            />
                        ) : (
                            <RefreshIcon />
                        )
                    }
                    onClick={
                        handleRefresh
                    }
                    disabled={
                        refreshing ||
                        loading
                    }
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </Button>
            </Stack>

            {/* ======================================
                Error
            ====================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {typeof error ===
                    "string"
                        ? error
                        : "Failed to load orders."}
                </Alert>
            )}

            {/* ======================================
                Main Paper
            ====================================== */}

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                }}
            >

                {/* ==================================
                    Search
                ================================== */}

                <OrderSearch
                    search={search}
                    setSearch={
                        handleSearchChange
                    }
                />

                {/* ==================================
                    Filters
                ================================== */}

                <OrderFilter
                    status={
                        statusFilter
                    }
                    paymentStatus={
                        paymentFilter
                    }
                    onStatusChange={
                        handleStatusChange
                    }
                    onPaymentChange={
                        handlePaymentChange
                    }
                />

                {/* ==================================
                    View Mode
                ================================== */}

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    my={2}
                >
                    <ToggleButtonGroup
                        exclusive
                        value={viewMode}
                        onChange={
                            handleViewModeChange
                        }
                    >
                        <ToggleButton
                            value="table"
                        >
                            <TableRowsIcon />
                        </ToggleButton>

                        <ToggleButton
                            value="grid"
                        >
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* ==================================
                    Loading Indicator
                ================================== */}

                {loading &&
                    orders.length > 0 && (
                        <Alert
                            severity="info"
                            sx={{ mb: 2 }}
                        >
                            Updating orders...
                        </Alert>
                    )}

                {/* ==================================
                    Orders
                ================================== */}

                {orders.length === 0 &&
                !loading ? (
                    <Alert severity="info">
                        No orders found.
                    </Alert>
                ) : viewMode ===
                  "table" ? (
                    <OrderTable
                        orders={orders}
                        onDelete={
                            handleDeleteClick
                        }
                    />
                ) : (
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(auto-fill, minmax(330px, 1fr))"
                        gap={3}
                    >
                        {orders.map(
                            (order) => (
                                <OrderDetailsCard
                                    key={
                                        order.id
                                    }
                                    order={
                                        order
                                    }
                                    onDelete={
                                        handleDeleteClick
                                    }
                                />
                            )
                        )}
                    </Box>
                )}

                {/* ==================================
                    Pagination
                ================================== */}

                {pagination &&
                    pagination.lastPage >
                        1 && (
                        <Box mt={3}>
                            <OrderPagination
                                currentPage={
                                    pagination.currentPage ||
                                    page
                                }
                                totalPages={
                                    pagination.lastPage ||
                                    1
                                }
                                totalItems={
                                    pagination.total ||
                                    0
                                }
                                pageSize={
                                    pagination.perPage ||
                                    rowsPerPage
                                }
                                onPageChange={
                                    handlePageChange
                                }
                            />
                        </Box>
                    )}
            </Paper>

            {/* ======================================
                Delete Dialog
            ====================================== */}

            <DeleteOrderDialog
                open={
                    deleteDialogOpen
                }
                onClose={
                    handleDeleteClose
                }
                onConfirm={
                    handleDeleteConfirm
                }
                order={
                    selectedOrder
                }
            />
        </Box>
    );
};

export default Orders;

// src/pages/Seller/Orders/Orders.jsx

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchSellerOrders,
    updateSellerOrderStatus,
    setSellerOrderFilters,
    resetSellerOrderFilters,
    clearSellerOrderError,
} from "../../../redux/seller/sellerOrderSlice";

import OrderTable from "./OrderTable";

const statusOptions = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const paymentStatusOptions = [
    "all",
    "pending",
    "paid",
    "failed",
    "refunded",
];

const DEFAULT_FILTERS = {
    search: "",
    status: "all",
    payment_status: "all",
    page: 1,
    per_page: 10,
};

const Orders = () => {
    const dispatch = useDispatch();

    const sellerOrderState = useSelector(
        (state) => state.sellerOrders || {}
    );

    const {
        orders = [],
        loading = false,
        error = null,
        success = false,
        message = "",
        filters = DEFAULT_FILTERS,
        pagination = {
            currentPage: 1,
            lastPage: 1,
            total: 0,
            perPage: 10,
        },
    } = sellerOrderState;

    const [searchInput, setSearchInput] = useState(
        filters.search || ""
    );

    const [updatingOrderId, setUpdatingOrderId] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Build API parameters
    |--------------------------------------------------------------------------
    */

    const buildFetchParams = useCallback(
        (customParams = {}) => {
            const currentFilters = {
                ...DEFAULT_FILTERS,
                ...filters,
                ...customParams,
            };

            return {
                search: currentFilters.search || "",

                status:
                    currentFilters.status === "all"
                        ? ""
                        : currentFilters.status || "",

                payment_status:
                    currentFilters.payment_status === "all"
                        ? ""
                        : currentFilters.payment_status || "",

                page: currentFilters.page || 1,

                per_page:
                    currentFilters.per_page || 10,
            };
        },
        [filters]
    );

    /*
    |--------------------------------------------------------------------------
    | Fetch Orders
    |--------------------------------------------------------------------------
    */

    const loadOrders = useCallback(
        (customParams = {}) => {
            return dispatch(
                fetchSellerOrders(
                    buildFetchParams(customParams)
                )
            );
        },
        [dispatch, buildFetchParams]
    );

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    /*
    |--------------------------------------------------------------------------
    | Keep search input synchronized with Redux
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setSearchInput(filters.search || "");
    }, [filters.search]);

    /*
    |--------------------------------------------------------------------------
    | Refresh when user returns to the Orders page/window
    |--------------------------------------------------------------------------
    |
    | This is important for your Admin <-> Seller synchronization.
    |
    | Example:
    |
    | Seller changes:
    | pending -> shipped
    |
    | Backend:
    | orders.status = shipped
    |
    | Seller leaves/changes tab.
    |
    | When the page gets focus again, we fetch from Laravel.
    |
    */

    useEffect(() => {
        const handleWindowFocus = () => {
            loadOrders();
        };

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleWindowFocus
            );
        };
    }, [loadOrders]);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters.search || "";

            if (searchInput === currentSearch) {
                return;
            }

            dispatch(
                setSellerOrderFilters({
                    search: searchInput,
                    page: 1,
                })
            );

            loadOrders({
                search: searchInput,
                page: 1,
            });
        }, 400);

        return () => {
            clearTimeout(timer);
        };
    }, [
        searchInput,
        filters.search,
        dispatch,
        loadOrders,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    const handleStatusFilter = (status) => {
        dispatch(
            setSellerOrderFilters({
                status,
                page: 1,
            })
        );

        loadOrders({
            status,
            page: 1,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Payment Status Filter
    |--------------------------------------------------------------------------
    */

    const handlePaymentFilter = (paymentStatus) => {
        dispatch(
            setSellerOrderFilters({
                payment_status: paymentStatus,
                page: 1,
            })
        );

        loadOrders({
            payment_status: paymentStatus,
            page: 1,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const handlePageChange = (page) => {
        const currentPage =
            pagination.currentPage || 1;

        const lastPage =
            pagination.lastPage || 1;

        if (
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        dispatch(
            setSellerOrderFilters({
                page,
            })
        );

        loadOrders({
            page,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    const handleRefresh = () => {
        dispatch(clearSellerOrderError());

        loadOrders({
            page:
                pagination.currentPage ||
                filters.page ||
                1,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Filters
    |--------------------------------------------------------------------------
    */

    const handleResetFilters = () => {
        setSearchInput("");

        dispatch(resetSellerOrderFilters());

        dispatch(
            fetchSellerOrders({
                search: "",
                status: "",
                payment_status: "",
                page: 1,
                per_page: 10,
            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Update Order Status
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The backend OrderService is the source of truth.
    |
    | We first update the order through Laravel.
    | Then we fetch the Seller order list again.
    |
    | This guarantees the table displays the actual database value.
    |
    */

    const handleStatusChange = async (
        id,
        status
    ) => {
        if (!id || !status) {
            return;
        }

        try {
            setUpdatingOrderId(id);

            dispatch(clearSellerOrderError());

            await dispatch(
                updateSellerOrderStatus({
                    id,
                    status,
                })
            ).unwrap();

            /*
             * Fetch fresh data from backend.
             *
             * This is intentionally done after the successful
             * status update so the frontend does not rely only
             * on its local Redux copy.
             */
            await loadOrders({
                page:
                    pagination.currentPage ||
                    filters.page ||
                    1,
            });
        } catch (error) {
            /*
             * Redux already stores the error.
             * We do not calculate anything here.
             */
            console.error(
                "Failed to update order status:",
                error
            );
        } finally {
            setUpdatingOrderId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Page Numbers
    |--------------------------------------------------------------------------
    */

    const renderPageNumbers = () => {
        const currentPage =
            pagination.currentPage || 1;

        const lastPage =
            pagination.lastPage || 1;

        if (lastPage <= 1) {
            return null;
        }

        const pages = [];

        for (
            let page = 1;
            page <= lastPage;
            page++
        ) {
            if (
                page === 1 ||
                page === lastPage ||
                Math.abs(page - currentPage) <= 2
            ) {
                pages.push(page);
            }
        }

        const result = [];

        let previous = null;

        pages.forEach((page) => {
            if (
                previous !== null &&
                page - previous > 1
            ) {
                result.push(
                    <span
                        key={`dots-${page}`}
                        className="px-2 text-gray-500"
                    >
                        ...
                    </span>
                );
            }

            result.push(
                <button
                    key={page}
                    type="button"
                    onClick={() =>
                        handlePageChange(page)
                    }
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg border ${
                        page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-100"
                    } disabled:opacity-50`}
                >
                    {page}
                </button>
            );

            previous = page;
        });

        return result;
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="p-6 space-y-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        Seller Orders
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and manage orders containing
                        products sold through your store.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={
                        loading ||
                        updatingOrderId !== null
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                >
                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>

            {/* Success */}

            {success && message && (
                <div className="bg-green-100 text-green-700 border border-green-200 rounded-lg p-4">
                    {message}
                </div>
            )}

            {/* Error */}

            {error && (
                <div className="bg-red-100 text-red-700 border border-red-200 rounded-lg p-4 flex justify-between items-center gap-4">

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                clearSellerOrderError()
                            )
                        }
                        className="font-semibold text-xl"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* Filters */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Search */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Search
                        </label>

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(
                                    e.target.value
                                )
                            }
                            placeholder="Order number, customer name or email"
                            className="w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Order Status */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Order Status
                        </label>

                        <select
                            value={
                                filters.status ||
                                "all"
                            }
                            onChange={(e) =>
                                handleStatusFilter(
                                    e.target.value
                                )
                            }
                            disabled={
                                loading ||
                                updatingOrderId !== null
                            }
                            className="w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {statusOptions.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status ===
                                        "all"
                                            ? "All Status"
                                            : status
                                                  .charAt(
                                                      0
                                                  )
                                                  .toUpperCase() +
                                              status.slice(
                                                  1
                                              )}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Payment Status */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Payment Status
                        </label>

                        <select
                            value={
                                filters.payment_status ||
                                "all"
                            }
                            onChange={(e) =>
                                handlePaymentFilter(
                                    e.target.value
                                )
                            }
                            disabled={
                                loading ||
                                updatingOrderId !== null
                            }
                            className="w-full border rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {paymentStatusOptions.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status ===
                                        "all"
                                            ? "All Payment Status"
                                            : status
                                                  .charAt(
                                                      0
                                                  )
                                                  .toUpperCase() +
                                              status.slice(
                                                  1
                                              )}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                </div>

                <div className="flex justify-end mt-4">

                    <button
                        type="button"
                        onClick={
                            handleResetFilters
                        }
                        disabled={
                            loading ||
                            updatingOrderId !== null
                        }
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                        Reset Filters
                    </button>

                </div>

            </div>

            {/* Loading */}

            {loading && (
                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="text-lg font-semibold">
                        Loading Orders...
                    </div>

                </div>
            )}

            {/* Empty */}

            {!loading &&
                !error &&
                orders.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            No Orders Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            No orders match the selected
                            filters.
                        </p>

                    </div>
                )}

            {/* Table */}

            {!loading &&
                orders.length > 0 && (
                    <OrderTable
                        orders={orders}
                        onStatusChange={
                            handleStatusChange
                        }
                        loading={loading}
                        updatingOrderId={
                            updatingOrderId
                        }
                    />
                )}

            {/* Pagination */}

            {!loading &&
                orders.length > 0 &&
                pagination.lastPage > 1 && (
                    <div className="bg-white rounded-xl shadow p-4 flex flex-wrap items-center justify-between gap-4">

                        <p className="text-sm text-gray-600">
                            Showing page{" "}
                            <strong>
                                {pagination.currentPage}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {pagination.lastPage}
                            </strong>{" "}
                            — Total{" "}
                            <strong>
                                {pagination.total}
                            </strong>{" "}
                            orders
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    pagination.currentPage <=
                                        1 ||
                                    loading ||
                                    updatingOrderId !==
                                        null
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage -
                                            1
                                    )
                                }
                                className="px-3 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
                            >
                                Previous
                            </button>

                            {renderPageNumbers()}

                            <button
                                type="button"
                                disabled={
                                    pagination.currentPage >=
                                        pagination.lastPage ||
                                    loading ||
                                    updatingOrderId !==
                                        null
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage +
                                            1
                                    )
                                }
                                className="px-3 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
                            >
                                Next
                            </button>

                        </div>

                    </div>
                )}

        </div>
    );
};

export default Orders;


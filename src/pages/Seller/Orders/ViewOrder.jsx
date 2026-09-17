// src/pages/Seller/Orders/ViewOrder.jsx

import {
    useCallback,
    useEffect,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchSellerOrder,
    clearSellerOrder,
    clearSellerOrderError,
} from "../../../redux/seller/sellerOrderSlice";

// ======================================================
// Status Colors
// ======================================================

const statusColors = {
    pending:
        "bg-yellow-100 text-yellow-700",

    processing:
        "bg-blue-100 text-blue-700",

    shipped:
        "bg-purple-100 text-purple-700",

    delivered:
        "bg-green-100 text-green-700",

    cancelled:
        "bg-red-100 text-red-700",
};

// ======================================================
// Payment Colors
// ======================================================

const paymentColors = {
    pending:
        "bg-yellow-100 text-yellow-700",

    paid:
        "bg-green-100 text-green-700",

    failed:
        "bg-red-100 text-red-700",

    refunded:
        "bg-gray-100 text-gray-700",
};

// ======================================================
// Format Status
// ======================================================

const formatStatus = (status) => {
    if (!status) {
        return "-";
    }

    return String(status)
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );
};

// ======================================================
// Format Currency
// ======================================================

const formatCurrency = (amount) => {
    const number = Number(amount);

    return `Rs.${(
        Number.isFinite(number)
            ? number
            : 0
    ).toLocaleString("en-PK")}`;
};

// ======================================================
// Format Date
// ======================================================

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return "-";
    }

    return parsedDate.toLocaleString(
        "en-PK",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );
};

// ======================================================
// Payment Method
// ======================================================

const getPaymentMethod = (order) => {
    return (
        order?.payment_method ??
        order?.payment?.payment_method ??
        "-"
    );
};

// ======================================================
// Payment Status
// ======================================================

const getPaymentStatus = (order) => {
    return (
        order?.payment_status ??
        order?.payment?.status ??
        "pending"
    );
};

// ======================================================
// Shipping Address
// ======================================================

const getShippingAddress = (order) => {
    const address =
        order?.shipping_address;

    if (!address) {
        return null;
    }

    // String address

    if (
        typeof address === "string"
    ) {
        return address;
    }

    // Object address

    if (
        typeof address === "object"
    ) {
        return address;
    }

    return null;
};

// ======================================================
// View Order Component
// ======================================================

const ViewOrder = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    // ==================================================
    // Redux
    // ==================================================

    const {
        order = null,

        orderLoading = false,

        error = null,
    } = useSelector(
        (state) =>
            state.sellerOrders || {}
    );

    // ==================================================
    // Load Order
    // ==================================================

    const loadOrder = useCallback(
        async () => {
            if (!id) {
                return;
            }

            try {
                dispatch(
                    clearSellerOrderError()
                );

                await dispatch(
                    fetchSellerOrder(id)
                ).unwrap();
            } catch (error) {
                console.error(
                    "Failed to load seller order:",
                    error
                );
            }
        },
        [dispatch, id]
    );

    // ==================================================
    // Initial Load
    // ==================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        loadOrder();

        return () => {
            dispatch(
                clearSellerOrder()
            );
        };
    }, [
        dispatch,
        id,
        loadOrder,
    ]);

    // ==================================================
    // Refresh When Window Gets Focus
    // ==================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        const handleWindowFocus = () => {
            /*
             * Only refresh when the page
             * is visible again.
             */
            if (
                document.visibilityState ===
                "visible"
            ) {
                loadOrder();
            }
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
    }, [
        id,
        loadOrder,
    ]);

    // ==================================================
    // Loading
    // ==================================================

    if (
        orderLoading &&
        !order
    ) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

                    <p className="text-lg font-semibold mt-4">
                        Loading Order...
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        Please wait.
                    </p>

                </div>

            </div>
        );
    }

    // ==================================================
    // Error
    // ==================================================

    if (
        error &&
        !order
    ) {
        return (
            <div className="max-w-2xl mx-auto mt-20 px-4">

                <div className="bg-red-100 border border-red-200 text-red-700 rounded-xl p-6 text-center">

                    <h2 className="text-2xl font-bold">
                        Unable to Load Order
                    </h2>

                    <p className="mt-2 break-words">
                        {error}
                    </p>

                    <div className="flex justify-center flex-wrap gap-3 mt-5">

                        <button
                            type="button"
                            onClick={
                                loadOrder
                            }
                            disabled={
                                orderLoading
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            {orderLoading
                                ? "Loading..."
                                : "Try Again"}
                        </button>

                        <Link
                            to="/seller/orders"
                            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
                        >
                            Back to Orders
                        </Link>

                    </div>

                </div>

            </div>
        );
    }

    // ==================================================
    // Order Not Found
    // ==================================================

    if (!order) {
        return (
            <div className="text-center mt-20 px-4">

                <h2 className="text-2xl font-bold">
                    Order Not Found
                </h2>

                <p className="text-gray-500 mt-2">
                    This order may not exist
                    or may not belong to
                    your store.
                </p>

                <div className="flex justify-center gap-3 mt-5">

                    <button
                        type="button"
                        onClick={
                            loadOrder
                        }
                        disabled={
                            orderLoading
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {orderLoading
                            ? "Loading..."
                            : "Try Again"}
                    </button>

                    <Link
                        to="/seller/orders"
                        className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Orders
                    </Link>

                </div>

            </div>
        );
    }

    // ==================================================
    // Seller Order Items
    // ==================================================

    const items = Array.isArray(
        order.items
    )
        ? order.items
        : [];

    // ==================================================
    // Calculate Seller Subtotal
    // ==================================================

    const subtotal = items.reduce(
        (sum, item) => {
            const itemTotal =
                item.total ??
                Number(
                    item.price || 0
                ) *
                    Number(
                        item.quantity ||
                            0
                    );

            return (
                sum +
                Number(
                    itemTotal || 0
                )
            );
        },
        0
    );

    // ==================================================
    // Order Values
    // ==================================================

    /*
     * IMPORTANT:
     *
     * order.total_amount can be the complete
     * customer order total.
     *
     * For seller view, the seller's own
     * subtotal is more accurate.
     */

    const totalAmount =
        items.length > 0
            ? subtotal
            : Number(
                  order.total_amount ??
                      order.total ??
                      0
              );

    const paymentMethod =
        getPaymentMethod(order);

    const paymentStatus =
        getPaymentStatus(order);

    const shippingAddress =
        getShippingAddress(order);

    const orderStatus =
        order.status || "pending";

    // ==================================================
    // Render
    // ==================================================

    return (
        <div className="p-6 space-y-6">

            {/* ======================================
                Header
            ====================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold">
                        Order Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Order #
                        {order.order_number ||
                            order.id}
                    </p>

                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        type="button"
                        onClick={
                            loadOrder
                        }
                        disabled={
                            orderLoading
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                        {orderLoading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <Link
                        to="/seller/orders"
                        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-center"
                    >
                        Back to Orders
                    </Link>

                </div>

            </div>

            {/* ======================================
                Refreshing Indicator
            ====================================== */}

            {orderLoading &&
                order && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3">
                        Refreshing order information...
                    </div>
                )}

            {/* ======================================
                Error
            ====================================== */}

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 rounded-lg p-4 flex justify-between gap-4">

                    <span className="break-words">
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                clearSellerOrderError()
                            )
                        }
                        className="font-semibold text-xl flex-shrink-0"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* ======================================
                Order Status Banner
            ====================================== */}

            <div className="bg-white rounded-xl shadow p-5">

                <div className="flex flex-wrap items-center gap-6">

                    {/* Order Status */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Order Status
                        </p>

                        <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                statusColors[
                                    orderStatus
                                ] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {formatStatus(
                                orderStatus
                            )}
                        </span>

                    </div>

                    {/* Payment Status */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Payment Status
                        </p>

                        <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                paymentColors[
                                    paymentStatus
                                ] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {formatStatus(
                                paymentStatus
                            )}
                        </span>

                    </div>

                    {/* Order Date */}

                    <div>

                        <p className="text-sm text-gray-500">
                            Order Date
                        </p>

                        <p className="font-semibold mt-1">
                            {formatDate(
                                order.created_at
                            )}
                        </p>

                    </div>

                </div>

            </div>

            {/* ======================================
                Customer + Shipping
            ====================================== */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Customer */}

                <div className="bg-white shadow rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Customer Information
                    </h2>

                    <div className="space-y-3">

                        <div>

                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p className="font-medium">
                                {order.user
                                    ?.name ||
                                    "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-medium">
                                {order.user
                                    ?.email ||
                                    "-"}
                            </p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Phone
                            </p>

                            <p className="font-medium">
                                {order.user
                                    ?.phone ||
                                    "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Shipping */}

                <div className="bg-white shadow rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Shipping Address
                    </h2>

                    {typeof shippingAddress ===
                    "string" ? (
                        <p className="text-gray-700 whitespace-pre-line">
                            {
                                shippingAddress
                            }
                        </p>
                    ) : shippingAddress &&
                      typeof shippingAddress ===
                          "object" ? (
                        <div className="space-y-1 text-gray-700">

                            {shippingAddress.address && (
                                <p>
                                    {
                                        shippingAddress.address
                                    }
                                </p>
                            )}

                            {shippingAddress.city && (
                                <p>
                                    {
                                        shippingAddress.city
                                    }
                                </p>
                            )}

                            {shippingAddress.state && (
                                <p>
                                    {
                                        shippingAddress.state
                                    }
                                </p>
                            )}

                            {shippingAddress.postal_code && (
                                <p>
                                    {
                                        shippingAddress.postal_code
                                    }
                                </p>
                            )}

                            {shippingAddress.phone && (
                                <p>
                                    {
                                        shippingAddress.phone
                                    }
                                </p>
                            )}

                        </div>
                    ) : order.shippingAddress ? (
                        <div className="space-y-1 text-gray-700">

                            {order
                                .shippingAddress
                                .address && (
                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            .address
                                    }
                                </p>
                            )}

                            {order
                                .shippingAddress
                                .city && (
                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            .city
                                    }
                                </p>
                            )}

                            {order
                                .shippingAddress
                                .phone && (
                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            .phone
                                    }
                                </p>
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Shipping address not
                            available.
                        </p>
                    )}

                </div>

            </div>

            {/* ======================================
                Payment
            ====================================== */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Payment Details
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div>

                        <p className="text-sm text-gray-500">
                            Payment Method
                        </p>

                        <p className="font-semibold capitalize mt-1">
                            {paymentMethod}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Payment Status
                        </p>

                        <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentColors[
                                    paymentStatus
                                ] ||
                                "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {formatStatus(
                                paymentStatus
                            )}
                        </span>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Transaction ID
                        </p>

                        <p className="font-semibold mt-1 break-all">
                            {order
                                .payment
                                ?.transaction_id ||
                                "-"}
                        </p>

                    </div>

                </div>

            </div>

            {/* ======================================
                Order Items
            ====================================== */}

            <div className="bg-white shadow rounded-xl overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-semibold">
                        Your Store's Order Items
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Only items belonging to your
                        selling store are displayed here.
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-[900px] w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Product
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Vendor Store
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Ownership
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Variant
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Qty
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Price
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map(
                                (item) => {
                                    const ownerType =
                                        item.product_owner_type ||
                                        item.product
                                            ?.owner_type ||
                                        "vendor";

                                    const variant =
                                        item.product_variant ||
                                        item.productVariant;

                                    const itemTotal =
                                        item.total ??
                                        Number(
                                            item.price ||
                                                0
                                        ) *
                                            Number(
                                                item.quantity ||
                                                    0
                                            );

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="border-b hover:bg-gray-50"
                                        >

                                            {/* Product */}

                                            <td className="px-4 py-4">

                                                <div className="font-semibold">
                                                    {item
                                                        .product
                                                        ?.name ||
                                                        "Product"}
                                                </div>

                                                {item
                                                    .product
                                                    ?.sku && (
                                                    <div className="text-sm text-gray-500">
                                                        SKU:{" "}
                                                        {
                                                            item
                                                                .product
                                                                .sku
                                                        }
                                                    </div>
                                                )}

                                            </td>

                                            {/* Vendor */}

                                            <td className="px-4 py-4">

                                                {item
                                                    .vendor
                                                    ?.store_name ||
                                                    item
                                                        .vendor
                                                        ?.name ||
                                                    "-"}

                                            </td>

                                            {/* Ownership */}

                                            <td className="px-4 py-4">

                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                        ownerType ===
                                                        "admin"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >
                                                    {ownerType ===
                                                    "admin"
                                                        ? "Admin Owned"
                                                        : "Vendor Owned"}
                                                </span>

                                            </td>

                                            {/* Variant */}

                                            <td className="px-4 py-4">

                                                {variant
                                                    ?.name ||
                                                    variant
                                                        ?.value ||
                                                    variant
                                                        ?.sku ||
                                                    "-"}

                                            </td>

                                            {/* Quantity */}

                                            <td className="px-4 py-4 text-center">
                                                {item.quantity ||
                                                    0}
                                            </td>

                                            {/* Price */}

                                            <td className="px-4 py-4 text-right whitespace-nowrap">
                                                {formatCurrency(
                                                    item.price
                                                )}
                                            </td>

                                            {/* Total */}

                                            <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">
                                                {formatCurrency(
                                                    itemTotal
                                                )}
                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                            {items.length ===
                                0 && (
                                <tr>

                                    <td
                                        colSpan={7}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No items found
                                        for your
                                        store.
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ======================================
                Summary
            ====================================== */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Order Summary
                </h2>

                <div className="max-w-md ml-auto space-y-3">

                    <div className="flex justify-between gap-4">

                        <span className="text-gray-600">
                            Your Store Subtotal
                        </span>

                        <span className="font-medium">
                            {formatCurrency(
                                subtotal
                            )}
                        </span>

                    </div>

                    <div className="flex justify-between gap-4">

                        <span className="text-gray-600">
                            Shipping
                        </span>

                        <span>
                            Rs.0
                        </span>

                    </div>

                    <hr />

                    <div className="flex justify-between gap-4 text-lg font-bold">

                        <span>
                            Your Store Total
                        </span>

                        <span>
                            {formatCurrency(
                                totalAmount
                            )}
                        </span>

                    </div>

                </div>

                <div className="mt-5 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                    Marketplace commission and vendor
                    selling fees are calculated by the
                    backend. The seller dashboard does
                    not calculate or modify these amounts.
                </div>

            </div>

        </div>
    );
};

export default ViewOrder;

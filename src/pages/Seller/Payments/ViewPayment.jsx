// src/pages/Seller/Payments/ViewPayment.jsx

import { useEffect } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    clearPayment,
    getPayment,
    selectSellerPayment,
    selectSellerPaymentError,
    selectSellerPaymentLoadingSingle,
} from "../../../redux/seller/sellerPaymentSlice";

const ViewPayment = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const payment = useSelector(
        selectSellerPayment
    );

    const loading = useSelector(
        selectSellerPaymentLoadingSingle
    );

    const error = useSelector(
        selectSellerPaymentError
    );

    useEffect(() => {
        if (id) {
            dispatch(getPayment(id));
        }

        return () => {
            dispatch(clearPayment());
        };
    }, [dispatch, id]);

    // =========================================================
    // HELPERS
    // =========================================================

    const formatCurrency = (amount) => {
        const value = Number(amount);

        return `Rs. ${(Number.isFinite(value) ? value : 0).toLocaleString(
            "en-PK",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-PK",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const formatStatus = (status) => {
        if (!status) {
            return "-";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const getPaymentStatusBadge = (status) => {
        const normalizedStatus = String(
            status || ""
        ).toLowerCase();

        const classes = {
            paid: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            failed: "bg-red-100 text-red-700",
            refunded: "bg-blue-100 text-blue-700",
        };

        return (
            <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    classes[normalizedStatus] ||
                    "bg-gray-100 text-gray-700"
                }`}
            >
                {formatStatus(status)}
            </span>
        );
    };

    const getEarningStatusBadge = (status) => {
        const normalizedStatus = String(
            status || ""
        ).toLowerCase();

        const classes = {
            paid: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            reversed: "bg-red-100 text-red-700",
        };

        return (
            <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    classes[normalizedStatus] ||
                    "bg-gray-100 text-gray-700"
                }`}
            >
                {formatStatus(status)}
            </span>
        );
    };

    const getOwnerType = (item) => {
        const ownerType =
            item?.product_owner_type ||
            item?.product?.owner_type ||
            "vendor";

        return ownerType === "admin"
            ? "admin"
            : "vendor";
    };

    const getEarning = (item) => {
        return (
            item?.vendor_earning ||
            item?.vendorEarning ||
            null
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-white rounded-xl shadow border p-6 md:p-8 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({
                            length: 10,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="space-y-2"
                            >
                                <div className="h-4 bg-gray-200 rounded w-1/3" />

                                <div className="h-6 bg-gray-200 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-5">
                    <h2 className="font-semibold text-lg">
                        Unable to Load Payment
                    </h2>

                    <p className="mt-1">
                        {error}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/seller/payments")
                    }
                    className="mt-4 bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // =========================================================
    // PAYMENT NOT FOUND
    // =========================================================

    if (!payment) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-white rounded-xl shadow border p-10 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Payment Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The requested payment could not be
                        found.
                    </p>

                    <Link
                        to="/seller/payments"
                        className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
                    >
                        Back to Payments
                    </Link>
                </div>
            </div>
        );
    }

    // =========================================================
    // ORDER
    // =========================================================

    const order = payment.order || {};

    const orderItems = Array.isArray(order.items)
        ? order.items
        : [];

    /*
     * IMPORTANT:
     *
     * Backend seller payment endpoint should already return
     * only items belonging to the authenticated seller.
     *
     * We do not perform vendor filtering here because the
     * backend is authoritative.
     */
    const sellerItems = orderItems;

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Payment Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View customer payment and your seller
                        earning information.
                    </p>
                </div>

                <Link
                    to="/seller/payments"
                    className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition"
                >
                    Back to Payments
                </Link>
            </div>

            {/* =================================================
                PAYMENT INFORMATION
            ================================================= */}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Payment Information
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">
                            Payment ID
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            #{payment.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Order Number
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {order.order_number ||
                                `#${payment.order_id || "-"}`}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer Name
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {payment.user?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer Email
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 break-all">
                            {payment.user?.email || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Transaction ID
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 break-all">
                            {payment.transaction_id || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Payment Method
                        </p>

                        <p className="font-semibold text-gray-800 mt-1 capitalize">
                            {payment.payment_method
                                ? String(
                                      payment.payment_method
                                  ).replaceAll(
                                      "_",
                                      " "
                                  )
                                : "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer Paid
                        </p>

                        <p className="font-bold text-xl text-blue-600 mt-1">
                            {formatCurrency(
                                payment.amount
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Payment Status
                        </p>

                        <div className="mt-2">
                            {getPaymentStatusBadge(
                                payment.status
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Paid At
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {formatDate(
                                payment.paid_at
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Created At
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {formatDate(
                                payment.created_at
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                SELLER ORDER ITEMS
            ================================================= */}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Your Products in This Order
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        These are the products associated with
                        your seller store.
                    </p>
                </div>

                <div className="p-6">
                    {sellerItems.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-5 text-center text-gray-500">
                            No seller product was found in this
                            payment.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Ownership
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Quantity
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Price
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Item Total
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                            Earning Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {sellerItems.map(
                                        (item) => {
                                            const ownerType =
                                                getOwnerType(
                                                    item
                                                );

                                            const earning =
                                                getEarning(
                                                    item
                                                );

                                            const isAdminOwned =
                                                ownerType ===
                                                "admin";

                                            return (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="font-medium text-gray-800">
                                                            {item
                                                                .product
                                                                ?.name ||
                                                                "Product"}
                                                        </div>

                                                        {item
                                                            .product
                                                            ?.sku && (
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                SKU:{" "}
                                                                {
                                                                    item
                                                                        .product
                                                                        .sku
                                                                }
                                                            </div>
                                                        )}

                                                        {item
                                                            .product_variant
                                                            ?.name && (
                                                            <div className="text-sm text-gray-500 mt-1">
                                                                Variant:{" "}
                                                                {
                                                                    item
                                                                        .product_variant
                                                                        .name
                                                                }
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                                isAdminOwned
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-purple-100 text-purple-700"
                                                            }`}
                                                        >
                                                            {isAdminOwned
                                                                ? "Admin Owned"
                                                                : "Vendor Owned"}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-gray-700">
                                                        {item.quantity ||
                                                            0}
                                                    </td>

                                                    <td className="px-4 py-4 text-gray-700">
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 font-semibold text-gray-800">
                                                        {formatCurrency(
                                                            item.total
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {earning ? (
                                                            getEarningStatusBadge(
                                                                earning.status
                                                            )
                                                        ) : (
                                                            <span className="text-sm text-gray-500">
                                                                No earning
                                                                record
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* =================================================
                SELLER EARNINGS
            ================================================= */}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Seller Earnings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Earning values below come directly from
                        the backend VendorEarning records.
                    </p>
                </div>

                <div className="p-6">
                    {sellerItems.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-5 text-center text-gray-500">
                            No earning information is available.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {sellerItems.map((item) => {
                                const earning =
                                    getEarning(item);

                                if (!earning) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                                        >
                                            <p className="font-medium text-gray-800">
                                                {item
                                                    .product
                                                    ?.name ||
                                                    "Product"}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Earning information
                                                is not available
                                                yet.
                                            </p>
                                        </div>
                                    );
                                }

                                const ownerType =
                                    getOwnerType(item);

                                const isAdminOwned =
                                    ownerType ===
                                    "admin";

                                return (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="border border-gray-200 rounded-xl p-5"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {item
                                                        .product
                                                        ?.name ||
                                                        "Product"}
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    Order Item #
                                                    {item.id}
                                                </p>
                                            </div>

                                            <div>
                                                {getEarningStatusBadge(
                                                    earning.status
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500">
                                                    Gross Sale
                                                </p>

                                                <p className="font-bold text-blue-700 mt-1">
                                                    {formatCurrency(
                                                        earning.gross_amount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="bg-orange-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500">
                                                    {isAdminOwned
                                                        ? "Vendor Selling Fee"
                                                        : "Admin Commission"}
                                                </p>

                                                <p className="font-bold text-orange-700 mt-1">
                                                    {formatCurrency(
                                                        earning.commission_amount
                                                    )}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    Rate:{" "}
                                                    {Number(
                                                        earning.commission_rate ||
                                                            0
                                                    ).toFixed(
                                                        2
                                                    )}
                                                    %
                                                </p>
                                            </div>

                                            <div className="bg-green-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500">
                                                    Your Net Earning
                                                </p>

                                                <p className="font-bold text-green-700 mt-1">
                                                    {formatCurrency(
                                                        earning.net_amount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500">
                                                    Earning Status
                                                </p>

                                                <div className="mt-2">
                                                    {getEarningStatusBadge(
                                                        earning.status
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Product Ownership
                                                </p>

                                                <p className="font-semibold text-gray-800 mt-1">
                                                    {isAdminOwned
                                                        ? "Admin Owned"
                                                        : "Vendor Owned"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Earning Paid At
                                                </p>

                                                <p className="font-semibold text-gray-800 mt-1">
                                                    {formatDate(
                                                        earning.paid_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* =================================================
                BUSINESS RULE INFORMATION
            ================================================= */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-800">
                    How your seller earnings work
                </h3>

                <div className="mt-3 space-y-2 text-sm text-blue-700">
                    <p>
                        <strong>
                            Vendor-owned product:
                        </strong>{" "}
                        the vendor owns the product. The backend
                        records the marketplace commission and
                        your remaining net earning.
                    </p>

                    <p>
                        <strong>
                            Admin-owned product:
                        </strong>{" "}
                        the admin owns the product, while your
                        store is the selling channel. The backend
                        records your selling fee and your net
                        earning.
                    </p>

                    <p>
                        Customer payment status and seller earning
                        status are separate. The seller panel is
                        read-only for payment records.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewPayment;


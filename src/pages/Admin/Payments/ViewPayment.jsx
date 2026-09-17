
// ============================================================
// FILE:
// src/pages/Admin/Payments/ViewPayment.jsx
// ============================================================

import { useEffect } from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getPayment,
    clearCurrentPayment,
    clearPaymentError,
} from "../../../redux/admin/paymentSlice";

const ViewPayment = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        payment = null,
        paymentLoading = false,
        error = null,
    } = useSelector(
        (state) =>
            state.adminPayment || {}
    );

    const formatCurrency = (
        amount
    ) => {
        const value = Number(amount);

        return new Intl.NumberFormat(
            "en-PK",
            {
                style: "currency",
                currency: "PKR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        ).format(
            Number.isFinite(value)
                ? value
                : 0
        );
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString(
            "en-PK",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const formatStatus = (
        status
    ) => {
        if (!status) {
            return "-";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    const getStatusClass = (
        status
    ) => {
        const classes = {
            paid:
                "bg-green-100 text-green-700",

            pending:
                "bg-yellow-100 text-yellow-700",

            failed:
                "bg-red-100 text-red-700",

            refunded:
                "bg-blue-100 text-blue-700",
        };

        return (
            classes[
                String(
                    status || ""
                ).toLowerCase()
            ] ||
            "bg-gray-100 text-gray-700"
        );
    };

    const getOwnershipClass = (
        ownerType
    ) => {
        return ownerType === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700";
    };

    const getOwnershipLabel = (
        ownerType
    ) => {
        return ownerType === "admin"
            ? "Admin Owned"
            : "Vendor Owned";
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(
            getPayment(id)
        );

        return () => {
            dispatch(
                clearCurrentPayment()
            );

            dispatch(
                clearPaymentError()
            );
        };
    }, [dispatch, id]);

    if (
        paymentLoading &&
        !payment
    ) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(
                        (item) => (
                            <div
                                key={item}
                                className="bg-white rounded-xl shadow-sm border p-6 animate-pulse"
                            >
                                <div className="h-5 bg-gray-200 rounded w-1/3 mb-5" />

                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    if (
        error &&
        !payment
    ) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                    <h2 className="text-lg font-semibold">
                        Unable to load payment
                    </h2>

                    <p className="text-sm mt-1">
                        {typeof error ===
                        "string"
                            ? error
                            : "Payment details could not be loaded."}
                    </p>

                    <Link
                        to="/admin/payments"
                        className="inline-flex mt-4 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-sm"
                    >
                        Back to Payments
                    </Link>
                </div>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="p-6">
                <div className="bg-white border rounded-xl p-10 text-center">
                    <div className="text-4xl mb-3">
                        💳
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700">
                        Payment Not Found
                    </h2>

                    <Link
                        to="/admin/payments"
                        className="inline-flex mt-5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        Back to Payments
                    </Link>
                </div>
            </div>
        );
    }

    const order =
        payment?.order || null;

    const items =
        Array.isArray(
            order?.items
        )
            ? order.items
            : [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Payment Details
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Complete payment, customer,
                        order, vendor, and ownership
                        information.
                    </p>
                </div>

                <Link
                    to="/admin/payments"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium transition"
                >
                    ← Back to Payments
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Information */}

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Payment Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Payment ID
                            </span>

                            <span className="font-semibold">
                                #{payment.id}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Order ID
                            </span>

                            <span className="font-semibold">
                                #{payment.order_id}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Transaction ID
                            </span>

                            <span className="font-medium text-right break-all">
                                {payment.transaction_id ||
                                    "-"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Payment Method
                            </span>

                            <span className="font-medium capitalize">
                                {payment.payment_method
                                    ? String(
                                          payment.payment_method
                                      ).replaceAll(
                                          "_",
                                          " "
                                      )
                                    : "-"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 items-center">
                            <span className="text-sm text-gray-500">
                                Amount
                            </span>

                            <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(
                                    payment.amount
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 items-center">
                            <span className="text-sm text-gray-500">
                                Payment Status
                            </span>

                            <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                    payment.status
                                )}`}
                            >
                                {formatStatus(
                                    payment.status
                                )}
                            </span>
                        </div>

                        {/* IMPORTANT CUSTOMER PAYMENT DATE */}

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Paid At
                            </span>

                            <span className="text-sm font-medium text-right">
                                {String(
                                    payment.status ||
                                        ""
                                ).toLowerCase() ===
                                    "paid" &&
                                payment.paid_at
                                    ? formatDate(
                                          payment.paid_at
                                      )
                                    : "Not paid yet"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-500">
                                Created At
                            </span>

                            <span className="text-sm">
                                {formatDate(
                                    payment.created_at
                                )}
                            </span>
                        </div>

                        {payment.status ===
                            "refunded" && (
                            <div className="flex justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Original Paid At
                                </span>

                                <span className="text-sm font-medium">
                                    {payment.paid_at
                                        ? formatDate(
                                              payment.paid_at
                                          )
                                        : "-"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer */}

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                        Customer Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p className="font-semibold mt-1">
                                {payment?.user?.name ||
                                    "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-medium mt-1 break-all">
                                {payment?.user?.email ||
                                    "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Order Number
                            </p>

                            <p className="font-semibold mt-1">
                                {order?.order_number ||
                                    "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Order Status
                            </p>

                            <p className="font-semibold mt-1">
                                {formatStatus(
                                    order?.status
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Order Payment Status
                            </p>

                            <p className="font-semibold mt-1">
                                {formatStatus(
                                    order?.payment_status
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount Summary */}

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">
                    Order Amount
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">
                            Subtotal
                        </p>

                        <p className="text-lg font-bold mt-1">
                            {formatCurrency(
                                order?.subtotal_amount
                            )}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">
                            Discount
                        </p>

                        <p className="text-lg font-bold text-red-600 mt-1">
                            -{" "}
                            {formatCurrency(
                                order?.discount_amount
                            )}
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">
                            Total Amount
                        </p>

                        <p className="text-xl font-bold text-blue-700 mt-1">
                            {formatCurrency(
                                order?.total_amount ??
                                    payment.amount
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Items */}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Order Items
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Historical selling store and
                        product ownership at purchase time.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No order items found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Product
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Ownership
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Selling Store
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Quantity
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Price
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {items.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const ownerType =
                                            String(
                                                item?.product_owner_type ||
                                                    item?.product
                                                        ?.owner_type ||
                                                    "vendor"
                                            ).toLowerCase();

                                        return (
                                            <tr
                                                key={
                                                    item?.id ??
                                                    `item-${index}`
                                                }
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-gray-800">
                                                        {item
                                                            ?.product
                                                            ?.name ||
                                                            "-"}
                                                    </div>

                                                    {item
                                                        ?.product_variant
                                                        ?.name && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Variant:{" "}
                                                            {
                                                                item
                                                                    .product_variant
                                                                    .name
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getOwnershipClass(
                                                            ownerType
                                                        )}`}
                                                    >
                                                        {getOwnershipLabel(
                                                            ownerType
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-gray-800">
                                                        {item
                                                            ?.vendor
                                                            ?.store_name ||
                                                            item
                                                                ?.vendor
                                                                ?.name ||
                                                            "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-sm">
                                                    {Number(
                                                        item?.quantity ||
                                                            0
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-medium">
                                                    {formatCurrency(
                                                        item?.price
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-bold">
                                                    {formatCurrency(
                                                        item?.total
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
    );
};

export default ViewPayment;
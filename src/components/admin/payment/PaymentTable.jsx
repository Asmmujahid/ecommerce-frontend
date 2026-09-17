// ============================================================
// FILE:
// src/components/admin/payment/PaymentTable.jsx
// ============================================================

import React from "react";

import { Link } from "react-router-dom";

const PaymentTable = ({
    payments = [],
    onDelete,
    loading = false,
}) => {
    // ------------------------------------------------------------
    // Currency
    // ------------------------------------------------------------
    const formatCurrency = (amount) => {
        const value = Number(amount);

        return `Rs. ${(
            Number.isFinite(value)
                ? value
                : 0
        ).toLocaleString("en-PK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // ------------------------------------------------------------
    // Status text
    // ------------------------------------------------------------
    const formatStatus = (status) => {
        if (!status) {
            return "Pending";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    // ------------------------------------------------------------
    // Status CSS
    // ------------------------------------------------------------
    const getStatusClass = (status) => {
        switch (
            String(status || "")
                .toLowerCase()
        ) {
            case "paid":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "failed":
                return "bg-red-100 text-red-700";

            case "refunded":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // ------------------------------------------------------------
    // Paid date
    // ------------------------------------------------------------
    const formatPaidAt = (paidAt) => {
        if (!paidAt) {
            return {
                date: "Not paid yet",
                time: null,
            };
        }

        const parsedDate = new Date(paidAt);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return {
                date: "Invalid date",
                time: null,
            };
        }

        return {
            date: parsedDate.toLocaleDateString(
                "en-PK",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }
            ),

            time: parsedDate.toLocaleTimeString(
                "en-PK",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }
            ),
        };
    };

    // ------------------------------------------------------------
    // Transaction ID
    // ------------------------------------------------------------
    const getTransactionId = (payment) => {
        /*
         * Your Laravel database/API field is:
         *
         * transaction_id
         *
         * This is the primary value.
         *
         * The fallback to transactionId makes the component
         * slightly more tolerant if another frontend mapper
         * converts snake_case to camelCase.
         */

        if (
            payment?.transaction_id !== null &&
            payment?.transaction_id !== undefined &&
            String(payment.transaction_id).trim() !== ""
        ) {
            return String(
                payment.transaction_id
            ).trim();
        }

        if (
            payment?.transactionId !== null &&
            payment?.transactionId !== undefined &&
            String(payment.transactionId).trim() !== ""
        ) {
            return String(
                payment.transactionId
            ).trim();
        }

        return "-";
    };

    // ------------------------------------------------------------
    // Delete
    // ------------------------------------------------------------
    const handleDelete = (id) => {
        if (
            !id ||
            typeof onDelete !== "function"
        ) {
            return;
        }

        onDelete(id);
    };

    // ------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------
    if (
        loading &&
        payments.length === 0
    ) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                <div className="text-gray-500">
                    Loading payments...
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------
    // Empty
    // ------------------------------------------------------------
    if (!payments.length) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                <div className="text-4xl mb-3">
                    💳
                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                    No Payments Found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                    Payment records will appear here.
                </p>
            </div>
        );
    }

    // ------------------------------------------------------------
    // Table
    // ------------------------------------------------------------
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-[1450px] w-full">

                    {/* ==================================================
                        HEADER
                    ================================================== */}
                    <thead className="bg-gray-50 border-b">
                        <tr>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                #
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Payment
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Order
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Transaction
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Amount
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Method
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Status
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Paid At
                            </th>

                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                                Action
                            </th>

                        </tr>
                    </thead>

                    {/* ==================================================
                        BODY
                    ================================================== */}
                    <tbody className="divide-y divide-gray-200">

                        {payments.map(
                            (payment, index) => {

                                const status =
                                    payment?.status ||
                                    "pending";

                                const orderNumber =
                                    payment?.order
                                        ?.order_number ||
                                    payment?.order_id ||
                                    "-";

                                const customerName =
                                    payment?.user?.name ||
                                    "-";

                                const customerEmail =
                                    payment?.user?.email ||
                                    "-";

                                const transactionId =
                                    getTransactionId(
                                        payment
                                    );

                                const paidAt =
                                    formatPaidAt(
                                        payment?.paid_at
                                    );

                                const isPaid =
                                    String(
                                        status
                                    ).toLowerCase() ===
                                        "paid" &&
                                    Boolean(
                                        payment?.paid_at
                                    );

                                return (
                                    <tr
                                        key={
                                            payment?.id ??
                                            `payment-${index}`
                                        }
                                        className="hover:bg-gray-50 transition"
                                    >

                                        {/* --------------------------------
                                            #
                                        -------------------------------- */}
                                        <td className="px-5 py-4 text-sm text-gray-700">
                                            {index + 1}
                                        </td>

                                        {/* --------------------------------
                                            Payment
                                        -------------------------------- */}
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">
                                                #
                                                {payment?.id ||
                                                    "-"}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                Customer Payment
                                            </div>
                                        </td>

                                        {/* --------------------------------
                                            Customer
                                        -------------------------------- */}
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800">
                                                {
                                                    customerName
                                                }
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {
                                                    customerEmail
                                                }
                                            </div>
                                        </td>

                                        {/* --------------------------------
                                            Order
                                        -------------------------------- */}
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-gray-800">
                                                {
                                                    orderNumber
                                                }
                                            </div>

                                            {payment?.order_id && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Order ID:{" "}
                                                    {
                                                        payment.order_id
                                                    }
                                                </div>
                                            )}
                                        </td>

                                        {/* --------------------------------
                                            Transaction ID
                                        -------------------------------- */}
                                        <td className="px-5 py-4 text-sm">

                                            {transactionId !==
                                            "-" ? (
                                                <div className="max-w-[220px]">
                                                    <span
                                                        className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-xs break-all"
                                                        title={
                                                            transactionId
                                                        }
                                                    >
                                                        {
                                                            transactionId
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}

                                        </td>

                                        {/* --------------------------------
                                            Amount
                                        -------------------------------- */}
                                        <td className="px-5 py-4 font-semibold text-blue-600">
                                            {formatCurrency(
                                                payment?.amount
                                            )}
                                        </td>

                                        {/* --------------------------------
                                            Payment Method
                                        -------------------------------- */}
                                        <td className="px-5 py-4 text-sm capitalize text-gray-700">
                                            {payment?.payment_method
                                                ? String(
                                                      payment.payment_method
                                                  ).replaceAll(
                                                      "_",
                                                      " "
                                                  )
                                                : "-"}
                                        </td>

                                        {/* --------------------------------
                                            Status
                                        -------------------------------- */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    status
                                                )}
                                            </span>
                                        </td>

                                        {/* --------------------------------
                                            Paid At
                                        -------------------------------- */}
                                        <td className="px-5 py-4">

                                            {isPaid ? (
                                                <div>

                                                    <div className="font-medium text-gray-800">
                                                        {
                                                            paidAt.date
                                                        }
                                                    </div>

                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {
                                                            paidAt.time
                                                        }
                                                    </div>

                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    Not paid yet
                                                </span>
                                            )}

                                        </td>

                                        {/* --------------------------------
                                            Actions
                                        -------------------------------- */}
                                        <td className="px-5 py-4">

                                            <div className="flex items-center justify-center gap-2">

                                                {/* View */}
                                                <Link
                                                    to={`/admin/payments/${payment.id}`}
                                                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                                                >
                                                    View
                                                </Link>

                                                {/* Edit */}
                                                <Link
                                                    to={`/admin/payments/${payment.id}/edit`}
                                                    className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium transition"
                                                >
                                                    Edit
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    disabled={
                                                        loading
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            payment.id
                                                        )
                                                    }
                                                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;


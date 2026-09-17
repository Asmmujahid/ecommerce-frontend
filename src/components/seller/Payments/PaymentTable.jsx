// src/components/Seller/Payments/PaymentTable.jsx

import { Link } from "react-router-dom";

const PaymentTable = ({ payments = [] }) => {
    // ---------------------------------------------------------
    // Currency formatter
    // ---------------------------------------------------------

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 2,
        }).format(Number(amount ?? 0));
    };

    // ---------------------------------------------------------
    // Date formatter
    // ---------------------------------------------------------

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // ---------------------------------------------------------
    // Status formatter
    // ---------------------------------------------------------

    const formatStatus = (status) => {
        if (!status) {
            return "-";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // ---------------------------------------------------------
    // Payment status badge
    //
    // IMPORTANT:
    // Payment status belongs to CUSTOMER PAYMENT.
    //
    // paid = customer has paid.
    //
    // It does NOT mean vendor earning has been paid.
    // ---------------------------------------------------------

    const paymentStatusBadge = (status) => {
        const normalizedStatus = String(status || "").toLowerCase();

        const classes = {
            paid: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            failed: "bg-red-100 text-red-700",
            refunded: "bg-gray-100 text-gray-700",
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    classes[normalizedStatus] ||
                    "bg-gray-100 text-gray-700"
                }`}
            >
                {formatStatus(status)}
            </span>
        );
    };

    // ---------------------------------------------------------
    // Earning status badge
    //
    // This is the vendor payout status.
    // ---------------------------------------------------------

    const earningStatusBadge = (status) => {
        const normalizedStatus = String(status || "").toLowerCase();

        const classes = {
            paid: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            reversed: "bg-red-100 text-red-700",
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    classes[normalizedStatus] ||
                    "bg-gray-100 text-gray-700"
                }`}
            >
                {formatStatus(status)}
            </span>
        );
    };

    // ---------------------------------------------------------
    // Get seller earning records
    //
    // Seller backend already filters order.items by vendor_id.
    // Therefore we only display the records returned by backend.
    // ---------------------------------------------------------

    const getSellerEarnings = (payment) => {
        const items = payment?.order?.items;

        if (!Array.isArray(items)) {
            return [];
        }

        return items
            .map((item) => ({
                item,
                earning:
                    item?.vendor_earning ??
                    item?.vendorEarning ??
                    null,
            }))
            .filter(({ earning }) => Boolean(earning));
    };

    // ---------------------------------------------------------
    // Product ownership
    //
    // product_owner_type is the historical accounting snapshot.
    //
    // Fallback to product.owner_type only for compatibility.
    // ---------------------------------------------------------

    const getOwnerType = (item) => {
        return String(
            item?.product_owner_type ??
                item?.product?.owner_type ??
                "vendor"
        ).toLowerCase();
    };

    // ---------------------------------------------------------
    // Empty state
    // ---------------------------------------------------------

    if (!Array.isArray(payments) || payments.length === 0) {
        return (
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-10 text-center">
                <div className="text-4xl mb-3">💳</div>

                <h2 className="text-xl font-semibold text-gray-700">
                    No Payments Found
                </h2>

                <p className="text-gray-500 mt-2">
                    Your payment history will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* =================================================
                Heading
            ================================================= */}

            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    Payment History
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Payments associated with products sold through your
                    store.
                </p>
            </div>

            {/* =================================================
                Table
            ================================================= */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[1500px] w-full divide-y divide-gray-200">
                        {/* =================================================
                            Table Header
                        ================================================= */}

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    #
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Customer
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Order
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Transaction
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Method
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Customer Paid
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Payment
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Gross
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Adjustment
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Your Earning
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Earning Status
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Paid At
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {/* =================================================
                            Table Body
                        ================================================= */}

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {payments.map((payment, index) => {
                                const sellerEarnings =
                                    getSellerEarnings(payment);

                                return (
                                    <tr
                                        key={
                                            payment?.id ??
                                            `payment-${index}`
                                        }
                                        className="hover:bg-gray-50 transition"
                                    >
                                        {/* =================================================
                                            #
                                        ================================================= */}

                                        <td className="px-5 py-4 text-sm text-gray-700 align-top">
                                            {index + 1}
                                        </td>

                                        {/* =================================================
                                            Customer
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            <div className="font-medium text-gray-800">
                                                {payment?.user?.name || "-"}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                {payment?.user?.email || "-"}
                                            </div>
                                        </td>

                                        {/* =================================================
                                            Order
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            <span className="font-semibold text-gray-800">
                                                #
                                                {payment?.order_id ?? "-"}
                                            </span>

                                            {payment?.order
                                                ?.order_number && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {
                                                        payment.order
                                                            .order_number
                                                    }
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Transaction
                                        ================================================= */}

                                        <td className="px-5 py-4 text-sm align-top">
                                            <span className="break-all text-gray-700">
                                                {payment?.transaction_id ||
                                                    "-"}
                                            </span>
                                        </td>

                                        {/* =================================================
                                            Payment Method
                                        ================================================= */}

                                        <td className="px-5 py-4 text-sm align-top">
                                            <span className="capitalize">
                                                {payment?.payment_method ||
                                                    "-"}
                                            </span>
                                        </td>

                                        {/* =================================================
                                            Customer Paid
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            <span className="font-semibold text-blue-600">
                                                {formatCurrency(
                                                    payment?.amount
                                                )}
                                            </span>
                                        </td>

                                        {/* =================================================
                                            Payment Status
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            {paymentStatusBadge(
                                                payment?.status
                                            )}
                                        </td>

                                        {/* =================================================
                                            Gross
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            {sellerEarnings.length === 0 ? (
                                                <span className="text-sm text-gray-400">
                                                    -
                                                </span>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sellerEarnings.map(
                                                        ({
                                                            item,
                                                            earning,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    earning?.id ??
                                                                    item?.id
                                                                }
                                                                className="rounded-lg bg-gray-50 border border-gray-100 p-3"
                                                            >
                                                                <p className="text-xs text-gray-400">
                                                                    {item
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Product"}
                                                                </p>

                                                                <p className="font-semibold text-gray-800 mt-1">
                                                                    {formatCurrency(
                                                                        earning?.gross_amount
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Adjustment
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            {sellerEarnings.length === 0 ? (
                                                <span className="text-sm text-gray-400">
                                                    -
                                                </span>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sellerEarnings.map(
                                                        ({
                                                            item,
                                                            earning,
                                                        }) => {
                                                            const ownerType =
                                                                getOwnerType(
                                                                    item
                                                                );

                                                            const isAdminOwned =
                                                                ownerType ===
                                                                "admin";

                                                            return (
                                                                <div
                                                                    key={
                                                                        earning?.id ??
                                                                        item?.id
                                                                    }
                                                                    className="rounded-lg bg-gray-50 border border-gray-100 p-3"
                                                                >
                                                                    <p className="text-xs text-gray-400">
                                                                        {isAdminOwned
                                                                            ? "Selling / Service Fee"
                                                                            : "Marketplace Commission"}
                                                                    </p>

                                                                    <p
                                                                        className={`font-semibold mt-1 ${
                                                                            isAdminOwned
                                                                                ? "text-purple-600"
                                                                                : "text-orange-600"
                                                                        }`}
                                                                    >
                                                                        {formatCurrency(
                                                                            earning?.commission_amount
                                                                        )}
                                                                    </p>

                                                                    {earning?.commission_rate !==
                                                                            null &&
                                                                        earning?.commission_rate !==
                                                                            undefined && (
                                                                            <p className="text-xs text-gray-400 mt-1">
                                                                                Rate:{" "}
                                                                                <span className="font-semibold text-gray-600">
                                                                                    {
                                                                                        earning.commission_rate
                                                                                    }
                                                                                    %
                                                                                </span>
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Your Earning
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            {sellerEarnings.length === 0 ? (
                                                <span className="text-sm text-gray-400">
                                                    No earning record
                                                </span>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sellerEarnings.map(
                                                        ({
                                                            item,
                                                            earning,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    earning?.id ??
                                                                    item?.id
                                                                }
                                                                className="rounded-lg bg-green-50 border border-green-100 p-3"
                                                            >
                                                                <p className="text-xs text-gray-400">
                                                                    {item
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Product"}
                                                                </p>

                                                                <p className="font-bold text-green-600 mt-1">
                                                                    {formatCurrency(
                                                                        earning?.net_amount
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Earning Status
                                        ================================================= */}

                                        <td className="px-5 py-4 align-top">
                                            {sellerEarnings.length === 0 ? (
                                                <span className="text-sm text-gray-400">
                                                    -
                                                </span>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sellerEarnings.map(
                                                        ({
                                                            item,
                                                            earning,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    earning?.id ??
                                                                    item?.id
                                                                }
                                                                className="rounded-lg bg-gray-50 border border-gray-100 p-3"
                                                            >
                                                                <p className="text-xs text-gray-400 mb-2">
                                                                    {item
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Product"}
                                                                </p>

                                                                {earning?.status ? (
                                                                    earningStatusBadge(
                                                                        earning.status
                                                                    )
                                                                ) : (
                                                                    <span className="text-xs text-gray-400">
                                                                        No
                                                                        status
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Paid At
                                        ================================================= */}

                                        <td className="px-5 py-4 text-sm text-gray-600 align-top">
                                            {sellerEarnings.length === 0 ? (
                                                formatDate(payment?.paid_at)
                                            ) : (
                                                <div className="space-y-3">
                                                    {sellerEarnings.map(
                                                        ({
                                                            item,
                                                            earning,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    earning?.id ??
                                                                    item?.id
                                                                }
                                                                className="rounded-lg bg-gray-50 border border-gray-100 p-3"
                                                            >
                                                                <p className="text-xs text-gray-400">
                                                                    {item
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Product"}
                                                                </p>

                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    {earning?.paid_at
                                                                        ? formatDate(
                                                                              earning.paid_at
                                                                          )
                                                                        : "Not paid yet"}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* =================================================
                                            Action
                                        ================================================= */}

                                        <td className="px-5 py-4 text-center align-top">
                                            <Link
                                                to={`/seller/payments/${payment?.id}`}
                                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentTable;


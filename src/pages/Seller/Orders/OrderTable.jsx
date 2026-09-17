// src/pages/Seller/Orders/OrderTable.jsx

import { Link } from "react-router-dom";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
};

const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const formatStatus = (status) => {
    if (!status) {
        return "-";
    }

    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return `Rs.${value.toLocaleString("en-PK")}`;
};

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getOrderTotal = (order) => {
    return (
        order?.total_amount ??
        order?.total ??
        0
    );
};

const getPaymentMethod = (order) => {
    return (
        order?.payment_method ??
        order?.payment?.payment_method ??
        "-"
    );
};

const getPaymentStatus = (order) => {
    return (
        order?.payment_status ??
        order?.payment?.status ??
        "pending"
    );
};

const OrderTable = ({
    orders = [],
    onStatusChange,
    loading = false,
    updatingOrderId = null,
}) => {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-[1100px] w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">
                                Order #
                            </th>

                            <th className="px-4 py-3 text-left">
                                Customer
                            </th>

                            <th className="px-4 py-3 text-left">
                                Total
                            </th>

                            <th className="px-4 py-3 text-left">
                                Payment
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left">
                                Method
                            </th>

                            <th className="px-4 py-3 text-left">
                                Date
                            </th>

                            <th className="px-4 py-3 text-center">
                                Update Status
                            </th>

                            <th className="px-4 py-3 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map((order) => {
                            const paymentStatus =
                                getPaymentStatus(
                                    order
                                );

                            const orderStatus =
                                order.status ||
                                "pending";

                            const isUpdating =
                                updatingOrderId ===
                                order.id;

                            return (
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    {/* Order Number */}

                                    <td className="px-4 py-4 font-semibold whitespace-nowrap">
                                        {order.order_number ||
                                            `#${order.id}`}
                                    </td>

                                    {/* Customer */}

                                    <td className="px-4 py-4">

                                        <div className="font-medium">
                                            {order.user?.name ||
                                                "Unknown Customer"}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {order.user?.email ||
                                                "-"}
                                        </div>

                                    </td>

                                    {/* Total */}

                                    <td className="px-4 py-4 font-semibold whitespace-nowrap">
                                        {formatCurrency(
                                            getOrderTotal(
                                                order
                                            )
                                        )}
                                    </td>

                                    {/* Payment */}

                                    <td className="px-4 py-4">

                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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

                                    </td>

                                    {/* Order Status */}

                                    <td className="px-4 py-4">

                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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

                                    </td>

                                    {/* Payment Method */}

                                    <td className="px-4 py-4 capitalize">
                                        {getPaymentMethod(
                                            order
                                        )}
                                    </td>

                                    {/* Date */}

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {formatDate(
                                            order.created_at
                                        )}
                                    </td>

                                    {/* Update Status */}

                                    <td className="px-4 py-4 text-center">

                                        <select
                                            value={
                                                orderStatus
                                            }
                                            disabled={
                                                loading ||
                                                updatingOrderId !==
                                                    null
                                            }
                                            onChange={(e) =>
                                                onStatusChange(
                                                    order.id,
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="border rounded-lg px-2 py-2 bg-white disabled:opacity-50"
                                        >

                                            {statusOptions.map(
                                                (status) => (
                                                    <option
                                                        key={
                                                            status
                                                        }
                                                        value={
                                                            status
                                                        }
                                                    >
                                                        {formatStatus(
                                                            status
                                                        )}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {isUpdating && (
                                            <div className="text-xs text-blue-600 mt-1">
                                                Updating...
                                            </div>
                                        )}

                                    </td>

                                    {/* Action */}

                                    <td className="px-4 py-4 text-center">

                                        <Link
                                            to={`/seller/orders/${order.id}`}
                                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </Link>

                                    </td>

                                </tr>
                            );
                        })}

                        {orders.length === 0 && (
                            <tr>

                                <td
                                    colSpan={9}
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Orders Found
                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default OrderTable;


import React from "react";

const RecentOrders = ({ orders = [] }) => {
    /*
    |--------------------------------------------------------------------------
    | Normalize API response
    |--------------------------------------------------------------------------
    */

    let orderList = orders;

    if (
        orderList &&
        !Array.isArray(orderList) &&
        Array.isArray(orderList.data)
    ) {
        orderList = orderList.data;
    }

    if (!Array.isArray(orderList)) {
        orderList = [];
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getCustomerName = (order) => {
        return (
            order?.user?.name ||
            order?.customer?.name ||
            order?.customer_name ||
            order?.customerName ||
            "N/A"
        );
    };

    const getAmount = (order) => {
        return (
            order?.total_amount ??
            order?.totalAmount ??
            order?.grand_total ??
            order?.grandTotal ??
            order?.amount ??
            0
        );
    };

    const getPaymentStatus = (order) => {
        return (
            order?.payment_status ||
            order?.paymentStatus ||
            order?.payment?.status ||
            "pending"
        );
    };

    const getStatus = (order) => {
        return (
            order?.status ||
            order?.order_status ||
            order?.orderStatus ||
            "pending"
        );
    };

    const getDate = (order) => {
        return (
            order?.created_at ||
            order?.createdAt ||
            order?.order_date ||
            order?.orderDate ||
            null
        );
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Pending";
        }

        return String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getStatusClass = (status) => {
        switch (String(status).toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-700";

            case "processing":
                return "bg-blue-100 text-blue-700";

            case "shipped":
                return "bg-indigo-100 text-indigo-700";

            case "cancelled":
            case "canceled":
                return "bg-red-100 text-red-700";

            case "completed":
                return "bg-green-100 text-green-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const getPaymentClass = (status) => {
        return String(status).toLowerCase() === "paid"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700";
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
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="border-b p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                    Recent Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Latest orders from your store
                </p>
            </div>

            {/* Table */}
            {orderList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px]">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Order ID
                                </th>

                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Payment
                                </th>

                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>

                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderList.map((order, index) => {
                                const paymentStatus =
                                    getPaymentStatus(order);

                                const status = getStatus(order);

                                return (
                                    <tr
                                        key={
                                            order?.id ||
                                            order?.order_id ||
                                            index
                                        }
                                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            #
                                            {order?.id ||
                                                order?.order_id ||
                                                "-"}
                                        </td>

                                        <td className="px-5 py-4 text-gray-700">
                                            {getCustomerName(order)}
                                        </td>

                                        <td className="px-5 py-4 text-gray-800 font-medium">
                                            Rs.{" "}
                                            {Number(
                                                getAmount(order)
                                            ).toLocaleString("en-PK")}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentClass(
                                                    paymentStatus
                                                )}`}
                                            >
                                                {formatStatus(
                                                    paymentStatus
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {formatStatus(status)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(getDate(order))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <span className="text-2xl">🛒</span>
                    </div>

                    <p className="text-gray-600 font-medium">
                        No recent orders found
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        New orders will appear here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;


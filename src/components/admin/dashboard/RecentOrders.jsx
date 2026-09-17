import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            const response = await axiosInstance.get("/admin/orders");

            if (response.data.success) {
                setOrders(response.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Recent Orders
                </h2>

                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-12 bg-gray-200 rounded animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-5">
                Recent Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No Orders Found
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 font-semibold">
                                    Order #
                                </th>

                                <th className="text-left py-3 font-semibold">
                                    Customer
                                </th>

                                <th className="text-left py-3 font-semibold">
                                    Amount
                                </th>

                                <th className="text-left py-3 font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="py-3">
                                        {order.order_number}
                                    </td>

                                    <td className="py-3">
                                        {order.user?.name || "N/A"}
                                    </td>

                                    <td className="py-3">
                                        Rs. {order.total_amount}
                                    </td>

                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : order.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;

// ============================================================
// src/pages/Seller/Orders/OrderStatusModal.jsx
// ============================================================

import { useEffect, useState } from "react";

const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

const formatStatus = (status) => {
    if (!status) return "-";

    return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const OrderStatusModal = ({
    isOpen,
    onClose,
    order,
    onUpdate,
    loading = false,
}) => {
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (order) {
            setStatus(order.status || "pending");
        }
    }, [order]);

    if (!isOpen || !order) {
        return null;
    }

    const handleSubmit = () => {
        if (!status || loading) {
            return;
        }

        onUpdate(order.id, status);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >

            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <h2 className="text-xl font-semibold">
                        Update Order Status
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-500 hover:text-red-600 text-2xl disabled:opacity-50"
                    >
                        ×
                    </button>

                </div>

                {/* Body */}

                <div className="p-6 space-y-5">

                    {/* Order Number */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Order Number
                        </label>

                        <input
                            type="text"
                            value={
                                order.order_number ||
                                order.id
                            }
                            disabled
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />
                    </div>

                    {/* Customer */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Customer
                        </label>

                        <input
                            type="text"
                            value={
                                order.user?.name ||
                                "Unknown Customer"
                            }
                            disabled
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />
                    </div>

                    {/* Current Status */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Current Status
                        </label>

                        <input
                            type="text"
                            value={formatStatus(
                                order.status
                            )}
                            disabled
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                        />
                    </div>

                    {/* New Status */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            New Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                            {statusOptions.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {formatStatus(
                                            item
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 px-6 py-4 border-t">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !status}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Updating..."
                            : "Update Status"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default OrderStatusModal;
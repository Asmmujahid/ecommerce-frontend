// src/pages/Seller/Coupons/CouponTable.jsx

import { Link } from "react-router-dom";

const CouponTable = ({
    coupons = [],
    onDelete,
}) => {
    /*
    |--------------------------------------------------------------------------
    | Badge Colors
    |--------------------------------------------------------------------------
    */

    const typeBadge = (type) => {
        switch (type) {
            case "percentage":
                return "bg-blue-100 text-blue-700";

            case "fixed":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const statusBadge = (status) => {
        return status
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
    };

    /*
    |--------------------------------------------------------------------------
    | Format Currency
    |--------------------------------------------------------------------------
    */

    const formatCurrency = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        return `Rs. ${Number(
            value
        ).toLocaleString("en-PK")}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-PK"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">
                                Code
                            </th>

                            <th className="px-4 py-3 text-left">
                                Type
                            </th>

                            <th className="px-4 py-3 text-left">
                                Value
                            </th>

                            <th className="px-4 py-3 text-left">
                                Minimum Order
                            </th>

                            <th className="px-4 py-3 text-left">
                                Max Discount
                            </th>

                            <th className="px-4 py-3 text-left">
                                Usage
                            </th>

                            <th className="px-4 py-3 text-left">
                                Validity
                            </th>

                            <th className="px-4 py-3 text-left">
                                Status
                            </th>

                            <th className="px-4 py-3 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {coupons.length > 0 ? (
                            coupons.map(
                                (coupon) => {
                                    const isActive =
                                        coupon.status ===
                                            true ||
                                        coupon.status ===
                                            1;

                                    return (
                                        <tr
                                            key={
                                                coupon.id
                                            }
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            {/* Code */}

                                            <td className="px-4 py-4">
                                                <div className="font-bold uppercase">
                                                    {
                                                        coupon.code
                                                    }
                                                </div>

                                                <div className="text-xs text-gray-500 mt-1">
                                                    Store
                                                    Coupon
                                                </div>
                                            </td>

                                            {/* Type */}

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${typeBadge(
                                                        coupon.type
                                                    )}`}
                                                >
                                                    {
                                                        coupon.type
                                                    }
                                                </span>
                                            </td>

                                            {/* Value */}

                                            <td className="px-4 py-4 font-semibold">
                                                {coupon.type ===
                                                "percentage"
                                                    ? `${coupon.value}%`
                                                    : formatCurrency(
                                                          coupon.value
                                                      )}
                                            </td>

                                            {/* Minimum Order */}

                                            <td className="px-4 py-4">
                                                {formatCurrency(
                                                    coupon.min_order_amount
                                                )}
                                            </td>

                                            {/* Max Discount */}

                                            <td className="px-4 py-4">
                                                {coupon.type ===
                                                "percentage"
                                                    ? formatCurrency(
                                                          coupon.max_discount
                                                      )
                                                    : "-"}
                                            </td>

                                            {/* Usage */}

                                            <td className="px-4 py-4">
                                                <div className="text-sm">
                                                    <span className="font-semibold">
                                                        {
                                                            coupon.used_count
                                                        }
                                                    </span>

                                                    {" / "}

                                                    {coupon.usage_limit ??
                                                        "Unlimited"}
                                                </div>
                                            </td>

                                            {/* Validity */}

                                            <td className="px-4 py-4">
                                                <div className="text-sm">
                                                    <div>
                                                        <strong>
                                                            From:
                                                        </strong>{" "}
                                                        {formatDate(
                                                            coupon.start_date
                                                        )}
                                                    </div>

                                                    <div className="mt-1">
                                                        <strong>
                                                            To:
                                                        </strong>{" "}
                                                        {formatDate(
                                                            coupon.end_date
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                                                        isActive
                                                    )}`}
                                                >
                                                    {isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Actions */}

                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    {/* View */}

                                                    <Link
                                                        to={`/seller/coupons/${coupon.id}`}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                                                    >
                                                        View
                                                    </Link>

                                                    {/* Edit */}

                                                    <Link
                                                        to={`/seller/coupons/${coupon.id}/edit`}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                                                    >
                                                        Edit
                                                    </Link>

                                                    {/* Delete */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete(
                                                                coupon.id
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center py-12 text-gray-500"
                                >
                                    <div className="text-lg font-medium">
                                        No coupons
                                        found.
                                    </div>

                                    <p className="text-sm mt-1">
                                        Create your
                                        first store
                                        coupon to
                                        offer discounts
                                        to customers.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponTable;
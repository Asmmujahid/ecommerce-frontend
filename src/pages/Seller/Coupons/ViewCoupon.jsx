// src/pages/Seller/Coupons/ViewCoupon.jsx

import { useEffect } from "react";
import {
    Link,
    useParams,
} from "react-router-dom";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import toast from "react-hot-toast";

import {
    getCoupon,
    clearSelectedCoupon,
    resetSellerCouponState,
} from "../../../redux/seller/sellerCouponSlice";

const ViewCoupon = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const {
        coupon = null,
        loading = false,
        error = null,
    } = useSelector(
        (state) =>
            state.sellerCoupon || {}
    );

    /*
    |--------------------------------------------------------------------------
    | Load Coupon
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(getCoupon(id));

        return () => {
            dispatch(
                clearSelectedCoupon()
            );
        };
    }, [dispatch, id]);

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (error) {
            toast.error(error);

            dispatch(
                resetSellerCouponState()
            );
        }
    }, [error, dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Helpers
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

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-PK"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600 mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading coupon...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not Found
    |--------------------------------------------------------------------------
    */

    if (!coupon) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl shadow p-10 text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Coupon Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The coupon does not exist or
                        does not belong to your store.
                    </p>

                    <Link
                        to="/seller/coupons"
                        className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Back to Coupons
                    </Link>
                </div>
            </div>
        );
    }

    const isActive =
        coupon.status === true ||
        coupon.status === 1;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="p-6">
            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Coupon Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View your store coupon
                        information.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link
                        to={`/seller/coupons/${coupon.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg"
                    >
                        Edit
                    </Link>

                    <Link
                        to="/seller/coupons"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg"
                    >
                        Back
                    </Link>
                </div>
            </div>

            {/* Store Coupon Notice */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                    This is a vendor/store coupon. Its
                    ownership is controlled by the
                    authenticated seller account.
                </p>
            </div>

            {/* Coupon Card */}

            <div className="bg-white rounded-xl shadow p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coupon Code */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Coupon Code
                        </h3>

                        <p className="text-xl font-bold uppercase">
                            {coupon.code}
                        </p>
                    </div>

                    {/* Coupon Owner */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Coupon Type
                        </h3>

                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                            Store Coupon
                        </span>
                    </div>

                    {/* Type */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Discount Type
                        </h3>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                coupon.type ===
                                "percentage"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {coupon.type ===
                            "percentage"
                                ? "Percentage"
                                : "Fixed Amount"}
                        </span>
                    </div>

                    {/* Value */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Discount Value
                        </h3>

                        <p className="font-semibold text-lg">
                            {coupon.type ===
                            "percentage"
                                ? `${coupon.value}%`
                                : formatCurrency(
                                      coupon.value
                                  )}
                        </p>
                    </div>

                    {/* Minimum Order */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Minimum Order Amount
                        </h3>

                        <p className="font-semibold">
                            {formatCurrency(
                                coupon.min_order_amount
                            )}
                        </p>
                    </div>

                    {/* Maximum Discount */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Maximum Discount
                        </h3>

                        <p className="font-semibold">
                            {coupon.type ===
                            "percentage"
                                ? formatCurrency(
                                      coupon.max_discount
                                  )
                                : "Not applicable"}
                        </p>
                    </div>

                    {/* Usage */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Usage
                        </h3>

                        <p className="font-semibold">
                            {coupon.used_count ?? 0}{" "}
                            /{" "}
                            {coupon.usage_limit ??
                                "Unlimited"}
                        </p>
                    </div>

                    {/* Start Date */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Start Date
                        </h3>

                        <p className="font-semibold">
                            {formatDate(
                                coupon.start_date
                            )}
                        </p>
                    </div>

                    {/* End Date */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            End Date
                        </h3>

                        <p className="font-semibold">
                            {formatDate(
                                coupon.end_date
                            )}
                        </p>
                    </div>

                    {/* Status */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Status
                        </h3>

                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {isActive
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>

                    {/* Created */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Created At
                        </h3>

                        <p className="font-semibold">
                            {formatDateTime(
                                coupon.created_at
                            )}
                        </p>
                    </div>

                    {/* Updated */}

                    <div>
                        <h3 className="text-sm text-gray-500 mb-1">
                            Last Updated
                        </h3>

                        <p className="font-semibold">
                            {formatDateTime(
                                coupon.updated_at
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCoupon;
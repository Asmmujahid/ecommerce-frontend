// src/pages/Seller/Coupons/Coupons.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import CouponTable from "./CouponTable";

import {
    getCoupons,
    deleteCoupon,
    clearSellerCouponError,
    clearSellerCouponMessage,
} from "../../../redux/seller/sellerCouponSlice";

const Coupons = () => {
    const dispatch = useDispatch();

    const sellerCoupon = useSelector(
        (state) => state.sellerCoupon
    );

    const {
        coupons = [],
        loading = false,
        error = null,
        success = false,
        message = "",
    } = sellerCoupon || {};

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    /*
    |--------------------------------------------------------------------------
    | Load Seller Coupons
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        dispatch(getCoupons());
    }, [dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Mutation Success Toast
    |--------------------------------------------------------------------------
    |
    | This is only for CREATE / UPDATE / DELETE.
    |
    | GET /seller/coupons does NOT set success=true anymore.
    |
    */

    useEffect(() => {
        if (success && message) {
            toast.success(message);

            /*
             * Clear only success/message.
             *
             * DO NOT reset the complete Redux state.
             */
            dispatch(
                clearSellerCouponMessage()
            );
        }
    }, [
        success,
        message,
        dispatch,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Error Toast
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (error) {
            toast.error(error);

            dispatch(
                clearSellerCouponError()
            );
        }
    }, [
        error,
        dispatch,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Delete Coupon
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (id) => {
        if (!id) {
            toast.error(
                "Invalid coupon ID."
            );

            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this coupon?"
        );

        if (!confirmed) {
            return;
        }

        try {
            /*
             * Redux removes the coupon from the list.
             */
            const result =
                await dispatch(
                    deleteCoupon(id)
                ).unwrap();

            toast.success(
                result?.message ||
                    "Coupon deleted successfully."
            );

        } catch (error) {
            toast.error(
                error ||
                    "Failed to delete coupon."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const normalizedSearch =
        search.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Filter Coupons
    |--------------------------------------------------------------------------
    */

    const filteredCoupons = useMemo(() => {
        return coupons.filter(
            (coupon) => {
                const code =
                    coupon.code
                        ?.toLowerCase() || "";

                const type =
                    coupon.type
                        ?.toLowerCase() || "";

                /*
                 * Search by coupon code or type.
                 */
                const matchesSearch =
                    !normalizedSearch ||
                    code.includes(
                        normalizedSearch
                    ) ||
                    type.includes(
                        normalizedSearch
                    );

                /*
                 * Handle:
                 *
                 * true
                 * 1
                 * "1"
                 */
                const isActive =
                    coupon.status === true ||
                    coupon.status === 1 ||
                    coupon.status === "1";

                const matchesStatus =
                    statusFilter === "all"
                        ? true
                        : statusFilter ===
                          "active"
                        ? isActive
                        : !isActive;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );
    }, [
        coupons,
        normalizedSearch,
        statusFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="p-6">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Store Coupons
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage discount coupons
                        for your store.
                    </p>
                </div>

                <Link
                    to="/seller/coupons/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
                >
                    + Create Coupon
                </Link>
            </div>

            {/* =====================================================
                INFORMATION
            ====================================================== */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">

                <p className="text-sm text-blue-800">
                    These coupons are created for
                    your store. Customers can use
                    them only when their cart
                    contains eligible products
                    from your store.
                </p>

            </div>

            {/* =====================================================
                FILTERS
            ====================================================== */}

            <div className="bg-white rounded-xl shadow p-5 mb-6">

                <div className="grid md:grid-cols-2 gap-4">

                    {/* SEARCH */}

                    <input
                        type="text"
                        placeholder="Search coupon code or type..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">
                            All Coupons
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>

                </div>
            </div>

            {/* =====================================================
                RESULTS COUNT
            ====================================================== */}

            {!loading && (
                <div className="mb-4 text-sm text-gray-500">

                    Showing{" "}

                    <span className="font-semibold text-gray-700">
                        {filteredCoupons.length}
                    </span>{" "}

                    coupon
                    {filteredCoupons.length !== 1
                        ? "s"
                        : ""}

                </div>
            )}

            {/* =====================================================
                LOADING
            ====================================================== */}

            {loading && coupons.length === 0 ? (

                <div className="bg-white rounded-xl shadow p-16 text-center">

                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading coupons...
                    </p>

                </div>

            ) : null}

            {/* =====================================================
                EMPTY STATE
            ====================================================== */}

            {!loading &&
                coupons.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-16 text-center">

                        <div className="text-5xl mb-4">
                            🎟️
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            No coupons found.
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Create your first store
                            coupon to offer discounts
                            to customers.
                        </p>

                        <Link
                            to="/seller/coupons/create"
                            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
                        >
                            + Create Your First Coupon
                        </Link>

                    </div>
                )}

            {/* =====================================================
                COUPON TABLE
            ====================================================== */}

            {!loading &&
                coupons.length > 0 && (
                    <>
                        {filteredCoupons.length > 0 ? (
                            <CouponTable
                                coupons={
                                    filteredCoupons
                                }
                                onDelete={
                                    handleDelete
                                }
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow p-12 text-center">

                                <h2 className="text-lg font-semibold text-gray-800">
                                    No matching coupons
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Try changing your
                                    search or status
                                    filter.
                                </p>

                            </div>
                        )}
                    </>
                )}

        </div>
    );
};

export default Coupons;
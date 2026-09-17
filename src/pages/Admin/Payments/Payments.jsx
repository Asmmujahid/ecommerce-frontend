// ============================================================
// FILE:
// src/pages/Admin/Payments/Payments.jsx
// ============================================================

import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getPayments,
    getEarnings,
    deletePayment,
    clearAdminPaymentError,
} from "../../../redux/admin/paymentSlice";

import PaymentTable from "../../../components/admin/payment/PaymentTable";

const Payments = () => {
    const dispatch = useDispatch();

    const {
        payments = [],
        earnings = null,
        loading = false,
        paymentsLoading = false,
        earningsLoading = false,
        error = null,
        pagination = {},
    } = useSelector(
        (state) =>
            state.adminPayment || {}
    );

    const formatCurrency = (amount) => {
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

    useEffect(() => {
        dispatch(
            getPayments({
                page: 1,
                per_page: 10,
            })
        );

        dispatch(
            getEarnings()
        );

        return () => {
            dispatch(
                clearAdminPaymentError()
            );
        };
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!id) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment?"
            );

        if (!confirmed) {
            return;
        }

        try {
            await dispatch(
                deletePayment(id)
            ).unwrap();

            await dispatch(
                getPayments({
                    page:
                        pagination.currentPage ||
                        1,
                    per_page:
                        pagination.perPage ||
                        10,
                })
            ).unwrap();

            await dispatch(
                getEarnings()
            ).unwrap();
        } catch (deleteError) {
            console.error(
                "Failed to delete payment:",
                deleteError
            );
        }
    };

    const handleRefresh = () => {
        dispatch(
            getPayments({
                page:
                    pagination.currentPage ||
                    1,
                per_page:
                    pagination.perPage ||
                    10,
            })
        );

        dispatch(
            getEarnings()
        );
    };

    const handlePageChange = (page) => {
        if (!page || page < 1) {
            return;
        }

        dispatch(
            getPayments({
                page,
                per_page:
                    pagination.perPage ||
                    10,
            })
        );
    };

    const grossSales = Number(
        earnings?.gross_sales ??
            earnings?.total_gross_sales ??
            earnings?.gross_earnings ??
            0
    );

    const marketplaceCommission =
        Number(
            earnings?.marketplace_commission ??
                earnings?.admin_commission ??
                earnings?.total_admin_commission ??
                0
        );

    const vendorSellingFees =
        Number(
            earnings?.vendor_selling_fees ??
                earnings?.selling_service_fees ??
                earnings?.total_vendor_selling_fees ??
                0
        );

    const vendorEarnings =
        Number(
            earnings?.vendor_earnings ??
                earnings?.total_vendor_earnings ??
                earnings?.total_vendor_net ??
                earnings?.total_seller_earnings ??
                0
        );

    const adminNetEarnings =
        Number(
            earnings?.admin_net_earnings ??
                earnings?.total_admin_net ??
                earnings?.admin_net ??
                0
        );

    const pendingVendorEarnings =
        Number(
            earnings?.pending_earnings ??
                earnings?.pending_vendor_earnings ??
                0
        );

    const paidVendorEarnings =
        Number(
            earnings?.paid_earnings ??
                earnings?.paid_vendor_earnings ??
                0
        );

    const reversedVendorEarnings =
        Number(
            earnings?.reversed_earnings ??
                earnings?.reversed_vendor_earnings ??
                0
        );

    if (
        loading &&
        payments.length === 0 &&
        !earnings
    ) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64" />

                    <div className="h-4 bg-gray-200 rounded w-96 mt-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                key={item}
                                className="bg-white rounded-xl shadow-sm border p-6 animate-pulse"
                            >
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

                                <div className="h-8 bg-gray-200 rounded w-3/4" />

                                <div className="h-3 bg-gray-200 rounded w-4/5 mt-4" />
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    if (
        error &&
        payments.length === 0 &&
        !earnings
    ) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                    <h2 className="font-semibold text-lg">
                        Unable to load payment data
                    </h2>

                    <p className="mt-1 text-sm">
                        {typeof error === "string"
                            ? error
                            : "Something went wrong while loading payment data."}
                    </p>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Payment Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage customer payments,
                        marketplace earnings, and
                        vendor payouts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={
                        paymentsLoading ||
                        earningsLoading
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition"
                >
                    {paymentsLoading ||
                    earningsLoading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                    {typeof error === "string"
                        ? error
                        : "Unable to load some payment information."}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm font-medium text-gray-500">
                        Gross Sales
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-700">
                        {earningsLoading
                            ? "Loading..."
                            : formatCurrency(
                                  grossSales
                              )}
                    </h2>

                    <p className="text-xs text-gray-400 mt-3">
                        Total sales processed through
                        the marketplace.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm font-medium text-gray-500">
                        Marketplace Commission
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-orange-600">
                        {earningsLoading
                            ? "Loading..."
                            : formatCurrency(
                                  marketplaceCommission
                              )}
                    </h2>

                    <p className="text-xs text-gray-400 mt-3">
                        10% commission from vendor-owned
                        products.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <p className="text-sm font-medium text-gray-500">
                        Vendor Earnings
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-700">
                        {earningsLoading
                            ? "Loading..."
                            : formatCurrency(
                                  vendorEarnings
                              )}
                    </h2>

                    <p className="text-xs text-gray-400 mt-3">
                        Total amount belonging to vendors.
                    </p>
                </div>
            </div>

            {earnings && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">
                            Vendor Selling Fees
                        </p>

                        <p className="text-xl font-bold text-purple-700 mt-2">
                            {earningsLoading
                                ? "Loading..."
                                : formatCurrency(
                                      vendorSellingFees
                                  )}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            10% fee paid to vendors for
                            selling admin-owned products.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">
                            Admin Net Earnings
                        </p>

                        <p className="text-xl font-bold text-indigo-700 mt-2">
                            {earningsLoading
                                ? "Loading..."
                                : formatCurrency(
                                      adminNetEarnings
                                  )}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            Amount retained by the marketplace.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">
                            Pending Vendor Earnings
                        </p>

                        <p className="text-xl font-bold text-yellow-600 mt-2">
                            {earningsLoading
                                ? "Loading..."
                                : formatCurrency(
                                      pendingVendorEarnings
                                  )}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            Waiting for actual admin payout.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">
                            Paid Vendor Earnings
                        </p>

                        <p className="text-xl font-bold text-green-600 mt-2">
                            {earningsLoading
                                ? "Loading..."
                                : formatCurrency(
                                      paidVendorEarnings
                                  )}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            Actually paid to vendors.
                        </p>
                    </div>
                </div>
            )}

            {earnings && (
                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Reversed Vendor Earnings
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Earnings reversed because of
                                cancellation or refund.
                            </p>
                        </div>

                        <p className="text-xl font-bold text-red-600">
                            {earningsLoading
                                ? "Loading..."
                                : formatCurrency(
                                      reversedVendorEarnings
                                  )}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Payment History
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        All customer payments processed
                        through the platform.
                    </p>
                </div>

                <PaymentTable
                    payments={payments}
                    loading={paymentsLoading}
                    onDelete={handleDelete}
                />

                {pagination.lastPage > 1 && (
                    <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-500">
                            Page{" "}
                            <span className="font-semibold">
                                {
                                    pagination.currentPage
                                }
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {
                                    pagination.lastPage
                                }
                            </span>
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={
                                    pagination.currentPage <=
                                        1 ||
                                    paymentsLoading
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage -
                                            1
                                    )
                                }
                                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    pagination.currentPage >=
                                        pagination.lastPage ||
                                    paymentsLoading
                                }
                                onClick={() =>
                                    handlePageChange(
                                        pagination.currentPage +
                                            1
                                    )
                                }
                                className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;





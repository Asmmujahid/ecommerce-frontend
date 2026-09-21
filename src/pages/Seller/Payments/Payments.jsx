// src/pages/Seller/Payments/Payments.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    clearSellerPaymentError,
    getEarnings,
    getPayments,
    selectSellerEarnings,
    selectSellerPaymentError,
    selectSellerPayments,
    selectSellerPaymentsLoading,
    selectSellerPaymentPagination,
} from "../../../redux/seller/sellerPaymentSlice";

import EarningsCard from "../../../components/seller/Payments/EarningsCard";
import PaymentTable from "../../../components/seller/Payments/PaymentTable";

const Payments = () => {
    const dispatch = useDispatch();

    // ---------------------------------------------------------
    // Redux state
    // ---------------------------------------------------------

    const payments = useSelector(selectSellerPayments);

    const earningsFromRedux = useSelector(selectSellerEarnings);

    const error = useSelector(selectSellerPaymentError);

    const paymentsLoading = useSelector(
        selectSellerPaymentsLoading
    );

    const pagination = useSelector(
        selectSellerPaymentPagination
    );

    // ---------------------------------------------------------
    // Normalize payments
    // ---------------------------------------------------------

    const normalizedPayments = Array.isArray(payments)
        ? payments
        : [];

    // ---------------------------------------------------------
    // Normalize earnings
    //
    // Backend seller endpoint:
    //
    // {
    //     success: true,
    //     message: "...",
    //     data: {
    //         gross_earnings: ...,
    //         marketplace_commission: ...,
    //         selling_service_fees: ...,
    //         total_earnings: ...,
    //         paid_earnings: ...,
    //         pending_earnings: ...,
    //         reversed_earnings: ...
    //     }
    // }
    //
    // sellerPaymentSlice normally stores payload.data.
    // This normalization also handles wrapped responses.
    // ---------------------------------------------------------

    const earnings =
        earningsFromRedux?.data?.earnings ??
        earningsFromRedux?.data ??
        earningsFromRedux?.earnings ??
        earningsFromRedux ??
        null;

    // ---------------------------------------------------------
    // Load payments and earnings
    // ---------------------------------------------------------

    useEffect(() => {
        dispatch(
            getPayments({
                page: 1,
                per_page: 10,
            })
        );

        dispatch(getEarnings());

        return () => {
            dispatch(clearSellerPaymentError());
        };
    }, [dispatch]);

    // ---------------------------------------------------------
    // Pagination
    // ---------------------------------------------------------

    const handlePageChange = (page) => {
        const currentPage = Number(
            pagination?.currentPage ?? 1
        );

        const lastPage = Number(
            pagination?.lastPage ?? 1
        );

        if (
            page < 1 ||
            page > lastPage ||
            page === currentPage
        ) {
            return;
        }

        dispatch(
            getPayments({
                page,
                per_page: pagination?.perPage || 10,
            })
        );
    };

    // ---------------------------------------------------------
    // Refresh
    // ---------------------------------------------------------

    const handleRefresh = () => {
        dispatch(
            getPayments({
                page: pagination?.currentPage || 1,
                per_page: pagination?.perPage || 10,
            })
        );

        dispatch(getEarnings());
    };

    // ---------------------------------------------------------
    // Render
    // ---------------------------------------------------------

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Payments & Earnings
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View customer payments and your seller
                        earnings.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={paymentsLoading}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg transition"
                    >
                        {paymentsLoading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <Link
                        to="/seller/dashboard"
                        className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(clearSellerPaymentError())
                        }
                        className="font-bold text-red-500 hover:text-red-700 text-xl"
                        aria-label="Close error"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* =================================================
                EARNINGS
            ================================================= */}

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Your Earnings
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Earnings shown here are calculated by the
                        Laravel backend.
                    </p>
                </div>

                <EarningsCard earnings={earnings} />
            </section>

            {/* =================================================
                PAYMENTS
            ================================================= */}

            <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Customer Payments
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Payments associated with your seller
                            store.
                        </p>
                    </div>

                    {Number(pagination?.total ?? 0) > 0 && (
                        <div className="text-sm text-gray-500">
                            Total Payments:{" "}
                            <span className="font-semibold text-gray-700">
                                {pagination.total}
                            </span>
                        </div>
                    )}
                </div>

                {/* =================================================
                    Loading
                ================================================= */}

                {paymentsLoading &&
                normalizedPayments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow border p-8">
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-12 bg-gray-200 rounded"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <PaymentTable
                            payments={normalizedPayments}
                        />

                        {/* =================================================
                            Pagination
                        ================================================= */}

                        {Number(
                            pagination?.lastPage ?? 1
                        ) > 1 && (
                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                                {/* Previous */}

                                <button
                                    type="button"
                                    disabled={
                                        Number(
                                            pagination?.currentPage ??
                                                1
                                        ) <= 1 ||
                                        paymentsLoading
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            Number(
                                                pagination?.currentPage ??
                                                    1
                                            ) - 1
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}

                                {Array.from(
                                    {
                                        length: Number(
                                            pagination?.lastPage ??
                                                1
                                        ),
                                    },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={paymentsLoading}
                                        onClick={() =>
                                            handlePageChange(page)
                                        }
                                        className={`min-w-10 px-3 py-2 rounded-lg border transition ${
                                            page ===
                                            Number(
                                                pagination?.currentPage ??
                                                    1
                                            )
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                {/* Next */}

                                <button
                                    type="button"
                                    disabled={
                                        Number(
                                            pagination?.currentPage ??
                                                1
                                        ) >=
                                            Number(
                                                pagination?.lastPage ??
                                                    1
                                            ) ||
                                        paymentsLoading
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            Number(
                                                pagination?.currentPage ??
                                                    1
                                            ) + 1
                                        )
                                    }
                                    className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!paymentsLoading &&
                !error &&
                normalizedPayments.length === 0 && (
                    <div className="bg-white rounded-xl shadow border p-10 text-center">
                        <div className="text-4xl mb-3">
                            💳
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700">
                            No Payments Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            No customer payment is currently
                            associated with your seller store.
                        </p>
                    </div>
                )}

            {/* =================================================
                SELLER INFORMATION
            ================================================= */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-800">
                    Seller Payment Information
                </h3>

                <p className="text-sm text-blue-700 mt-2">
                    Customer payments are shown for reference.
                    Your actual seller earnings and payout amounts
                    are calculated by the Laravel backend.
                </p>

                <p className="text-sm text-blue-700 mt-2">
                    Customer payment status and seller earning
                    status are separate. Seller accounts cannot
                    modify customer payment records.
                </p>
            </div>
        </div>
    );
};

export default Payments;


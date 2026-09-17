// src/components/Seller/Payments/EarningsCard.jsx

const EarningsCard = ({ earnings }) => {
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
    // Loading state
    // ---------------------------------------------------------

    if (!earnings) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
                    >
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                    </div>
                ))}
            </div>
        );
    }

    // ---------------------------------------------------------
    // Normalize backend response
    //
    // Supports:
    // earnings
    // earnings.data
    // earnings.earnings
    // earnings.data.earnings
    // ---------------------------------------------------------

    const normalizedEarnings =
        earnings?.data?.earnings ??
        earnings?.data ??
        earnings?.earnings ??
        earnings ??
        {};

    // ---------------------------------------------------------
    // Gross Sales
    // ---------------------------------------------------------

    const totalGrossSales = Number(
        normalizedEarnings?.gross_sales ??
            normalizedEarnings?.gross_earnings ??
            normalizedEarnings?.total_gross_sales ??
            0
    );

    // ---------------------------------------------------------
    // Marketplace Commission
    //
    // Vendor-owned product:
    //
    // Customer pays       = 100%
    // Admin commission    = 10%
    // Vendor earning     = 90%
    // ---------------------------------------------------------

    const marketplaceCommission = Number(
        normalizedEarnings?.marketplace_commission ??
            normalizedEarnings?.admin_commission ??
            normalizedEarnings?.total_admin_commission ??
            0
    );

    // ---------------------------------------------------------
    // Selling / Service Fees
    //
    // Admin-owned product:
    //
    // Customer pays       = 100%
    // Vendor fee          = 10%
    // Admin share         = 90%
    // ---------------------------------------------------------

    const sellingServiceFees = Number(
        normalizedEarnings?.vendor_selling_fees ??
            normalizedEarnings?.selling_service_fees ??
            normalizedEarnings?.total_vendor_selling_fees ??
            0
    );

    // ---------------------------------------------------------
    // Total Seller Earnings
    //
    // IMPORTANT:
    // Backend's authoritative key is vendor_earnings.
    //
    // Do NOT calculate this from payment.amount on frontend.
    // ---------------------------------------------------------

    const totalSellerEarnings = Number(
        normalizedEarnings?.vendor_earnings ??
            normalizedEarnings?.total_vendor_earnings ??
            normalizedEarnings?.total_vendor_net ??
            normalizedEarnings?.total_seller_earnings ??
            normalizedEarnings?.total_earnings ??
            0
    );

    // ---------------------------------------------------------
    // Paid Earnings
    //
    // This is NOT the same as customer payment status.
    //
    // Paid earnings means admin has actually paid the vendor.
    // ---------------------------------------------------------

    const paidEarnings = Number(
        normalizedEarnings?.paid_earnings ??
            normalizedEarnings?.paid_vendor_earnings ??
            normalizedEarnings?.paid_net ??
            0
    );

    // ---------------------------------------------------------
    // Pending Earnings
    //
    // Customer has paid, but seller payout is still pending.
    // ---------------------------------------------------------

    const pendingEarnings = Number(
        normalizedEarnings?.pending_earnings ??
            normalizedEarnings?.pending_vendor_earnings ??
            normalizedEarnings?.pending_net ??
            0
    );

    // ---------------------------------------------------------
    // Reversed Earnings
    //
    // Reversed earnings are displayed separately.
    // They should not inflate active seller earnings.
    // ---------------------------------------------------------

    const reversedEarnings = Number(
        normalizedEarnings?.reversed_earnings ??
            normalizedEarnings?.reversed_vendor_earnings ??
            normalizedEarnings?.reversed_net ??
            0
    );

    // ---------------------------------------------------------
    // Main cards
    // ---------------------------------------------------------

    const cards = [
        {
            title: "Total Seller Earnings",
            value: totalSellerEarnings,
            icon: "💰",
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            valueColor: "text-blue-700",
        },
        {
            title: "Paid Earnings",
            value: paidEarnings,
            icon: "✅",
            bg: "bg-green-50",
            iconBg: "bg-green-100",
            valueColor: "text-green-700",
        },
        {
            title: "Pending Earnings",
            value: pendingEarnings,
            icon: "⏳",
            bg: "bg-yellow-50",
            iconBg: "bg-yellow-100",
            valueColor: "text-yellow-700",
        },
        {
            title: "Reversed Earnings",
            value: reversedEarnings,
            icon: "↩️",
            bg: "bg-red-50",
            iconBg: "bg-red-100",
            valueColor: "text-red-700",
        },
    ];

    return (
        <div className="space-y-5">
            {/* =================================================
                Main Earnings Cards
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className={`${card.bg} rounded-xl shadow-sm p-6 border border-gray-100 transition hover:shadow-md`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm text-gray-500 font-medium">
                                    {card.title}
                                </p>

                                <h2
                                    className={`mt-2 text-2xl font-bold ${card.valueColor} break-words`}
                                >
                                    {formatCurrency(card.value)}
                                </h2>
                            </div>

                            <div
                                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${card.iconBg}`}
                            >
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* =================================================
                Sales / Accounting Breakdown
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* =================================================
                    Gross Sales
                ================================================= */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500 font-medium">
                        Gross Sales
                    </p>

                    <p className="text-xl font-bold text-gray-800 mt-2">
                        {formatCurrency(totalGrossSales)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Gross sales associated with products sold through
                        your store.
                    </p>
                </div>

                {/* =================================================
                    Marketplace Commission
                ================================================= */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500 font-medium">
                        Marketplace Commission
                    </p>

                    <p className="text-xl font-bold text-orange-600 mt-2">
                        {formatCurrency(marketplaceCommission)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Platform commission charged on vendor-owned
                        products.
                    </p>
                </div>

                {/* =================================================
                    Selling / Service Fees
                ================================================= */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500 font-medium">
                        Selling / Service Fees
                    </p>

                    <p className="text-xl font-bold text-purple-600 mt-2">
                        {formatCurrency(sellingServiceFees)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Your selling/service fee earned from admin-owned
                        products sold through your store.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EarningsCard;


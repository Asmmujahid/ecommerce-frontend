import React from "react";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const DashboardCards = ({ dashboard = {} }) => {
    /*
    |--------------------------------------------------------------------------
    | Helper
    |--------------------------------------------------------------------------
    */

    const getValue = (...values) => {
        for (const value of values) {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                return value;
            }
        }

        return 0;
    };

    /*
    |--------------------------------------------------------------------------
    | Dashboard cards
    |--------------------------------------------------------------------------
    */

    const cards = [
        {
            title: "Total Products",
            value: getValue(
                dashboard.total_products,
                dashboard.totalProducts
            ),
            icon: Inventory2Icon,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },

        {
            title: "Total Orders",
            value: getValue(
                dashboard.total_orders,
                dashboard.totalOrders
            ),
            icon: ShoppingCartIcon,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },

        {
            title: "Total Sales",
            value: getValue(
                dashboard.total_sales,
                dashboard.totalSales
            ),
            icon: AttachMoneyIcon,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            isCurrency: true,
        },

        {
            title: "Pending Orders",
            value: getValue(
                dashboard.pending_orders,
                dashboard.pendingOrders
            ),
            icon: PendingActionsIcon,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Currency formatter
    |--------------------------------------------------------------------------
    */

    const formatCurrency = (value) => {
        const number = Number(value);

        if (Number.isNaN(number)) {
            return "Rs. 0";
        }

        return `Rs. ${number.toLocaleString("en-PK")}`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition duration-300"
                    >
                        <div className="flex items-start justify-between">

                            {/* Text */}
                            <div className="min-w-0">

                                <p className="text-gray-500 text-sm font-medium">
                                    {card.title}
                                </p>

                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
                                    {card.isCurrency
                                        ? formatCurrency(card.value)
                                        : Number(card.value || 0).toLocaleString(
                                              "en-PK"
                                          )}
                                </h2>
                            </div>

                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center flex-shrink-0`}
                            >
                                <Icon fontSize="medium" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardCards;


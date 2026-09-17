import React, { useMemo } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const SalesChart = ({ monthlySales = [] }) => {
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    /*
    |--------------------------------------------------------------------------
    | Normalize monthly sales data
    |--------------------------------------------------------------------------
    */

    const chartData = useMemo(() => {
        let data = monthlySales;

        /*
        | Sometimes API returns:
        |
        | {
        |   data: [...]
        | }
        */

        if (
            data &&
            !Array.isArray(data) &&
            Array.isArray(data.data)
        ) {
            data = data.data;
        }

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .map((item, index) => {
                if (!item || typeof item !== "object") {
                    return null;
                }

                /*
                |--------------------------------------------------------------------------
                | Month
                |--------------------------------------------------------------------------
                */

                let month = "";

                if (item.month_name) {
                    month = item.month_name;
                } else if (item.monthName) {
                    month = item.monthName;
                } else if (
                    typeof item.month === "string" &&
                    Number.isNaN(Number(item.month))
                ) {
                    month = item.month;
                } else if (item.month !== undefined) {
                    const monthNumber = Number(item.month);

                    if (
                        monthNumber >= 1 &&
                        monthNumber <= 12
                    ) {
                        month = monthNames[monthNumber - 1];
                    }
                }

                if (!month) {
                    month = `Month ${index + 1}`;
                }

                /*
                |--------------------------------------------------------------------------
                | Sales
                |--------------------------------------------------------------------------
                */

                const salesValue =
                    item.total_sales ??
                    item.totalSales ??
                    item.sales ??
                    item.total ??
                    item.amount ??
                    0;

                return {
                    month,
                    sales: Number(salesValue) || 0,
                };
            })
            .filter(Boolean);
    }, [monthlySales]);

    /*
    |--------------------------------------------------------------------------
    | Currency formatter
    |--------------------------------------------------------------------------
    */

    const formatCurrency = (value) => {
        return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Empty state
    |--------------------------------------------------------------------------
    */

    if (chartData.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Monthly Sales
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Sales performance by month
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center h-[300px] sm:h-[350px] text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <span className="text-2xl">📊</span>
                    </div>

                    <p className="text-gray-500 font-medium">
                        No sales data available
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        Sales information will appear here when orders are placed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Monthly Sales
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Sales performance by month
                </p>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                                const number = Number(value);

                                if (number >= 1000000) {
                                    return `${number / 1000000}M`;
                                }

                                if (number >= 1000) {
                                    return `${number / 1000}K`;
                                }

                                return number;
                            }}
                        />

                        <Tooltip
                            formatter={(value) => [
                                formatCurrency(value),
                                "Sales",
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;


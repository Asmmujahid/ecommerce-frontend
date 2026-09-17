import { useSelector } from "react-redux";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const SalesChart = () => {

    const { monthlySales } = useSelector(
        (state) => state.adminDashboard
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Sales Overview
                </h2>

                <p className="text-sm text-gray-500">
                    Monthly Sales Report
                </p>
            </div>

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <LineChart data={monthlySales}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#2563eb"
                        strokeWidth={3}
                    />

                </LineChart>
            </ResponsiveContainer>

        </div>
    );
};

export default SalesChart;
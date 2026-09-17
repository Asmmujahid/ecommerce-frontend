import { useSelector } from "react-redux";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const RevenueChart = () => {

    const { monthlyRevenue } = useSelector(
        (state) => state.adminDashboard
    );

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Revenue Overview
                </h2>

                <p className="text-sm text-gray-500">
                    Monthly Revenue Report
                </p>
            </div>

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <BarChart data={monthlyRevenue}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="revenue"
                        fill="#16a34a"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default RevenueChart;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSellerDashboard } from "../../../redux/seller/sellerDashboardSlice";

import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";

const Dashboard = () => {
    const dispatch = useDispatch();

    const {
        dashboard,
        loading,
        error,
        message,
    } = useSelector((state) => state.sellerDashboard);

    useEffect(() => {
        dispatch(getSellerDashboard());
    }, [dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

                    <h2 className="text-lg font-semibold text-gray-700">
                        Loading Dashboard...
                    </h2>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
                    <h2 className="font-semibold text-lg mb-1">
                        Unable to load dashboard
                    </h2>

                    <p className="text-sm">
                        {message || "Something went wrong while loading the dashboard."}
                    </p>

                    <button
                        type="button"
                        onClick={() => dispatch(getSellerDashboard())}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Safe dashboard object
    |--------------------------------------------------------------------------
    */

    const data = dashboard || {};

    /*
    |--------------------------------------------------------------------------
    | Support different Laravel response names
    |--------------------------------------------------------------------------
    */

    const monthlySales =
        data.monthly_sales ??
        data.monthlySales ??
        data.sales ??
        [];

    const recentOrders =
        data.recent_orders ??
        data.recentOrders ??
        data.orders ??
        [];

    const topProducts =
        data.top_products ??
        data.topProducts ??
        data.top_selling_products ??
        data.topSellingProducts ??
        [];

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Seller Dashboard
                </h1>

                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Welcome back! Here's an overview of your store.
                </p>
            </div>

            {/* Dashboard Cards */}
            <DashboardCards dashboard={data} />

            {/* Monthly Sales */}
            <SalesChart monthlySales={monthlySales} />

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Recent Orders */}
                <RecentOrders orders={recentOrders} />

                {/* Top Selling Products */}
                <TopProducts products={topProducts} />

            </div>
        </div>
    );
};

export default Dashboard;


import React from "react";

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-56 bg-gray-300 rounded"></div>

                <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow p-6 border"
                    >
                        <div className="flex items-center justify-between">

                            <div className="space-y-3">

                                <div className="h-4 w-24 bg-gray-300 rounded"></div>

                                <div className="h-8 w-16 bg-gray-300 rounded"></div>

                            </div>

                            <div className="h-12 w-12 rounded-full bg-gray-300"></div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl shadow p-6 border">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

                    <div className="h-72 w-full bg-gray-200 rounded"></div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

                    <div className="h-72 w-full bg-gray-200 rounded"></div>
                </div>

            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {[...Array(2)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow p-6 border"
                    >
                        <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

                        {[...Array(5)].map((_, row) => (
                            <div
                                key={row}
                                className="flex items-center justify-between py-3 border-b last:border-none"
                            >
                                <div className="flex items-center gap-3">

                                    <div className="h-10 w-10 rounded-full bg-gray-300"></div>

                                    <div className="space-y-2">

                                        <div className="h-4 w-32 bg-gray-300 rounded"></div>

                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>

                                    </div>

                                </div>

                                <div className="h-5 w-20 bg-gray-300 rounded"></div>

                            </div>
                        ))}
                    </div>
                ))}

            </div>

        </div>
    );
};

export default DashboardSkeleton;
import React from "react";

const TopProducts = ({ products = [] }) => {
    /*
    |--------------------------------------------------------------------------
    | Normalize API response
    |--------------------------------------------------------------------------
    */

    let productList = products;

    if (
        productList &&
        !Array.isArray(productList) &&
        Array.isArray(productList.data)
    ) {
        productList = productList.data;
    }

    if (!Array.isArray(productList)) {
        productList = [];
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getProductId = (product) => {
        return (
            product?.product_id ??
            product?.productId ??
            product?.id ??
            product?.product?.id ??
            "-"
        );
    };

    const getProductName = (product) => {
        return (
            product?.product?.name ||
            product?.product_name ||
            product?.productName ||
            product?.name ||
            "Unknown Product"
        );
    };

    const getQuantity = (product) => {
        return (
            product?.total_quantity ??
            product?.totalQuantity ??
            product?.quantity ??
            product?.total_sold ??
            product?.totalSold ??
            0
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="border-b p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                    Top Selling Products
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Your best-performing products
                </p>
            </div>

            {/* Content */}
            <div className="p-5">

                {productList.length > 0 ? (
                    <div className="space-y-4">

                        {productList.map((product, index) => {
                            const productId = getProductId(product);
                            const quantity = getQuantity(product);

                            return (
                                <div
                                    key={`${productId}-${index}`}
                                    className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-4 min-w-0">

                                        {/* Ranking */}
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>

                                        {/* Product */}
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate">
                                                {getProductName(product)}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Product ID: {productId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-bold text-green-600">
                                            {Number(
                                                quantity || 0
                                            ).toLocaleString("en-PK")}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Sold
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <span className="text-2xl">📦</span>
                        </div>

                        <p className="text-gray-600 font-medium">
                            No top selling products found
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Your best-selling products will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopProducts;


// src/pages/seller/Customers/Customers.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCustomers,
    resetSellerCustomerState,
} from "../../../redux/seller/sellerCustomerSlice";

import CustomerTable from "./CustomerTable";

const Customers = () => {
    const dispatch = useDispatch();

    const {
        customers,
        loading,
        error,
    } = useSelector((state) => state.sellerCustomer);

    useEffect(() => {
        dispatch(getCustomers());

        return () => {
            dispatch(resetSellerCustomerState());
        };
    }, [dispatch]);

    return (
        <div className="p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Customers
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Customers who purchased your products.
                    </p>

                </div>

                <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow">

                    <p className="text-sm">
                        Total Customers
                    </p>

                    <h2 className="text-2xl font-bold">
                        {customers?.length || 0}
                    </h2>

                </div>

            </div>

            {/* Loading */}

            {loading && (

                <div className="bg-white rounded-xl shadow p-12 text-center">

                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading customers...
                    </p>

                </div>

            )}

            {/* Error */}

            {!loading && error && (

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 mb-6">

                    {error}

                </div>

            )}

            {/* Customer Table */}

            {!loading && !error && (

                <CustomerTable customers={customers} />

            )}

        </div>
    );
};

export default Customers;
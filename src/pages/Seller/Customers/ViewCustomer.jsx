// src/pages/seller/Customers/ViewCustomer.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
    getCustomer,
    clearCustomer,
} from "../../../redux/seller/sellerCustomerSlice";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
};

const ViewCustomer = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        customer,
        loading,
        error,
    } = useSelector((state) => state.sellerCustomer);

    useEffect(() => {
        dispatch(getCustomer(id));

        return () => {
            dispatch(clearCustomer());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-lg font-semibold">
                    Loading customer...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-6">
                Customer not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Customer Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Complete customer information
                    </p>

                </div>

                <Link
                    to="/seller/customers"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
                >
                    Back
                </Link>

            </div>

            {/* Customer */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold mb-5">
                    Customer Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                    <div>

                        <p className="text-gray-500">
                            Name
                        </p>

                        <p className="font-semibold">
                            {customer.name}
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Email
                        </p>

                        <p className="font-semibold">
                            {customer.email}
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Phone
                        </p>

                        <p className="font-semibold">
                            {customer.phone || "-"}
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Total Orders
                        </p>

                        <p className="font-semibold">
                            {customer.orders?.length || 0}
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Joined
                        </p>

                        <p className="font-semibold">
                            {new Date(
                                customer.created_at
                            ).toLocaleDateString()}
                        </p>

                    </div>

                </div>

            </div>

            {/* Addresses */}

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-xl font-bold mb-5">
                    Addresses
                </h2>

                {customer.addresses?.length > 0 ? (

                    <div className="grid md:grid-cols-2 gap-4">

                        {customer.addresses.map((address) => (

                            <div
                                key={address.id}
                                className="border rounded-lg p-4"
                            >

                                <p className="font-semibold">
                                    {address.full_name}
                                </p>

                                <p>
                                    {address.phone}
                                </p>

                                <p>
                                    {address.address}
                                </p>

                                <p>
                                    {address.city},
                                    {" "}
                                    {address.state}
                                </p>

                                <p>
                                    {address.country}
                                </p>

                                <p>
                                    {address.zip_code}
                                </p>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No addresses found.
                    </p>

                )}

            </div>

            {/* Orders */}

            <div className="bg-white rounded-xl shadow">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Orders
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Order #
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Total
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Payment
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {customer.orders?.length > 0 ? (

                                customer.orders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-4 font-semibold">
                                            {order.order_number}
                                        </td>

                                        <td className="px-4 py-4">
                                            Rs.
                                            {Number(
                                                order.total_amount
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-4 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    paymentColors[
                                                        order.payment_status
                                                    ] ||
                                                    "bg-gray-100"
                                                }`}
                                            >
                                                {order.payment_status}
                                            </span>

                                        </td>

                                        <td className="px-4 py-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    statusColors[
                                                        order.status
                                                    ] ||
                                                    "bg-gray-100"
                                                }`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>

                                        <td className="px-4 py-4">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No orders found.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ViewCustomer;
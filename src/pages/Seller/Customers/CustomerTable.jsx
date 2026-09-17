// src/pages/seller/Customers/CustomerTable.jsx

import { Link } from "react-router-dom";

const CustomerTable = ({ customers = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>

                            <th className="px-4 py-3 text-left">
                                Customer
                            </th>

                            <th className="px-4 py-3 text-left">
                                Email
                            </th>

                            <th className="px-4 py-3 text-left">
                                Phone
                            </th>

                            <th className="px-4 py-3 text-center">
                                Orders
                            </th>

                            <th className="px-4 py-3 text-center">
                                Joined
                            </th>

                            <th className="px-4 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    {/* Serial */}

                                    <td className="px-4 py-4">
                                        {index + 1}
                                    </td>

                                    {/* Customer */}

                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">
                                                {customer.name
                                                    ?.charAt(0)}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold">
                                                    {customer.name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    ID: {customer.id}
                                                </p>
                                            </div>

                                        </div>
                                    </td>

                                    {/* Email */}

                                    <td className="px-4 py-4">
                                        {customer.email}
                                    </td>

                                    {/* Phone */}

                                    <td className="px-4 py-4">
                                        {customer.phone || "-"}
                                    </td>

                                    {/* Orders */}

                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                            {customer.total_orders ?? 0}
                                        </span>
                                    </td>

                                    {/* Joined */}

                                    <td className="px-4 py-4 text-center">
                                        {customer.created_at
                                            ? new Date(
                                                  customer.created_at
                                              ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    {/* Action */}

                                    <td className="px-4 py-4 text-center">

                                        <Link
                                            to={`/seller/customers/${customer.id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            View
                                        </Link>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Customers Found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
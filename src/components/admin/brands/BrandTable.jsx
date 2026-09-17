import { Link } from "react-router-dom";

import {
    FaEye,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

const BrandTable = ({
    brands = [],
    onDelete,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    {/* Table Head */}
                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                #
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Logo
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Slug
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    {/* Table Body */}
                    <tbody>

                        {brands.length > 0 ? (

                            brands.map((brand, index) => (

                                <tr
                                    key={brand.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >

                                    {/* ID */}
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    {/* Logo */}
                                    <td className="px-6 py-4">

                                        {brand.logo ? (

                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="w-14 h-14 object-contain rounded border bg-white"
                                            />

                                        ) : (

                                            <div className="w-14 h-14 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                                No Logo
                                            </div>

                                        )}

                                    </td>

                                    {/* Name */}
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {brand.name}
                                    </td>

                                    {/* Slug */}
                                    <td className="px-6 py-4 text-gray-600">
                                        {brand.slug}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">

                                        {brand.status ? (

                                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                Active
                                            </span>

                                        ) : (

                                            <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                                Inactive
                                            </span>

                                        )}

                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">

                                        <div className="flex items-center justify-center gap-2">

                                            {/* View */}
                                            <Link
                                                to={`/admin/brands/view/${brand.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                                            >
                                                <FaEye />
                                            </Link>

                                            {/* Edit */}
                                            <Link
                                                to={`/admin/brands/edit/${brand.id}`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded transition"
                                            >
                                                <FaEdit />
                                            </Link>

                                            {/* Delete */}
                                            <button
                                                onClick={() => onDelete(brand.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="py-10 text-center text-gray-500"
                                >
                                    No Brands Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default BrandTable;
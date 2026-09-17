import { Link } from "react-router-dom";
import {
    FaEye,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import CategoryRow from "./CategoryRow";

const CategoryTable = ({
    categories = [],
    onDelete,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                #
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Image
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Slug
                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Description
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Status
                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {categories.length > 0 ? (
                            categories.map((category, index) => (

                                <tr
                                    key={category.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4">

                                        {category.image ? (

                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-14 h-14 rounded object-cover border"
                                            />

                                        ) : (

                                            <div className="w-14 h-14 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                                No Image
                                            </div>

                                        )}

                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                        {category.name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {category.slug}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                        {category.description || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-center">

                                        {category.status ? (

                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                                Active
                                            </span>

                                        ) : (

                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                                Inactive
                                            </span>

                                        )}

                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center justify-center gap-2">

                                           <Link
    to={`/admin/categories/${category.id}`}
    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
>
    <FaEye />
</Link>

                                            <Link
                                                 to={`/admin/categories/${category.id}/edit`}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                            >
                                                <FaEdit />
                                            </Link>

                                            <button
                                                onClick={() => onDelete(category.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
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
                                    colSpan="7"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Categories Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default CategoryTable;
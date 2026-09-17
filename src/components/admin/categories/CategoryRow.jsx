import { Link } from "react-router-dom";
import {
    FaEye,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

const CategoryRow = ({
    category,
    index,
    onDelete,
}) => {
    return (
        <tr className="border-b hover:bg-gray-50 transition">

            <td className="px-6 py-4">
                {index + 1}
            </td>

            <td className="px-6 py-4">

                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-14 h-14 rounded-lg object-cover border"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        No Image
                    </div>
                )}

            </td>

            <td className="px-6 py-4">
                <div>
                    <h3 className="font-semibold text-gray-800">
                        {category.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {category.slug}
                    </p>
                </div>
            </td>

            <td className="px-6 py-4 text-gray-600 max-w-xs">
                <p className="truncate">
                    {category.description || "-"}
                </p>
            </td>

            <td className="px-6 py-4 text-center">

                {category.status ? (
                    <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                        Inactive
                    </span>
                )}

            </td>

            <td className="px-6 py-4">
                <div className="flex justify-center gap-2">

                    <Link
                        to={`/admin/categories/view/${category.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                    >
                        <FaEye />
                    </Link>

                    <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                    >
                        <FaEdit />
                    </Link>

                    <button
                        onClick={() => onDelete(category.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                    >
                        <FaTrash />
                    </button>

                </div>
            </td>

        </tr>
    );
};

export default CategoryRow;
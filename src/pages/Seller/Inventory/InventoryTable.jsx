// src/pages/seller/Inventory/InventoryTable.jsx

import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const InventoryTable = ({
    inventories = [],
    onDelete,
}) => {
    if (inventories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
               <Inventory2OutlinedIcon
    sx={{
        fontSize: 60,
        color: "#d1d5db",
        marginBottom: "16px",
    }}
/>

                <h2 className="text-xl font-semibold text-gray-700">
                    No Inventory Found
                </h2>

                <p className="text-gray-500 mt-2">
                    Inventory records will appear here.
                </p>

                <Link
                    to="/seller/inventory/create"
                    className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                    Add Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            {/* Header */}

            <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold">
                    Inventory Records
                </h2>
            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-5 py-3 text-left">
                                #
                            </th>

                            <th className="px-5 py-3 text-left">
                                Product
                            </th>

                            <th className="px-5 py-3 text-left">
                                Variant
                            </th>

                            <th className="px-5 py-3 text-center">
                                Quantity
                            </th>

                            <th className="px-5 py-3 text-center">
                                Type
                            </th>

                            <th className="px-5 py-3">
                                Note
                            </th>

                            <th className="px-5 py-3">
                                Date
                            </th>

                            <th className="px-5 py-3 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {inventories.map((inventory, index) => (

                            <tr
                                key={inventory.id}
                                className="border-b hover:bg-gray-50"
                            >

                                {/* Number */}

                                <td className="px-5 py-4">
                                    {index + 1}
                                </td>

                                {/* Product */}

                                <td className="px-5 py-4 font-medium">
                                    {inventory.product?.name || "-"}
                                </td>

                                {/* Variant */}

                                <td className="px-5 py-4">

                                    {inventory.product_variant ? (
                                        <div>

                                            <div>
                                                SKU :
                                                {" "}
                                                {inventory.product_variant.sku}
                                            </div>

                                            <div className="text-sm text-gray-500">

                                                {inventory.product_variant.size &&
                                                    `Size: ${inventory.product_variant.size}`}

                                                {inventory.product_variant.color &&
                                                    ` | Color: ${inventory.product_variant.color}`}

                                            </div>

                                        </div>
                                    ) : (
                                        "-"
                                    )}

                                </td>

                                {/* Quantity */}

                                <td className="px-5 py-4 text-center font-semibold">
                                    {inventory.quantity}
                                </td>

                                {/* Type */}

                                <td className="px-5 py-4 text-center">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            inventory.type === "in"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {inventory.type.toUpperCase()}
                                    </span>

                                </td>

                                {/* Note */}

                                <td className="px-5 py-4">
                                    {inventory.note || "-"}
                                </td>

                                {/* Date */}

                                <td className="px-5 py-4">
                                    {new Date(
                                        inventory.created_at
                                    ).toLocaleDateString()}
                                </td>

                                {/* Actions */}

                                <td className="px-5 py-4">

                                    <div className="flex justify-center gap-2">

                                        <Link
                                            to={`/seller/inventory/view/${inventory.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                            title="View"
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </Link>

                                        <Link
                                            to={`/seller/inventory/edit/${inventory.id}`}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                            title="Edit"
                                        >
                                           <EditIcon />
                                        </Link>

                                        <button
                                            onClick={() =>
                                                onDelete(inventory.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                            title="Delete"
                                        >
                                           <DeleteIcon />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default InventoryTable;
import { Link } from "react-router-dom";

import {
    FaEye,
    FaEdit,
    FaTrash,
} from "react-icons/fa";


const ProductTable = ({
    products = [],
    onDelete,
}) => {

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-4 py-3 text-left">
                                #
                            </th>

                            <th className="px-4 py-3 text-left">
                                Image
                            </th>

                            <th className="px-4 py-3 text-left">
                                Product
                            </th>

                            <th className="px-4 py-3 text-left">
                                SKU
                            </th>

                            <th className="px-4 py-3 text-left">
                                Ownership
                            </th>

                            <th className="px-4 py-3 text-left">
                                Vendor Store
                            </th>

                            <th className="px-4 py-3 text-left">
                                Category
                            </th>

                            <th className="px-4 py-3 text-left">
                                Brand
                            </th>

                            <th className="px-4 py-3 text-center">
                                Price
                            </th>

                            <th className="px-4 py-3 text-center">
                                Discount
                            </th>

                            <th className="px-4 py-3 text-center">
                                Stock
                            </th>

                            <th className="px-4 py-3 text-center">
                                Status
                            </th>

                            <th className="px-4 py-3 text-center">
                                Featured
                            </th>

                            <th className="px-4 py-3 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {products.length > 0 ? (

                            products.map(
                                (product, index) => {

                                    const ownerType =
                                        product.owner_type;


                                    return (

                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            {/* # */}

                                            <td className="px-4 py-4">
                                                {index + 1}
                                            </td>


                                            {/* Image */}

                                            <td className="px-4 py-4">

                                                {product.thumbnail ? (

                                                    <img
                                                        src={
                                                            product.thumbnail
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="w-16 h-16 rounded object-cover border"
                                                    />

                                                ) : (

                                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                        No Image
                                                    </div>

                                                )}

                                            </td>


                                            {/* Product */}

                                            <td className="px-4 py-4">

                                                <div className="font-semibold">
                                                    {product.name}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    ID #{product.id}
                                                </div>

                                            </td>


                                            {/* SKU */}

                                            <td className="px-4 py-4">
                                                {product.sku || "-"}
                                            </td>


                                            {/* Ownership */}

                                            <td className="px-4 py-4">

                                                {ownerType === "admin" ? (

                                                    <span className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                                                        Admin Owned
                                                    </span>

                                                ) : ownerType === "vendor" ? (

                                                    <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                                        Vendor Owned
                                                    </span>

                                                ) : (

                                                    <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm">
                                                        Unknown
                                                    </span>

                                                )}

                                            </td>


                                            {/* Vendor Store */}

                                            <td className="px-4 py-4">

                                                {product.vendor?.store_name ||
                                                    product.vendor?.name ||
                                                    "-"}

                                            </td>


                                            {/* Category */}

                                            <td className="px-4 py-4">
                                                {product.category?.name ||
                                                    "-"}
                                            </td>


                                            {/* Brand */}

                                            <td className="px-4 py-4">
                                                {product.brand?.name ||
                                                    "-"}
                                            </td>


                                            {/* Price */}

                                            <td className="px-4 py-4 text-center font-semibold">

                                                $
                                                {Number(
                                                    product.price || 0
                                                ).toFixed(2)}

                                            </td>


                                            {/* Discount */}

                                            <td className="px-4 py-4 text-center">

                                                {product.discount_price ? (

                                                    <span className="text-green-600 font-semibold">

                                                        $
                                                        {Number(
                                                            product.discount_price
                                                        ).toFixed(2)}

                                                    </span>

                                                ) : (

                                                    "-"

                                                )}

                                            </td>


                                            {/* Stock */}

                                            <td className="px-4 py-4 text-center">

                                                {Number(product.stock) > 10 ? (

                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                                        {product.stock}
                                                    </span>

                                                ) : Number(product.stock) > 0 ? (

                                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                                                        {product.stock}
                                                    </span>

                                                ) : (

                                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                                        Out
                                                    </span>

                                                )}

                                            </td>


                                            {/* Status */}

                                            <td className="px-4 py-4 text-center">

                                                {product.status ? (

                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                                        Active
                                                    </span>

                                                ) : (

                                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                                                        Inactive
                                                    </span>

                                                )}

                                            </td>


                                            {/* Featured */}

                                            <td className="px-4 py-4 text-center">

                                                {product.featured ? (

                                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                                                        Yes
                                                    </span>

                                                ) : (

                                                    <span className="text-gray-400">
                                                        No
                                                    </span>

                                                )}

                                            </td>


                                            {/* Actions */}

                                            <td className="px-4 py-4">

                                                <div className="flex justify-center gap-2">

                                                    <Link
                                                        to={`/admin/products/view/${product.id}`}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                                        title="View Product"
                                                    >
                                                        <FaEye />
                                                    </Link>


                                                    <Link
                                                        to={`/admin/products/edit/${product.id}`}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                                                        title="Edit Product"
                                                    >
                                                        <FaEdit />
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDelete(
                                                                product.id
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                                                        title="Delete Product"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                }

                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan={14}
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Products Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};


export default ProductTable;


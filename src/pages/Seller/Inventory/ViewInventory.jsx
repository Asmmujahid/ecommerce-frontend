// src/pages/seller/Inventory/ViewInventory.jsx

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getSellerInventory,
    clearSellerInventory,
} from "../../../redux/seller/sellerInventorySlice";

const ViewInventory = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        inventory,
        loading,
        error,
        message,
    } = useSelector((state) => state.sellerInventory);

    useEffect(() => {
        dispatch(getSellerInventory(id));

        return () => {
            dispatch(clearSellerInventory());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    Loading Inventory...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {message}
                </div>
            </div>
        );
    }

    if (!inventory) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    Inventory not found.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Inventory Details
                    </h1>

                    <p className="text-gray-500">
                        View inventory record information.
                    </p>
                </div>

                <div className="flex gap-3">

                    <Link
                        to="/seller/inventory"
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                        Back
                    </Link>

                    <Link
                        to={`/seller/inventory/edit/${inventory.id}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Edit
                    </Link>

                </div>

            </div>

            {/* Card */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="text-gray-500 text-sm">
                            Inventory ID
                        </label>

                        <p className="font-semibold mt-1">
                            #{inventory.id}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Product
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.product?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Product SKU
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.product?.sku || "-"}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Variant
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.product_variant
                                ? inventory.product_variant.sku
                                : "No Variant"}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Quantity
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.quantity}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Movement
                        </label>

                        <div className="mt-1">

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    inventory.type === "in"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {inventory.type.toUpperCase()}
                            </span>

                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Current Product Stock
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.product?.stock}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Variant Stock
                        </label>

                        <p className="font-semibold mt-1">
                            {inventory.product_variant?.stock ??
                                "-"}
                        </p>
                    </div>

                    <div className="md:col-span-2">

                        <label className="text-gray-500 text-sm">
                            Note
                        </label>

                        <div className="mt-2 p-4 rounded-lg bg-gray-50 border">
                            {inventory.note || "No note available"}
                        </div>

                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Created At
                        </label>

                        <p className="font-semibold mt-1">
                            {new Date(
                                inventory.created_at
                            ).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">
                            Updated At
                        </label>

                        <p className="font-semibold mt-1">
                            {new Date(
                                inventory.updated_at
                            ).toLocaleString()}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewInventory;
// src/dashboard/seller/Inventory/Inventory.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getSellerInventories,
    deleteSellerInventory,
} from "../../../redux/seller/sellerInventorySlice";

import InventoryTable from "./InventoryTable";

const Inventory = () => {
    const dispatch = useDispatch();

    const {
        inventories,
        loading,
        error,
        message,
    } = useSelector((state) => state.sellerInventory);

    useEffect(() => {
        dispatch(getSellerInventories());
    }, [dispatch]);

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this inventory record?"
        );

        if (!confirmed) return;

        dispatch(deleteSellerInventory(id));
    };

    return (
        <div className="p-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Inventory Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your product inventory.
                    </p>
                </div>

              <Link
    to="/seller/inventory/create"
    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
>
    + Add Inventory
</Link>

            </div>

            {/* Loading */}

            {loading && (
                <div className="bg-white rounded-xl shadow p-10 text-center">

                    <div className="text-lg font-semibold">
                        Loading inventory...
                    </div>

                </div>
            )}

            {/* Error */}

            {!loading && error && (
                <div className="bg-red-100 text-red-700 rounded-lg p-4 mb-6">
                    {message}
                </div>
            )}

            {/* Inventory Table */}

            {!loading && !error && (
                <InventoryTable
                    inventories={inventories}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
};

export default Inventory;
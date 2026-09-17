// src/pages/seller/Inventory/EditInventory.jsx

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getSellerInventory,
    updateSellerInventory,
    clearSellerInventory,
} from "../../../redux/seller/sellerInventorySlice";

import {
    getProducts,
    getProduct,
} from "../../../redux/seller/sellerProductSlice";

import InventoryForm from "./InventoryForm";

const EditInventory = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        inventory,
        loading,
        error,
        message,
    } = useSelector((state) => state.sellerInventory);

    const { products } = useSelector(
        (state) => state.sellerProducts
    );

    useEffect(() => {
        dispatch(getSellerInventory(id));
          dispatch(getProducts());

        return () => {
            dispatch(clearSellerInventory());
        };
    }, [dispatch, id]);

    const handleUpdate = async (formData) => {
        const result = await dispatch(
            updateSellerInventory({
                id,
                data: formData,
            })
        );

        if (
            updateSellerInventory.fulfilled.match(result)
        ) {
            alert("Inventory updated successfully.");

            navigate("/seller/inventory");
        }
    };

    if (loading && !inventory) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    Loading inventory...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-700 rounded-lg p-4">
                    {message}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold">
                    Edit Inventory
                </h1>

                <p className="text-gray-500">
                    Update inventory record.
                </p>

            </div>

            <InventoryForm
                initialValues={inventory}
                products={products}
                loading={loading}
                onSubmit={handleUpdate}
            />

        </div>
    );
};

export default EditInventory;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import InventoryForm from "./InventoryForm";

import {
    createSellerInventory,
} from "../../../redux/seller/sellerInventorySlice";

import { getProducts } from "../../../redux/seller/sellerProductSlice";

const CreateInventory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector(
        (state) => state.sellerInventory
    );

    const { products } = useSelector(
        (state) => state.sellerProducts
    );

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleSubmit = async (data) => {

        const result = await dispatch(
            createSellerInventory(data)
        );

        if (createSellerInventory.fulfilled.match(result)) {

            alert("Inventory created successfully.");

            navigate("/seller/inventory");
        }
    };

    return (
        <div className="p-6">

            <div className="mb-6">

                <h1 className="text-3xl font-bold">
                    Create Inventory
                </h1>

                <p className="text-gray-500">
                    Add new inventory record.
                </p>

            </div>

            <InventoryForm
                products={products}
                loading={loading}
                onSubmit={handleSubmit}
            />

        </div>
    );
};

export default CreateInventory;
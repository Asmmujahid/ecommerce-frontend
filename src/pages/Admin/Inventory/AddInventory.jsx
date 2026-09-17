import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import {
    createInventory,
    clearInventoryError,
} from "../../../redux/admin/inventorySlice";

import InventoryForm from "../../../components/admin/inventory/InventoryForm";

const AddInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error,
    } = useSelector(
        (state) => state.adminInventory
    );

    const [formData, setFormData] = useState({
        product_id: "",
        product_variant_id: "",
        quantity: "",
        type: "in",
        note: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                createInventory({
                    product_id: formData.product_id || null,
                    product_variant_id:
                        formData.product_variant_id || null,
                    quantity: Number(formData.quantity),
                    type: formData.type,
                    note: formData.note,
                })
            ).unwrap();

            navigate("/admin/inventory");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box>

            <Typography
                variant="h4"
                mb={3}
            >
                Add Inventory
            </Typography>

            <Card>

                <CardContent>

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() =>
                                dispatch(clearInventoryError())
                            }
                        >
                            {error}
                        </Alert>

                    )}

                    {loading ? (

                        <Box
                            display="flex"
                            justifyContent="center"
                            py={5}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                       <InventoryForm
    formData={formData}
    setFormData={setFormData}
    onSubmit={handleSubmit}
    loading={loading}
/>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
};

export default AddInventory;
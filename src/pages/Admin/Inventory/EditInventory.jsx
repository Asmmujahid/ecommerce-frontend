import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import {
    getInventory,
    updateInventory,
    clearInventoryError,
    resetInventory,
} from "../../../redux/admin/inventorySlice";

import InventoryForm from "../../../components/admin/inventory/InventoryForm";

const EditInventory = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        inventory,
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

    // Load Inventory
    useEffect(() => {
        dispatch(getInventory(id));

        return () => {
            dispatch(resetInventory());
        };
    }, [dispatch, id]);

    // Fill Form
    useEffect(() => {
        if (inventory) {
            setFormData({
                product_id: inventory.product_id || "",
                product_variant_id:
                    inventory.product_variant_id || "",
                quantity: inventory.quantity || "",
                type: inventory.type || "in",
                note: inventory.note || "",
            });
        }
    }, [inventory]);

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                updateInventory({
                    id,
                    data: {
                        quantity: Number(formData.quantity),
                        type: formData.type,
                        note: formData.note,
                    },
                })
            ).unwrap();

            navigate("/admin/inventory");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && !inventory) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>

            <Typography
                variant="h4"
                mb={3}
            >
                Edit Inventory
            </Typography>

            <Card>

                <CardContent>

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() =>
                                dispatch(
                                    clearInventoryError()
                                )
                            }
                        >
                            {error}
                        </Alert>

                    )}

                    <InventoryForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        loading={loading}
                        isEdit={true}
                    />

                </CardContent>

            </Card>

        </Box>
    );
};

export default EditInventory;
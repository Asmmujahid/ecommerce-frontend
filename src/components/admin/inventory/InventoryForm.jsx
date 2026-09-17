import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import { getProducts } from "../../../redux/admin/productSlice";

const InventoryForm = ({
    formData,
    setFormData,
    onSubmit,
    loading,
    isEdit = false,
}) => {
    const dispatch = useDispatch();

    const {
        products,
        loading: productsLoading,
    } = useSelector((state) => state.adminProduct);

    useEffect(() => {
        if (!products.length) {
            dispatch(getProducts());
        }
    }, [dispatch, products.length]);

    // Selected Product
    const selectedProduct = useMemo(() => {
        return (
            products.find(
                (product) =>
                    Number(product.id) === Number(formData.product_id)
            ) || null
        );
    }, [products, formData.product_id]);

    // Variants
    const variants = selectedProduct?.variants || [];

    // Selected Variant
    const selectedVariant = useMemo(() => {
        return (
            variants.find(
                (variant) =>
                    Number(variant.id) ===
                    Number(formData.product_variant_id)
            ) || null
        );
    }, [variants, formData.product_variant_id]);

    // Reset Variant when Product changes
    useEffect(() => {
        if (!isEdit) {
            setFormData((prev) => ({
                ...prev,
                product_variant_id:
                    selectedProduct?.id ===
                    Number(prev.product_id)
                        ? prev.product_variant_id
                        : "",
            }));
        }
    }, [selectedProduct, isEdit, setFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "product_id") {
            setFormData((prev) => ({
                ...prev,
                product_id: value,
                product_variant_id: "",
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
        >
            <Stack spacing={3}>
                {productsLoading && (
                    <Box textAlign="center">
                        <CircularProgress />
                    </Box>
                )}

                {/* Product */}

                <TextField
                    select
                    fullWidth
                    required
                    name="product_id"
                    label="Product"
                    value={formData.product_id}
                    onChange={handleChange}
                    disabled={isEdit}
                >
                    <MenuItem value="">
                        Select Product
                    </MenuItem>

                    {products.map((product) => (
                        <MenuItem
                            key={product.id}
                            value={product.id}
                        >
                            {product.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Product Stock */}

                {selectedProduct && (
                    <Alert severity="info">
                        Product Stock:
                        <strong>
                            {" "}
                            {selectedProduct.stock}
                        </strong>
                    </Alert>
                )}

                {/* Variant */}

                <TextField
                    select
                    fullWidth
                    name="product_variant_id"
                    label="Variant"
                    value={formData.product_variant_id}
                    onChange={handleChange}
                    disabled={
                        isEdit || !selectedProduct
                    }
                >
                    <MenuItem value="">
                        No Variant
                    </MenuItem>

                    {variants.map((variant) => (
                        <MenuItem
                            key={variant.id}
                            value={variant.id}
                        >
                            {variant.size} /{" "}
                            {variant.color}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Variant Stock */}

                {selectedVariant && (
                    <Alert severity="success">
                        Variant Stock:
                        <strong>
                            {" "}
                            {selectedVariant.stock}
                        </strong>
                    </Alert>
                )}

                {/* No Variants */}

                {selectedProduct &&
                    variants.length === 0 && (
                        <Alert severity="warning">
                            This product has no
                            variants.
                        </Alert>
                    )}

                {/* Quantity */}

                <TextField
                    fullWidth
                    required
                    type="number"
                    name="quantity"
                    label="Quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    inputProps={{
                        min: 1,
                    }}
                />

                {/* Type */}

                <TextField
                    select
                    fullWidth
                    required
                    name="type"
                    label="Stock Movement"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <MenuItem value="in">
                        Stock IN
                    </MenuItem>

                    <MenuItem value="out">
                        Stock OUT
                    </MenuItem>
                </TextField>

                {/* Note */}

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="note"
                    label="Note"
                    value={formData.note}
                    onChange={handleChange}
                />

                {/* Product Summary */}

                {selectedProduct && (
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor: "background.paper",
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Product Summary
                        </Typography>

                        <Typography>
                            <strong>
                                Product:
                            </strong>{" "}
                            {selectedProduct.name}
                        </Typography>

                        <Typography>
                            <strong>SKU:</strong>{" "}
                            {selectedProduct.sku}
                        </Typography>

                        <Typography>
                            <strong>
                                Product Stock:
                            </strong>{" "}
                            {selectedProduct.stock}
                        </Typography>

                        {selectedVariant && (
                            <>
                                <Typography>
                                    <strong>
                                        Size:
                                    </strong>{" "}
                                    {
                                        selectedVariant.size
                                    }
                                </Typography>

                                <Typography>
                                    <strong>
                                        Color:
                                    </strong>{" "}
                                    {
                                        selectedVariant.color
                                    }
                                </Typography>

                                <Typography>
                                    <strong>
                                        Variant Stock:
                                    </strong>{" "}
                                    {
                                        selectedVariant.stock
                                    }
                                </Typography>
                            </>
                        )}
                    </Box>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={
                        loading ||
                        productsLoading
                    }
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                        ? "Update Inventory"
                        : "Save Inventory"}
                </Button>
            </Stack>
        </Box>
    );
};

export default InventoryForm;
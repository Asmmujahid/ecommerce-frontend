// src/pages/seller/Inventory/InventoryForm.jsx

import { useEffect, useState } from "react";

const InventoryForm = ({
    initialValues = null,
    products = [],
    loading = false,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        product_id: "",
        product_variant_id: "",
        quantity: "",
        type: "in",
        note: "",
    });

    useEffect(() => {
        if (initialValues) {
            setFormData({
                product_id: initialValues.product_id || "",
                product_variant_id:
                    initialValues.product_variant_id || "",
                quantity: initialValues.quantity || "",
                type: initialValues.type || "in",
                note: initialValues.note || "",
            });
        }
    }, [initialValues]);

    const selectedProduct = products.find(
        (product) =>
            Number(product.id) === Number(formData.product_id)
    );

    const variants = selectedProduct?.variants || [];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit({
                ...formData,
                quantity: Number(formData.quantity),
                product_variant_id:
                    formData.product_variant_id || null,
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 space-y-6"
        >
            <h2 className="text-2xl font-bold">
                {initialValues
                    ? "Edit Inventory"
                    : "Create Inventory"}
            </h2>

            {/* Product */}

            <div>
                <label className="block mb-2 font-medium">
                    Product
                </label>

                <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-3"
                >
                    <option value="">
                        Select Product
                    </option>

                    {products.map((product) => (
                        <option
                            key={product.id}
                            value={product.id}
                        >
                            {product.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Variant */}

            <div>
                <label className="block mb-2 font-medium">
                    Variant
                </label>

                <select
                    name="product_variant_id"
                    value={formData.product_variant_id}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="">
                        No Variant
                    </option>

                    {variants.map((variant) => (
                        <option
                            key={variant.id}
                            value={variant.id}
                        >
                            {variant.sku}
                            {variant.size &&
                                ` | Size: ${variant.size}`}
                            {variant.color &&
                                ` | Color: ${variant.color}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quantity */}

            <div>
                <label className="block mb-2 font-medium">
                    Quantity
                </label>

                <input
                    type="number"
                    min="1"
                    required
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Type */}

            <div>
                <label className="block mb-2 font-medium">
                    Inventory Type
                </label>

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="in">
                        Stock In
                    </option>

                    <option value="out">
                        Stock Out
                    </option>
                </select>
            </div>

            {/* Note */}

            <div>
                <label className="block mb-2 font-medium">
                    Note
                </label>

                <textarea
                    rows="4"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Submit */}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 disabled:opacity-50"
            >
                {loading
                    ? "Saving..."
                    : initialValues
                    ? "Update Inventory"
                    : "Create Inventory"}
            </button>
        </form>
    );
};

export default InventoryForm;
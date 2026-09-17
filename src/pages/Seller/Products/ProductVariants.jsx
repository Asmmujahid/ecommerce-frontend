import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import sellerProductService from "../../../Services/seller/sellerProductService";

const initialForm = {
    sku: "",
    size: "",
    color: "",
    price: "",
    stock: "",
};

const ProductVariants = () => {
    const { id } = useParams();

    const [variants, setVariants] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState(
        initialForm
    );

    /*
    |--------------------------------------------------------------------------
    | Load Variants
    |--------------------------------------------------------------------------
    */

    const loadVariants = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError("");

            const response =
                await sellerProductService.getProductVariants(
                    id
                );

            setVariants(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Load variants error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load variants."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVariants();
    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | Input
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            ...initialForm,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    const createVariant = async () => {
        try {
            setSaving(true);
            setError("");

            await sellerProductService.createVariant(
                id,
                {
                    sku: formData.sku.trim(),
                    size: formData.size.trim() || null,
                    color: formData.color.trim() || null,
                    price:
                        formData.price === ""
                            ? null
                            : Number(formData.price),
                    stock:
                        formData.stock === ""
                            ? 0
                            : Number(formData.stock),
                }
            );

            await loadVariants();

            resetForm();

            alert(
                "Variant created successfully."
            );
        } catch (err) {
            console.error(
                "Create variant error:",
                err
            );

            const message =
                err.response?.data?.message ||
                "Failed to create variant.";

            setError(message);
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const updateVariant = async () => {
        if (!editingId) return;

        try {
            setSaving(true);
            setError("");

            await sellerProductService.updateVariant(
                editingId,
                {
                    sku: formData.sku.trim(),
                    size: formData.size.trim() || null,
                    color: formData.color.trim() || null,
                    price:
                        formData.price === ""
                            ? null
                            : Number(formData.price),
                    stock:
                        formData.stock === ""
                            ? 0
                            : Number(formData.stock),
                }
            );

            await loadVariants();

            resetForm();

            alert(
                "Variant updated successfully."
            );
        } catch (err) {
            console.error(
                "Update variant error:",
                err
            );

            const message =
                err.response?.data?.message ||
                "Failed to update variant.";

            setError(message);
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const deleteVariant = async (variantId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this variant?"
        );

        if (!confirmed) return;

        try {
            setSaving(true);
            setError("");

            await sellerProductService.deleteVariant(
                variantId
            );

            await loadVariants();

            if (
                Number(editingId) ===
                Number(variantId)
            ) {
                resetForm();
            }
        } catch (err) {
            console.error(
                "Delete variant error:",
                err
            );

            const message =
                err.response?.data?.message ||
                "Failed to delete variant.";

            setError(message);
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const editVariant = (variant) => {
        setEditingId(variant.id);

        setFormData({
            sku: variant.sku || "",
            size: variant.size || "",
            color: variant.color || "",
            price:
                variant.price !== null &&
                variant.price !== undefined
                    ? variant.price
                    : "",
            stock:
                variant.stock !== null &&
                variant.stock !== undefined
                    ? variant.stock
                    : "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.sku.trim()) {
            setError("SKU is required.");
            return;
        }

        if (
            formData.price !== "" &&
            Number(formData.price) < 0
        ) {
            setError(
                "Price cannot be negative."
            );
            return;
        }

        if (
            formData.stock !== "" &&
            Number(formData.stock) < 0
        ) {
            setError(
                "Stock cannot be negative."
            );
            return;
        }

        if (editingId) {
            await updateVariant();
        } else {
            await createVariant();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-500">
                Loading variants...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold mb-6">
                Product Variants
            </h2>

            {/* Error */}

            {error && (
                <div className="mb-5 bg-red-100 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="border rounded-xl p-5 mb-8"
            >

                <h3 className="text-lg font-semibold mb-4">

                    {editingId
                        ? "Update Variant"
                        : "Create Variant"}

                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                    {/* SKU */}

                    <input
                        type="text"
                        name="sku"
                        placeholder="SKU"
                        value={formData.sku}
                        onChange={handleChange}
                        disabled={saving}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Size */}

                    <input
                        type="text"
                        name="size"
                        placeholder="Size"
                        value={formData.size}
                        onChange={handleChange}
                        disabled={saving}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Color */}

                    <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        value={formData.color}
                        onChange={handleChange}
                        disabled={saving}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Price */}

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        disabled={saving}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Stock */}

                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        disabled={saving}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                {/* Buttons */}

                <div className="mt-5 flex gap-3">

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                            ? "Update Variant"
                            : "Create Variant"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </form>

            {/* Table */}

            {variants.length === 0 ? (

                <div className="border rounded-xl py-12 text-center text-gray-500">
                    No variants found.
                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="min-w-full border">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    ID
                                </th>

                                <th className="px-4 py-3 text-left">
                                    SKU
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Size
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Color
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Price
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Stock
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {variants.map(
                                (variant) => (
                                    <tr
                                        key={variant.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="px-4 py-3">
                                            #{variant.id}
                                        </td>

                                        <td className="px-4 py-3">
                                            {variant.sku ||
                                                "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {variant.size ||
                                                "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {variant.color ||
                                                "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {variant.price !==
                                            null &&
                                            variant.price !==
                                                undefined
                                                ? `Rs. ${Number(
                                                      variant.price
                                                  ).toLocaleString()}`
                                                : "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {variant.stock ??
                                                0}
                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editVariant(
                                                        variant
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteVariant(
                                                        variant.id
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};

export default ProductVariants;


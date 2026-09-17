import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import sellerProductService from "../../../Services/seller/sellerProductService";

const ProductImages = () => {
    const { id } = useParams();

    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [imageUrl, setImageUrl] = useState("");

    const [preview, setPreview] = useState("");

    const [editingId, setEditingId] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Images
    |--------------------------------------------------------------------------
    */

    const loadImages = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError("");

            const response =
                await sellerProductService.getProductImages(
                    id
                );

            setImages(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );
        } catch (err) {
            console.error(
                "Load images error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load product images."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | Input
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (event) => {
        const value = event.target.value;

        setImageUrl(value);
        setPreview(value);
    };

    /*
    |--------------------------------------------------------------------------
    | Upload
    |--------------------------------------------------------------------------
    */

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!imageUrl.trim()) {
            alert("Please enter an image URL.");
            return;
        }

        try {
            setSaving(true);

            await sellerProductService.uploadProductImage(
                id,
                {
                    image: imageUrl.trim(),
                }
            );

            setImageUrl("");
            setPreview("");

            await loadImages();
        } catch (err) {
            console.error(
                "Upload image error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to upload image."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async (imageId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) return;

        try {
            setSaving(true);

            await sellerProductService.deleteProductImage(
                id,
                imageId
            );

            await loadImages();
        } catch (err) {
            console.error(
                "Delete image error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to delete image."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Start Edit
    |--------------------------------------------------------------------------
    */

    const handleEdit = (image) => {
        setEditingId(image.id);
        setImageUrl(image.image || "");
        setPreview(image.image || "");
    };

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingId) return;

        if (!imageUrl.trim()) {
            alert("Please enter an image URL.");
            return;
        }

        try {
            setSaving(true);

            await sellerProductService.updateProductImage(
                editingId,
                {
                    image: imageUrl.trim(),
                }
            );

            cancelEdit();

            await loadImages();
        } catch (err) {
            console.error(
                "Update image error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to update image."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Cancel
    |--------------------------------------------------------------------------
    */

    const cancelEdit = () => {
        setEditingId(null);
        setImageUrl("");
        setPreview("");
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Product Images
                </h2>

            </div>

            {/* Error */}

            {error && (
                <div className="mb-5 rounded-lg bg-red-100 border border-red-200 text-red-700 px-4 py-3">
                    {error}
                </div>
            )}

            {/* Upload / Update Form */}

            <form
                onSubmit={
                    editingId
                        ? handleUpdate
                        : handleUpload
                }
                className="border rounded-xl p-5 mb-8"
            >

                <h3 className="text-lg font-semibold mb-4">
                    {editingId
                        ? "Update Image"
                        : "Upload New Image"}
                </h3>

                <div className="space-y-4">

                    <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={imageUrl}
                        onChange={handleImageChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Preview */}

                    {preview && (
                        <div>

                            <p className="font-medium mb-2">
                                Preview
                            </p>

                            <img
                                src={preview}
                                alt="Preview"
                                className="w-40 h-40 object-cover rounded-lg border"
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />

                        </div>
                    )}

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Image"
                                : "Upload Image"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={saving}
                                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </div>

            </form>

            {/* Gallery */}

            <div>

                <h3 className="text-lg font-semibold mb-5">
                    Gallery
                </h3>

                {loading ? (

                    <div className="text-center py-16 text-gray-500">
                        Loading images...
                    </div>

                ) : images.length === 0 ? (

                    <div className="text-center py-16 border rounded-xl text-gray-500">
                        No Images Found
                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {images.map((image) => (

                            <div
                                key={image.id}
                                className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                            >

                                <img
                                    src={
                                        image.image ||
                                        "/images/no-image.png"
                                    }
                                    alt="Product"
                                    className="w-full h-56 object-cover"
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            "/images/no-image.png";
                                    }}
                                />

                                <div className="p-4">

                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(image)
                                            }
                                            disabled={saving}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg disabled:opacity-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    image.id
                                                )
                                            }
                                            disabled={saving}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:opacity-50"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default ProductImages;


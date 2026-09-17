import { useEffect } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getProduct,
    deleteProduct,
} from "../../../redux/seller/sellerProductSlice";

const ViewProduct = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        product,
        loading,
        error,
    } = useSelector(
        (state) => state.sellerProducts
    );

    /*
    |--------------------------------------------------------------------------
    | Load Product
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!id) return;

        dispatch(getProduct(id));
    }, [dispatch, id]);

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product?.name}"?`
        );

        if (!confirmed) return;

        try {
            await dispatch(
                deleteProduct(id)
            ).unwrap();

            navigate("/seller/products");
        } catch (err) {
            console.error(
                "Delete product error:",
                err
            );

            alert(
                err ||
                "Failed to delete product."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading && !product) {
        return (
            <div className="flex justify-center items-center h-80">
                <div className="text-lg font-semibold">
                    Loading Product...
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !product) {
        return (
            <div className="bg-red-100 border border-red-200 text-red-700 rounded-xl p-6">
                {error}
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Not Found
    |--------------------------------------------------------------------------
    */

    if (!product) {
        return (
            <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 rounded-xl p-6">
                Product not found.
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Product Data
    |--------------------------------------------------------------------------
    */

    const thumbnail =
        product.thumbnail ||
        product.images?.[0]?.image ||
        "/images/no-image.png";

    const price =
        Number(product.price || 0);

    const discountPrice =
        product.discount_price !== null &&
        product.discount_price !== undefined &&
        product.discount_price !== ""
            ? Number(product.discount_price)
            : null;

    const stock =
        Number(product.stock || 0);

    return (
        <div className="space-y-6">

            {/* ============================================================
                Header
            ============================================================ */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Product Details
                        </h1>

                        <p className="text-gray-500 mt-2">
                            View complete information about this product.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        <Link
                            to="/seller/products"
                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Back
                        </Link>

                        <Link
                            to={`/seller/products/${product.id}/edit`}
                            className="px-5 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                            Edit
                        </Link>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

            {/* ============================================================
                Product Information
            ============================================================ */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Thumbnail */}

                    <div>

                        <img
                            src={thumbnail}
                            alt={
                                product.name ||
                                "Product"
                            }
                            className="w-full h-96 rounded-xl object-cover border"
                            onError={(event) => {
                                event.currentTarget.src =
                                    "/images/no-image.png";
                            }}
                        />

                    </div>

                    {/* Information */}

                    <div className="lg:col-span-2 space-y-5">

                        <div>

                            <h2 className="text-3xl font-bold">
                                {product.name}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                SKU: {product.sku || "-"}
                            </p>

                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            {/* Category */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Category
                                </label>

                                <div className="font-semibold text-lg">
                                    {product.category?.name ||
                                        "-"}
                                </div>
                            </div>

                            {/* Brand */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Brand
                                </label>

                                <div className="font-semibold text-lg">
                                    {product.brand?.name ||
                                        "-"}
                                </div>
                            </div>

                            {/* Price */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Original Price
                                </label>

                                <div className="text-2xl font-bold text-blue-600">
                                    Rs.{" "}
                                    {price.toLocaleString()}
                                </div>
                            </div>

                            {/* Selling Price */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Selling Price
                                </label>

                                <div className="text-2xl font-bold text-green-600">

                                    {discountPrice !== null
                                        ? `Rs. ${discountPrice.toLocaleString()}`
                                        : `Rs. ${price.toLocaleString()}`}

                                </div>
                            </div>

                            {/* Stock */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Stock
                                </label>

                                <div
                                    className={`text-xl font-semibold ${
                                        stock === 0
                                            ? "text-red-600"
                                            : stock <= 5
                                            ? "text-orange-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {stock}
                                </div>
                            </div>

                            {/* Status */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Status
                                </label>

                                <div className="mt-1">

                                    <span
                                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                            Boolean(
                                                product.status
                                            )
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {Boolean(
                                            product.status
                                        )
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                </div>
                            </div>

                            {/* Featured */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Featured
                                </label>

                                <div className="mt-1">

                                    <span
                                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                            Boolean(
                                                product.featured
                                            )
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {Boolean(
                                            product.featured
                                        )
                                            ? "Yes"
                                            : "No"}
                                    </span>

                                </div>
                            </div>

                            {/* Images Count */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Gallery Images
                                </label>

                                <div className="font-semibold text-lg">
                                    {product.images?.length ||
                                        0}
                                </div>
                            </div>

                            {/* Variants Count */}

                            <div>
                                <label className="text-gray-500 text-sm">
                                    Variants
                                </label>

                                <div className="font-semibold text-lg">
                                    {product.variants?.length ||
                                        0}
                                </div>
                            </div>

                        </div>

                        {/* Short Description */}

                        <div>

                            <h3 className="font-semibold text-lg mb-2">
                                Short Description
                            </h3>

                            <p className="text-gray-700 leading-7">
                                {product.short_description ||
                                    "-"}
                            </p>

                        </div>

                        {/* Description */}

                        <div>

                            <h3 className="font-semibold text-lg mb-2">
                                Description
                            </h3>

                            <p className="text-gray-700 leading-7 whitespace-pre-line">
                                {product.description ||
                                    "-"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ============================================================
                Gallery
            ============================================================ */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Product Gallery
                </h2>

                {product.images &&
                product.images.length > 0 ? (

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">

                        {product.images.map(
                            (image) => (

                                <div
                                    key={image.id}
                                    className="border rounded-lg overflow-hidden"
                                >

                                    <img
                                        src={
                                            image.image ||
                                            "/images/no-image.png"
                                        }
                                        alt="Product"
                                        className="w-full h-44 object-cover"
                                        onError={(
                                            event
                                        ) => {
                                            event.currentTarget.src =
                                                "/images/no-image.png";
                                        }}
                                    />

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="text-gray-500">
                        No gallery images available.
                    </div>

                )}

            </div>

            {/* ============================================================
                Variants
            ============================================================ */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <h2 className="text-2xl font-bold mb-6">
                    Product Variants
                </h2>

                {product.variants &&
                product.variants.length > 0 ? (

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

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

                                </tr>

                            </thead>

                            <tbody>

                                {product.variants.map(
                                    (variant) => (

                                        <tr
                                            key={variant.id}
                                            className="border-b hover:bg-gray-50"
                                        >

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

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="text-gray-500">
                        No variants available.
                    </div>

                )}

            </div>

            {/* ============================================================
                Dates
            ============================================================ */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <h3 className="text-sm text-gray-500">
                            Created At
                        </h3>

                        <p className="font-semibold">
                            {product.created_at
                                ? new Date(
                                      product.created_at
                                  ).toLocaleString()
                                : "-"}
                        </p>

                    </div>

                    <div>

                        <h3 className="text-sm text-gray-500">
                            Updated At
                        </h3>

                        <p className="font-semibold">
                            {product.updated_at
                                ? new Date(
                                      product.updated_at
                                  ).toLocaleString()
                                : "-"}
                        </p>

                    </div>

                </div>

            </div>

            {/* ============================================================
                Bottom Buttons
            ============================================================ */}

            <div className="flex flex-wrap justify-end gap-4">

                <Link
                    to="/seller/products"
                    className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    Back
                </Link>

                <Link
                    to={`/seller/products/${product.id}/edit`}
                    className="px-6 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                >
                    Edit Product
                </Link>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                    Delete Product
                </button>

            </div>

        </div>
    );
};

export default ViewProduct;


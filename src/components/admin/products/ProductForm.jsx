import { useEffect, useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    useForm,
} from "react-hook-form";

import {
    createProduct,
    updateProduct,
} from "../../../redux/admin/productSlice";

import {
    getCategories,
} from "../../../redux/admin/categorySlice";

import {
    getBrands,
} from "../../../redux/admin/brandSlice";

import {
    getVendors,
} from "../../../redux/admin/vendorSlice";

import ProductImages from "./ProductImages";

import ProductVariants from "./ProductVariants";


const ProductForm = ({
    product = null,
    isEdit = false,
    onSuccess,
}) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();


    // ==================================================
    // Redux State
    // ==================================================

    const {
        loading,
        error,
    } = useSelector(
        (state) => state.adminProduct
    );


    const {
        categories = [],
    } = useSelector(
        (state) => state.adminCategory
    );


    const {
        brands = [],
    } = useSelector(
        (state) => state.adminBrand
    );


    const {
        vendors = [],
    } = useSelector(
        (state) => state.adminVendor
    );


    // ==================================================
    // React Hook Form
    // ==================================================

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm({
        defaultValues: {
            vendor_id: "",
            category_id: "",
            brand_id: "",
            name: "",
            sku: "",
            short_description: "",
            description: "",
            price: "",
            discount_price: "",
            stock: 0,
            status: true,
            featured: false,
        },
    });


    // ==================================================
    // Image State
    // ==================================================

    const [
        thumbnail,
        setThumbnail,
    ] = useState("");


    const [
        images,
        setImages,
    ] = useState([]);


    // ==================================================
    // Variant State
    // ==================================================

    const [
        variants,
        setVariants,
    ] = useState([]);


    // ==================================================
    // Load Categories / Brands / Vendors
    // ==================================================

    useEffect(() => {

        dispatch(getCategories());

        dispatch(getBrands());

        dispatch(getVendors());

    }, [dispatch]);


    // ==================================================
    // Load Existing Product
    // ==================================================

    useEffect(() => {

        if (
            isEdit &&
            product
        ) {

            reset({

                vendor_id:
                    product.vendor_id ?? "",

                category_id:
                    product.category_id ?? "",

                brand_id:
                    product.brand_id ?? "",

                name:
                    product.name ?? "",

                sku:
                    product.sku ?? "",

                short_description:
                    product.short_description ?? "",

                description:
                    product.description ?? "",

                price:
                    product.price ?? "",

                discount_price:
                    product.discount_price ?? "",

                stock:
                    product.stock ?? 0,

                status:
                    Boolean(product.status),

                featured:
                    Boolean(product.featured),

            });


            setThumbnail(
                product.thumbnail || ""
            );


            setImages(
                Array.isArray(product.images)
                    ? product.images
                    : []
            );


            setVariants(
                Array.isArray(product.variants)
                    ? product.variants
                    : []
            );

        }

    }, [
        product,
        isEdit,
        reset,
    ]);


    // ==================================================
    // Image Validation
    // ==================================================

    const validateImages = () => {

        if (
            !thumbnail &&
            images.length === 0
        ) {

            return "Please add a thumbnail or at least one gallery image.";

        }


        return true;

    };


    // ==================================================
    // Variant Validation
    // ==================================================

    const validateVariants = () => {

        for (
            const variant of variants
        ) {

            if (
                !variant.sku ||
                !String(variant.sku).trim()
            ) {

                return "Variant SKU is required.";

            }

        }


        return true;

    };


    // ==================================================
    // Submit
    // ==================================================

    const onSubmit = async (data) => {

        const productData = {

            ...data,

            vendor_id:
                Number(data.vendor_id),

            category_id:
                Number(data.category_id),

            brand_id:
                Number(data.brand_id),

            price:
                Number(data.price),

            discount_price:
                data.discount_price === "" ||
                data.discount_price === null
                    ? null
                    : Number(data.discount_price),

            stock:
                Number(data.stock),

            thumbnail:
                thumbnail || null,

            images,

            variants,

            status:
                Boolean(data.status),

            featured:
                Boolean(data.featured),

        };


        /*
        IMPORTANT:

        Do NOT send owner_type here.

        The backend decides:

        Admin creates:
            owner_type = admin

        Seller creates:
            owner_type = vendor
        */


        try {

            if (isEdit) {

                await dispatch(
                    updateProduct({
                        id: product.id,
                        productData,
                    })
                ).unwrap();

            } else {

                await dispatch(
                    createProduct(productData)
                ).unwrap();

            }


            // Modal mode
            if (onSuccess) {

                onSuccess();

                return;

            }


            // Normal page mode
            navigate(
                "/admin/products"
            );

        } catch (submitError) {

            console.error(
                "Product save error:",
                submitError
            );

        }

    };


    // ==================================================
    // Form Submit Validation
    // ==================================================

    const handleFormSubmit = (data) => {

        const imageValidation =
            validateImages();


        if (
            imageValidation !== true
        ) {

            alert(imageValidation);

            return;

        }


        const variantValidation =
            validateVariants();


        if (
            variantValidation !== true
        ) {

            alert(variantValidation);

            return;

        }


        onSubmit(data);

    };


    // ==================================================
    // Ownership Display
    // ==================================================

    const ownerType =
        product?.owner_type || "";


    const isAdminOwned =
        ownerType === "admin";


    const isVendorOwned =
        ownerType === "vendor";


    // ==================================================
    // Render
    // ==================================================

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">

            {/* ========================================= */}
            {/* Header */}
            {/* ========================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>

                    <h2 className="text-3xl font-bold">
                        {isEdit
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Manage product information,
                        pricing, images and variants.
                    </p>

                </div>


                {/* Ownership */}
                {isEdit && ownerType && (

                    <div
                        className={`px-4 py-3 rounded-lg border ${
                            isAdminOwned
                                ? "bg-purple-50 border-purple-200 text-purple-700"
                                : "bg-blue-50 border-blue-200 text-blue-700"
                        }`}
                    >

                        <div className="text-xs uppercase font-semibold">
                            Product Ownership
                        </div>

                        <div className="font-bold mt-1">

                            {isAdminOwned
                                ? "Admin Owned"
                                : isVendorOwned
                                    ? "Vendor Owned"
                                    : "Unknown"}

                        </div>

                    </div>

                )}

            </div>


            {/* ========================================= */}
            {/* Ownership Explanation */}
            {/* ========================================= */}

            {!isEdit && (

                <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-4">

                    <div className="font-semibold text-purple-800">
                        Admin Product
                    </div>

                    <p className="text-sm text-purple-700 mt-1">
                        This product will be owned by Admin.
                        The selected Vendor Store is only the
                        selling channel for this product.
                    </p>

                </div>

            )}


            {isEdit && ownerType && (

                <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4">

                    <div className="font-semibold text-gray-800">
                        Ownership cannot be changed
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        Product ownership is fixed when the
                        product is created. You can change the
                        Vendor Store, but you cannot change an
                        Admin-owned product into a Vendor-owned
                        product or vice versa.
                    </p>

                </div>

            )}


            {/* ========================================= */}
            {/* Form */}
            {/* ========================================= */}

            <form
                onSubmit={
                    handleSubmit(
                        handleFormSubmit
                    )
                }
                className="space-y-8"
            >

                {/* ===================================== */}
                {/* Basic Information */}
                {/* ===================================== */}

                <div>

                    <h3 className="text-xl font-semibold mb-5">
                        Basic Information
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Vendor Store */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Vendor Store
                            </label>

                            <select
                                {...register(
                                    "vendor_id",
                                    {
                                        required:
                                            "Vendor Store is required",
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Vendor Store
                                </option>

                                {vendors?.map(
                                    (vendor) => (

                                        <option
                                            key={vendor.id}
                                            value={vendor.id}
                                        >
                                            {
                                                vendor.store_name ||
                                                vendor.name ||
                                                `Vendor #${vendor.id}`
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                            {errors.vendor_id && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.vendor_id.message
                                    }
                                </p>

                            )}

                            <p className="text-xs text-gray-500 mt-1">
                                This is the selling Vendor Store,
                                not product ownership.
                            </p>

                        </div>


                        {/* Category */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Category
                            </label>

                            <select
                                {...register(
                                    "category_id",
                                    {
                                        required:
                                            "Category is required",
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories?.map(
                                    (category) => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>

                                    )
                                )}

                            </select>

                            {errors.category_id && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.category_id.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* Brand */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Brand
                            </label>

                            <select
                                {...register(
                                    "brand_id",
                                    {
                                        required:
                                            "Brand is required",
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands?.map(
                                    (brand) => (

                                        <option
                                            key={brand.id}
                                            value={brand.id}
                                        >
                                            {brand.name}
                                        </option>

                                    )
                                )}

                            </select>

                            {errors.brand_id && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.brand_id.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* Product Name */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Product Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter product name"
                                {...register(
                                    "name",
                                    {
                                        required:
                                            "Product name is required",
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.name && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.name.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* SKU */}

                        <div>

                            <label className="block mb-2 font-medium">
                                SKU
                            </label>

                            <input
                                type="text"
                                placeholder="Enter SKU"
                                {...register(
                                    "sku",
                                    {
                                        required:
                                            "SKU is required",
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.sku && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.sku.message
                                    }
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* ===================================== */}
                {/* Pricing */}
                {/* ===================================== */}

                <div>

                    <h3 className="text-xl font-semibold mb-5">
                        Pricing & Stock
                    </h3>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Price */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...register(
                                    "price",
                                    {
                                        required:
                                            "Price is required",
                                        min: {
                                            value: 0,
                                            message:
                                                "Price cannot be negative",
                                        },
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.price && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.price.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* Discount Price */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Discount Price
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...register(
                                    "discount_price",
                                    {
                                        validate:
                                            (value) => {

                                                if (
                                                    value === "" ||
                                                    value === undefined ||
                                                    value === null
                                                ) {
                                                    return true;
                                                }

                                                const price =
                                                    Number(
                                                        document.querySelector(
                                                            'input[name="price"]'
                                                        )?.value || 0
                                                    );

                                                if (
                                                    Number(value) > price
                                                ) {
                                                    return "Discount price cannot be greater than price.";
                                                }

                                                return true;
                                            },
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.discount_price && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.discount_price.message
                                    }
                                </p>

                            )}

                        </div>


                        {/* Stock */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Stock
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...register(
                                    "stock",
                                    {
                                        required:
                                            "Stock is required",
                                        min: {
                                            value: 0,
                                            message:
                                                "Stock cannot be negative",
                                        },
                                    }
                                )}
                                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.stock && (

                                <p className="text-red-500 text-sm mt-1">
                                    {
                                        errors.stock.message
                                    }
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                {/* ===================================== */}
                {/* Short Description */}
                {/* ===================================== */}

                <div>

                    <label className="block mb-2 font-medium">
                        Short Description
                    </label>

                    <textarea
                        rows={3}
                        placeholder="Enter short description..."
                        {...register(
                            "short_description"
                        )}
                        className="w-full border rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* ===================================== */}
                {/* Description */}
                {/* ===================================== */}

                <div>

                    <label className="block mb-2 font-medium">
                        Description
                    </label>

                    <textarea
                        rows={6}
                        placeholder="Enter product description..."
                        {...register(
                            "description"
                        )}
                        className="w-full border rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* ===================================== */}
                {/* Status & Featured */}
                {/* ===================================== */}

                <div>

                    <h3 className="text-xl font-semibold mb-5">
                        Product Settings
                    </h3>


                    <div className="flex flex-wrap gap-10">

                        <label className="flex items-center gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                {...register("status")}
                                className="w-5 h-5"
                            />

                            <span className="font-medium">
                                Active
                            </span>

                        </label>


                        <label className="flex items-center gap-3 cursor-pointer">

                            <input
                                type="checkbox"
                                {...register("featured")}
                                className="w-5 h-5"
                            />

                            <span className="font-medium">
                                Featured Product
                            </span>

                        </label>

                    </div>

                </div>


                {/* ===================================== */}
                {/* Product Images */}
                {/* ===================================== */}

                <div>

                    <ProductImages
                        thumbnail={thumbnail}
                        setThumbnail={setThumbnail}
                        images={images}
                        setImages={setImages}
                    />

                </div>


                {/* ===================================== */}
                {/* Product Variants */}
                {/* ===================================== */}

                <div>

                    <ProductVariants
                        variants={variants}
                        setVariants={setVariants}
                    />

                </div>


                {/* ===================================== */}
                {/* Backend Error */}
                {/* ===================================== */}

                {error && (

                    <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">

                        {typeof error === "string"
                            ? error
                            : "Unable to save product. Please check the form and try again."}

                    </div>

                )}


                {/* ===================================== */}
                {/* Buttons */}
                {/* ===================================== */}

                <div className="flex items-center justify-end gap-4 pt-6">

                    <button
                        type="button"
                        onClick={() => {

                            if (onSuccess) {

                                onSuccess();

                            } else {

                                navigate(
                                    "/admin/products"
                                );

                            }

                        }}
                        className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Product"
                                : "Create Product"}

                    </button>

                </div>

            </form>

        </div>
    );
};


export default ProductForm;


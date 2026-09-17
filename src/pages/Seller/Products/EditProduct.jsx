// src/pages/Seller/Products/EditProduct.jsx

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getProduct,
    updateProduct,
} from "../../../redux/seller/sellerProductSlice";

import ProductForm from "../../../components/seller/ProductForm";

import {
    getSellerCategories,
} from "../../../redux/seller/sellerCategorySlice";

import {
    getSellerBrands,
} from "../../../redux/seller/sellerBrandSlice";

const EditProduct = () => {
    // =====================================================
    // URL PARAMETER
    // =====================================================

    const { id } = useParams();

    /*
    |--------------------------------------------------------------------------
    | Convert URL ID to number
    |--------------------------------------------------------------------------
    |
    | Example:
    | /seller/products/10/edit
    |
    | id = "10"
    | productId = 10
    |
    */

    const productId = id ? Number(id) : null;

    // =====================================================
    // REDUX / NAVIGATION
    // =====================================================

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =====================================================
    // PRODUCT STATE
    // =====================================================

    const {
        product,
        loading: productLoading,
        error: productError,
    } = useSelector(
        (state) => state.sellerProducts
    );

    // =====================================================
    // CATEGORY STATE
    // =====================================================

    const {
        categories = [],
        loading: categoryLoading,
        error: categoryError,
    } = useSelector(
        (state) => state.sellerCategories
    );

    // =====================================================
    // BRAND STATE
    // =====================================================

    const {
        brands = [],
        loading: brandLoading,
        error: brandError,
    } = useSelector(
        (state) => state.sellerBrands
    );

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
        "EditProduct URL id:",
        id
    );

    console.log(
        "EditProduct productId:",
        productId
    );

    console.log(
        "EditProduct product:",
        product
    );

    // =====================================================
    // LOAD PRODUCT / CATEGORIES / BRANDS
    // =====================================================

    useEffect(() => {
        /*
        |--------------------------------------------------------------------------
        | Validate Product ID
        |--------------------------------------------------------------------------
        */

        if (
            !productId ||
            Number.isNaN(productId)
        ) {
            console.error(
                "EditProduct: Invalid product ID:",
                id
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Load Product
        |--------------------------------------------------------------------------
        */

        dispatch(
            getProduct(productId)
        );

        /*
        |--------------------------------------------------------------------------
        | Load Categories
        |--------------------------------------------------------------------------
        */

        dispatch(
            getSellerCategories()
        );

        /*
        |--------------------------------------------------------------------------
        | Load Brands
        |--------------------------------------------------------------------------
        */

        dispatch(
            getSellerBrands()
        );
    }, [
        dispatch,
        productId,
        id,
    ]);

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    const handleUpdate = async (
        formData
    ) => {
        console.log(
            "EditProduct handleUpdate productId:",
            productId
        );

        console.log(
            "EditProduct formData:",
            formData
        );

        /*
        |--------------------------------------------------------------------------
        | Validate Product ID
        |--------------------------------------------------------------------------
        */

        if (
            !productId ||
            Number.isNaN(productId)
        ) {
            console.error(
                "Cannot update product: Product ID is missing or invalid.",
                {
                    id,
                    productId,
                }
            );

            return;
        }

        try {
            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |--------------------------------------------------------------------------
            |
            | Redux thunk expects:
            |
            | {
            |     productId,
            |     productData
            | }
            |
            | NOT:
            |
            | {
            |     id,
            |     productData
            | }
            |
            */

            const result = await dispatch(
                updateProduct({
                    productId: productId,
                    productData: formData,
                })
            ).unwrap();

            console.log(
                "Product updated successfully:",
                result
            );

            /*
            |--------------------------------------------------------------------------
            | Return to Product List
            |--------------------------------------------------------------------------
            */

            navigate(
                "/seller/products"
            );
        } catch (error) {
            console.error(
                "Update product error:",
                error
            );
        }
    };

    // =====================================================
    // INVALID PRODUCT URL
    // =====================================================

    if (
        !productId ||
        Number.isNaN(productId)
    ) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-6">

                    <h2 className="text-xl font-bold mb-2">
                        Invalid Product URL
                    </h2>

                    <p>
                        Product ID is missing or invalid.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/seller/products"
                            )
                        }
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                    >
                        Back to Products
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // PRODUCT LOADING
    // =====================================================

    if (
        productLoading &&
        !product
    ) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-xl font-semibold text-gray-600">
                    Loading Product...
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    const error =
        productError ||
        categoryError ||
        brandError;

    if (
        error &&
        !product
    ) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-6">

                    <h2 className="text-xl font-bold mb-2">
                        Unable to Load Product
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/seller/products"
                            )
                        }
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                    >
                        Back to Products
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-xl p-6">

                    <h2 className="text-xl font-bold mb-2">
                        Product Not Found
                    </h2>

                    <p>
                        The requested product could not be
                        found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/seller/products"
                            )
                        }
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                    >
                        Back to Products
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // FORM LOADING
    // =====================================================

    const formLoading =
        productLoading ||
        categoryLoading ||
        brandLoading;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Edit Product
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Update your product information.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Product ID: {productId}
                        </p>

                    </div>

                </div>

            </div>

            {/* =================================================
                PRODUCT FORM
            ================================================= */}

            <ProductForm
                mode="edit"
                initialData={product}
                categories={categories}
                brands={brands}
                onSubmit={handleUpdate}
                loading={formLoading}
            />

        </div>
    );
};

export default EditProduct;


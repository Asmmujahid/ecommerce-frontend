import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductForm from "../../../components/seller/ProductForm";

import { createProduct } from "../../../redux/seller/sellerProductSlice";

import {
    getSellerCategories,
} from "../../../redux/seller/sellerCategorySlice";

import {
    getSellerBrands,
} from "../../../redux/seller/sellerBrandSlice";

const CreateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading: productLoading,
        error: productError,
    } = useSelector((state) => state.sellerProducts);

    const {
        categories = [],
        loading: categoryLoading,
        error: categoryError,
    } = useSelector((state) => state.sellerCategories);

    const {
        brands = [],
        loading: brandLoading,
        error: brandError,
    } = useSelector((state) => state.sellerBrands);

    /*
    |--------------------------------------------------------------------------
    | Load Categories & Brands
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        dispatch(getSellerCategories());
        dispatch(getSellerBrands());
    }, [dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (formData) => {
        try {
            const resultAction = await dispatch(
                createProduct(formData)
            );

            if (createProduct.fulfilled.match(resultAction)) {
                navigate("/seller/products");
            }
        } catch (error) {
            console.error("Create product error:", error);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    const loading =
        productLoading ||
        categoryLoading ||
        brandLoading;

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    const error =
        productError ||
        categoryError ||
        brandError;

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Create Product
                </h1>

                <p className="text-gray-500 mt-2">
                    Add a new product to your store.
                </p>

            </div>

            {/* Error */}

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">
                    {error}
                </div>
            )}

            {/* Form */}

            <ProductForm
                mode="create"
                loading={loading}
                categories={categories}
                brands={brands}
                onSubmit={handleSubmit}
            />

        </div>
    );
};

export default CreateProduct;


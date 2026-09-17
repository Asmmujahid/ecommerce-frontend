import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import { FaPlus } from "react-icons/fa";

import {
    getProducts,
    deleteProduct,
} from "../../../redux/admin/productSlice";

import ProductTable from "../../../components/admin/products/ProductTable";

import ProductSearch from "../../../components/admin/products/ProductSearch";

import ProductFilter from "../../../components/admin/products/ProductFilter";

const Products = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Redux state
    |--------------------------------------------------------------------------
    */
    const {
        products = [],
        loading,
        error,
    } = useSelector(
        (state) => state.adminProduct
    );

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */
    const [search, setSearch] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */
    const [filters, setFilters] =
        useState({
            category: "",
            brand: "",
            status: "",
            featured: "",
            stock: "",
            owner_type: "",
        });

    /*
    |--------------------------------------------------------------------------
    | Fetch Products
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                getProducts({
                    ...filters,
                    search: search.trim(),
                })
            );
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [
        dispatch,
        filters,
        search,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */
    const handleDelete = (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmed) {
            return;
        }

        dispatch(
            deleteProduct(id)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */
    const categories = useMemo(() => {
        return [
            ...new Map(
                products
                    .filter(
                        (product) =>
                            product.category
                    )
                    .map(
                        (product) => [
                            product.category.id,
                            product.category,
                        ]
                    )
            ).values(),
        ];
    }, [products]);

    /*
    |--------------------------------------------------------------------------
    | Brands
    |--------------------------------------------------------------------------
    */
    const brands = useMemo(() => {
        return [
            ...new Map(
                products
                    .filter(
                        (product) =>
                            product.brand
                    )
                    .map(
                        (product) => [
                            product.brand.id,
                            product.brand,
                        ]
                    )
            ).values(),
        ];
    }, [products]);

    return (
        <div className="p-6">

            {/* Header */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    md:justify-between
                    md:items-center
                    gap-4
                    mb-6
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-gray-800
                        "
                    >
                        Products
                    </h1>

                    <p
                        className="
                            text-gray-500
                            mt-1
                        "
                    >
                        Manage all marketplace products.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/products/create"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-lg
                        transition
                    "
                >
                    <FaPlus />

                    Add Product
                </button>

            </div>

            {/* Search */}

            <div className="mb-5">

                <ProductSearch
                    search={search}
                    setSearch={setSearch}
                />

            </div>

            {/* Filters */}

            <div className="mb-6">

                <ProductFilter
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    brands={brands}
                />

            </div>

            {/* Error */}

            {error && (
                <div
                    className="
                        bg-red-100
                        border
                        border-red-300
                        text-red-700
                        p-4
                        rounded-lg
                        mb-6
                    "
                >
                    {error}
                </div>
            )}

            {/* Loading */}

            {loading ? (

                <div
                    className="
                        bg-white
                        rounded-xl
                        shadow-md
                        p-10
                        text-center
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-semibold
                        "
                    >
                        Loading products...
                    </h2>

                </div>

            ) : (

                <ProductTable
                    products={products}
                    onDelete={handleDelete}
                />

            )}

        </div>
    );
};

export default Products;


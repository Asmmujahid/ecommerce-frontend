import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import {
    getBrands,
    deleteBrand,
} from "../../../redux/admin/brandSlice";

import BrandTable from "../../../components/admin/brands/BrandTable";
import BrandSearch from "../../../components/admin/brands/BrandSearch";

const Brands = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        brands,
        loading,
        error,
    } = useSelector((state) => state.adminBrand);

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {
            dispatch(deleteBrand(id));
        }
    };

    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Brands
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage all product brands.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/brands/create")}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                >
                    <FaPlus />
                    Add Brand
                </button>

            </div>

            {/* Search */}
            <BrandSearch
                search={search}
                setSearch={setSearch}
            />

            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <p className="text-lg font-medium">
                        Loading brands...
                    </p>
                </div>
            ) : (
                <BrandTable
                    brands={filteredBrands}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
};

export default Brands;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import {
    getCategories,
    deleteCategory,
} from "../../../redux/admin/categorySlice";

import CategoryTable from "../../../components/admin/categories/CategoryTable";
import CategorySearch from "../../../components/admin/categories/CategorySearch";

const Categories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        categories,
        loading,
        error,
    } = useSelector((state) => state.adminCategory);

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(id));
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Categories
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage all product categories.
                    </p>
                </div>

      <button
    onClick={() => navigate("/admin/categories/create")}
    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
>
    <FaPlus />
    Add Category
</button>


            </div>

            {/* Search */}
           <CategorySearch
    search={search}
    setSearch={setSearch}
/>

            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-lg my-5">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <p className="text-lg font-medium">
                        Loading categories...
                    </p>
                </div>
            ) : (
                <CategoryTable
                    categories={filteredCategories}
                    onDelete={handleDelete}
                />
            )}

        </div>
    );
};

export default Categories;
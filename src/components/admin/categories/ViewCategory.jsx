import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getCategory,
    resetCategoryState,
} from "../../../redux/admin/categorySlice";

const ViewCategory = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        category,
        loading,
        error,
    } = useSelector((state) => state.adminCategory);

    useEffect(() => {
        dispatch(getCategory(id));

        return () => {
            dispatch(resetCategoryState());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <h2 className="text-xl font-semibold">
                    Loading Category...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                    {error}
                </div>

                <button
                    onClick={() => navigate("/admin/categories")}
                    className="mt-5 px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                    Back
                </button>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex justify-center items-center h-80">
                <h2 className="text-xl">
                    Category not found.
                </h2>
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Category Details
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View category information.
                    </p>
                </div>

                <Link
                    to="/admin/categories"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
                >
                    Back
                </Link>

            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">

                    {/* Image */}
                    <div>

                        {category.image ? (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-64 object-cover rounded-lg border"
                            />
                        ) : (
                            <div className="w-full h-64 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-6">

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Category ID
                            </h4>

                            <p className="text-lg font-semibold">
                                #{category.id}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Name
                            </h4>

                            <p className="text-lg font-semibold">
                                {category.name}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Slug
                            </h4>

                            <p className="text-lg">
                                {category.slug}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Description
                            </h4>

                            <p className="text-lg">
                                {category.description || "No description"}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Status
                            </h4>

                            <span
                                className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold ${
                                    category.status
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {category.status ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Created At
                            </h4>

                            <p>
                                {new Date(category.created_at).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm text-gray-500">
                                Updated At
                            </h4>

                            <p>
                                {new Date(category.updated_at).toLocaleString()}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewCategory;
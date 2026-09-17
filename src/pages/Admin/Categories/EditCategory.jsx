import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
    getCategory,
    updateCategory,
    resetCategoryState,
} from "../../../redux/admin/categorySlice";

import CategoryForm from "../../../components/admin/categories/CategoryForm";

const EditCategory = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        category,
        loading,
        success,
        error,
    } = useSelector((state) => state.adminCategory);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        status: true,
    });

    useEffect(() => {
        dispatch(getCategory(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
                image: category.image || "",
                status: category.status,
            });
        }
    }, [category]);

    useEffect(() => {
        if (success) {

             toast.success("Category updated successfully.");
            
            dispatch(resetCategoryState());
            navigate("/admin/categories");
        }
    }, [success, dispatch, navigate]);

   



    if (loading && !category) {
        return (
            <div className="flex justify-center items-center py-20">
                <h2 className="text-lg font-semibold">
                    Loading Category...
                </h2>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Edit Category
                </h1>

                <p className="text-gray-500 mt-2">
                    Update category information.
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                    {error}
                </div>
            )}

<CategoryForm
    initialValues={formData}
    loading={loading}
    submitButtonText="Update Category"
    onSubmit={(data) =>
        dispatch(
            updateCategory({
                id,
                categoryData: data,
            })
        )
    }
/>
        </div>
    );
};

export default EditCategory;
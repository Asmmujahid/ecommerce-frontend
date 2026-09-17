import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import CategoryForm from "../../../components/admin/categories/CategoryForm";

import {
    createCategory,
    resetCategoryState,
} from "../../../redux/admin/categorySlice";

const defaultValues = {
    name: "",
    description: "",
    image: "",
    status: true,
};

const AddCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        success,
        error,
    } = useSelector((state) => state.adminCategory);

    useEffect(() => {
        if (success) {
            toast.success("Category created successfully.");

           dispatch(resetCategoryState());

            navigate("/admin/categories");
        }
    }, [success, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (formData) => {
        dispatch(createCategory(formData));
    };

    return (
        <div className="p-6">

            <div className="flex items-center justify-between mb-6">

                <div>

           <h1 className="text-3xl font-bold">
    Add Category
</h1>

                    <p className="text-gray-500 mt-1">
                        Create a new product category.
                    </p>

                </div>

                <button
                    onClick={() => navigate("/admin/categories")}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                    Back
                </button>

            </div>
<CategoryForm
    initialValues={defaultValues}
    loading={loading}
    submitButtonText="Create Category"
    onSubmit={handleSubmit}
/>

        </div>
    );
};

export default AddCategory;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import BrandForm from "../../../components/admin/brands/BrandForm";

import {
    createBrand,
    resetBrandState,
} from "../../../redux/admin/brandSlice";

const defaultValues = {
    name: "",
    logo: "",
    status: true,
};

const AddBrand = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        success,
        error,
    } = useSelector((state) => state.adminBrand);

    useEffect(() => {
        if (success) {
            toast.success("Brand created successfully.");

            dispatch(resetBrandState());

            navigate("/admin/brands");
        }
    }, [success, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (formData) => {
        dispatch(createBrand(formData));
    };

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Add Brand
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Create a new product brand.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/brands")}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                    Back
                </button>

            </div>

            {/* Form */}
            <BrandForm
                initialValues={defaultValues}
                loading={loading}
                submitButtonText="Create Brand"
                onSubmit={handleSubmit}
            />

        </div>
    );
};

export default AddBrand;
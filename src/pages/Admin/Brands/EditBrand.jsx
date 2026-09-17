import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import BrandForm from "../../../components/admin/brands/BrandForm";

import {
    getBrand,
    updateBrand,
    resetBrandState,
} from "../../../redux/admin/brandSlice";

const EditBrand = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        brand,
        loading,
        success,
        error,
    } = useSelector((state) => state.adminBrand);

    // Load Brand
    useEffect(() => {
        dispatch(getBrand(id));
    }, [dispatch, id]);

    // Success
    useEffect(() => {
        if (success) {
            toast.success("Brand updated successfully.");

            dispatch(resetBrandState());

            navigate("/admin/brands");
        }
    }, [success, dispatch, navigate]);

    // Error
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (formData) => {
        dispatch(
            updateBrand({
                id,
                brandData: formData,
            })
        );
    };

    if (loading && !brand) {
        return (
            <div className="p-6 text-center">
                Loading Brand...
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="p-6 text-center">
                Brand not found.
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Edit Brand
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Update brand information.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/brands")}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                    Back
                </button>

            </div>

            <BrandForm
                initialValues={{
                    name: brand.name || "",
                    logo: brand.logo || "",
                    status: brand.status,
                }}
                loading={loading}
                submitButtonText="Update Brand"
                onSubmit={handleSubmit}
            />

        </div>
    );
};

export default EditBrand;
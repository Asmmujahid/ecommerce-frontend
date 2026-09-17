import { useEffect } from "react";
import { useForm } from "react-hook-form";

const BrandForm = ({
    initialValues,
    onSubmit,
    loading = false,
    submitButtonText = "Save Brand",
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const submitHandler = (data) => {
        onSubmit({
            ...data,
            status: Boolean(data.status),
        });
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="bg-white rounded-xl shadow-md p-6 space-y-6"
        >
            {/* Brand Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand Name
                </label>

                <input
                    type="text"
                    placeholder="Enter brand name"
                    {...register("name", {
                        required: "Brand name is required",
                    })}
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                />

                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Logo */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo URL
                </label>

                <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    {...register("logo")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Logo Preview */}
            {initialValues?.logo && (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Logo
                    </label>

                    <img
                        src={initialValues.logo}
                        alt="Brand Logo"
                        className="w-24 h-24 rounded-lg border object-contain"
                    />
                </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-3">
                <input
                    id="status"
                    type="checkbox"
                    {...register("status")}
                    className="w-5 h-5"
                />

                <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700"
                >
                    Active
                </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                    type="reset"
                    onClick={() => reset(initialValues)}
                    className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    disabled={loading}
                >
                    Reset
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg text-white transition ${
                        loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Saving..." : submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default BrandForm;
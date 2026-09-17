import { useEffect, useState } from "react";

const defaultValues = {
    name: "",
    description: "",
    image: "",
    status: true,
};

const CategoryForm = ({
    initialValues = defaultValues,
    onSubmit,
    loading = false,
    submitButtonText = "Save Category",
}) => {

const [formData, setFormData] = useState(defaultValues);

useEffect(() => {

    setFormData({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        image: initialValues?.image || "",
        status: initialValues?.status ?? true,
    });

}, [
    initialValues?.name,
    initialValues?.description,
    initialValues?.image,
    initialValues?.status,
]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Category name is required.");
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Category Name */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Image URL */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                </div>

                {/* Description */}
                <div className="mt-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>

                    <textarea
                        rows={5}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write category description..."
                        className="w-full border rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                {/* Status */}
                <div className="mt-6 flex items-center">

                    <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded"
                    />

                    <label
                        htmlFor="status"
                        className="ml-3 text-gray-700 font-medium"
                    >
                        Active
                    </label>

                </div>

                {/* Image Preview */}
                {formData.image && (
                    <div className="mt-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Preview
                        </label>

                        <img
                            src={formData.image}
                            alt="Category Preview"
                            className="w-40 h-40 object-cover rounded-lg border"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />

                    </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="reset"
                        onClick={() => setFormData(initialValues)}
                        className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : submitButtonText}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default CategoryForm;
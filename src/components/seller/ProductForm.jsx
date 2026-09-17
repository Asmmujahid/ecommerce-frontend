import { useState, useEffect } from "react";

const ProductForm = ({
    mode = "create",
    initialData = null,
    categories = [],
    brands = [],
    loading = false,
    onSubmit,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Initial Form State
    |--------------------------------------------------------------------------
    */

    const initialFormState = {
        category_id: "",
        brand_id: "",

        name: "",
        sku: "",

        short_description: "",
        description: "",

        price: "",
        discount_price: "",

        stock: "",

        thumbnail: "",

        status: true,
        featured: false,

        images: [],

        variants: [],
    };

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [formData, setFormData] = useState(initialFormState);

    const [errors, setErrors] = useState({});

    /*
    |--------------------------------------------------------------------------
    | Load Product (Edit Mode)
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (mode === "edit" && initialData) {

            setFormData({

                category_id:
                    initialData.category_id || "",

                brand_id:
                    initialData.brand_id || "",

                name:
                    initialData.name || "",

                sku:
                    initialData.sku || "",

                short_description:
                    initialData.short_description || "",

                description:
                    initialData.description || "",

                price:
                    initialData.price || "",

                discount_price:
                    initialData.discount_price || "",

                stock:
                    initialData.stock || "",

                thumbnail:
                    initialData.thumbnail || "",

                status:
                    initialData.status ?? true,

                featured:
                    initialData.featured ?? false,

                images:
                    initialData.images || [],

                variants:
                    initialData.variants || [],
            });
        }

    }, [mode, initialData]);

        /*
    |--------------------------------------------------------------------------
    | Input Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Thumbnail Change
    |--------------------------------------------------------------------------
    */

    const handleThumbnailChange = (e) => {
        const { value } = e.target;

        setFormData((prev) => ({
            ...prev,
            thumbnail: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Product Images
    |--------------------------------------------------------------------------
    */

    // Add new image row

    const addImage = () => {
        setFormData((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                {
                    image: "",
                },
            ],
        }));
    };

    // Update image

    const updateImage = (index, value) => {
        const images = [...formData.images];

        images[index].image = value;

        setFormData((prev) => ({
            ...prev,
            images,
        }));
    };

    // Remove image

    const removeImage = (index) => {
        const images = [...formData.images];

        images.splice(index, 1);

        setFormData((prev) => ({
            ...prev,
            images,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Form Validation
    |--------------------------------------------------------------------------
    */

    const validate = () => {
        const validationErrors = {};

        if (!formData.category_id)
            validationErrors.category_id = "Category is required.";

        if (!formData.brand_id)
            validationErrors.brand_id = "Brand is required.";

        if (!formData.name.trim())
            validationErrors.name = "Product name is required.";

        if (!formData.sku.trim())
            validationErrors.sku = "SKU is required.";

        if (!formData.price)
            validationErrors.price = "Price is required.";

        if (!formData.stock)
            validationErrors.stock = "Stock is required.";

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    /*
    |--------------------------------------------------------------------------
    | Submit Form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            category_id: Number(formData.category_id),
            brand_id: Number(formData.brand_id),

            name: formData.name,
            sku: formData.sku,

            short_description: formData.short_description,
            description: formData.description,

            price: Number(formData.price),

            discount_price:
                formData.discount_price === ""
                    ? null
                    : Number(formData.discount_price),

            stock: Number(formData.stock),

            thumbnail: formData.thumbnail,

            status: formData.status,
            featured: formData.featured,

            images: formData.images.filter(
                (img) => img.image.trim() !== ""
            ),

            variants: formData.variants,
        };

        onSubmit(payload);
    };
  

        /*
    |--------------------------------------------------------------------------
    | Product Variants
    |--------------------------------------------------------------------------
    */

    // Add Variant

    const addVariant = () => {

        setFormData((prev) => ({

            ...prev,

            variants: [

                ...prev.variants,

                {
                    sku: "",
                    size: "",
                    color: "",
                    price: "",
                    stock: "",
                },

            ],

        }));

    };

    /*
    |--------------------------------------------------------------------------
    | Update Variant
    |--------------------------------------------------------------------------
    */

    const updateVariant = (index, field, value) => {

        const variants = [...formData.variants];

        variants[index] = {
            ...variants[index],
            [field]: value,
        };

        setFormData((prev) => ({
            ...prev,
            variants,
        }));

    };

    /*
    |--------------------------------------------------------------------------
    | Remove Variant
    |--------------------------------------------------------------------------
    */

    const removeVariant = (index) => {

        const variants = [...formData.variants];

        variants.splice(index, 1);

        setFormData((prev) => ({
            ...prev,
            variants,
        }));

    };

  
    /*
    |--------------------------------------------------------------------------
    | End JavaScript
    |--------------------------------------------------------------------------
    */

  return (
    <form
        onSubmit={handleSubmit}
        className="space-y-6"
    >
        {/* =========================
            Basic Information
        ========================== */}

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Category */}

                <div>

                    <label className="block mb-2 font-medium">
                        Category
                    </label>

                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map(category => (

                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Brand */}

                <div>

                    <label className="block mb-2 font-medium">
                        Brand
                    </label>

                    <select
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    >
                        <option value="">
                            Select Brand
                        </option>

                        {brands.map(brand => (

                            <option
                                key={brand.id}
                                value={brand.id}
                            >
                                {brand.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Product Name */}

                <div>

                    <label className="block mb-2 font-medium">
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full border rounded-lg p-3"
                        required
                    />

                </div>

                {/* SKU */}

                <div>

                    <label className="block mb-2 font-medium">
                        SKU
                    </label>

                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="SKU"
                        className="w-full border rounded-lg p-3"
                        required
                    />

                </div>

            </div>

        </div>

        {/* =========================
            Description
        ========================== */}

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                Description
            </h2>

            {/* Short Description */}

            <div className="mb-6">

                <label className="block mb-2 font-medium">
                    Short Description
                </label>

                <textarea
                    rows="3"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    placeholder="Short Description"
                />

            </div>

            {/* Description */}

            <div>

                <label className="block mb-2 font-medium">
                    Full Description
                </label>

                <textarea
                    rows="6"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    placeholder="Product Description"
                />

            </div>

        </div>

        {/* =========================
            Pricing
        ========================== */}

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Price */}

                <div>

                    <label className="block mb-2 font-medium">
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                </div>

                {/* Discount */}

                <div>

                    <label className="block mb-2 font-medium">
                        Discount Price
                    </label>

                    <input
                        type="number"
                        name="discount_price"
                        value={formData.discount_price}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                {/* Stock */}

                <div>

                    <label className="block mb-2 font-medium">
                        Stock
                    </label>

                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                </div>

            </div>

        </div>

        <div>
    <label className="block mb-2 font-medium">
        Thumbnail URL
    </label>

    <input
        type="text"
        name="thumbnail"
        value={formData.thumbnail}
        onChange={handleThumbnailChange}
        placeholder="https://example.com/image.jpg"
        className="w-full border rounded-lg p-3"
    />

    {formData.thumbnail && (
        <img
            src={formData.thumbnail}
            alt="Thumbnail"
            className="w-24 h-24 mt-3 rounded border object-cover"
        />
    )}
</div>

        {/* =========================
            Status
        ========================== */}

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-6">
                Product Status
            </h2>

            <div className="flex flex-col md:flex-row gap-10">

                {/* Status */}

                <label className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />

                    <span>
                        Active Product
                    </span>

                </label>

                {/* Featured */}

                <label className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />

                    <span>
                        Featured Product
                    </span>

                </label>

            </div>

        </div>

                    {/* ==========================================
                PRODUCT IMAGES
            ========================================== */}

            <div className="border rounded-lg p-5 mt-8">

                <div className="flex justify-between items-center mb-4">

                    <h3 className="text-lg font-semibold">
                        Product Images
                    </h3>

                    <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + Add Image
                    </button>

                </div>

                {formData.images.length === 0 && (
                    <p className="text-gray-500">
                        No images added.
                    </p>
                )}

                {formData.images.map((image, index) => (

                    <div
                        key={index}
                        className="flex gap-3 items-center mb-4"
                    >

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={image.image}
                            onChange={(e) =>
                                updateImage(
                                    index,
                                    e.target.value
                                )
                            }
                            className="flex-1 border rounded px-3 py-2"
                        />

                        {image.image && (

                            <img
                                src={image.image}
                                alt=""
                                className="w-16 h-16 object-cover rounded border"
                            />

                        )}

                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-600 text-white px-3 py-2 rounded"
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

            {/* ==========================================
                PRODUCT VARIANTS
            ========================================== */}

            <div className="border rounded-lg p-5 mt-8">

                <div className="flex justify-between items-center mb-5">

                    <h3 className="text-lg font-semibold">
                        Product Variants
                    </h3>

                    <button
                        type="button"
                        onClick={addVariant}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + Add Variant
                    </button>

                </div>

                {formData.variants.length === 0 && (

                    <p className="text-gray-500">
                        No variants added.
                    </p>

                )}

                {formData.variants.map((variant, index) => (

                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 border rounded-lg p-4"
                    >

                        {/* SKU */}

                        <div>

                            <label className="block mb-1 font-medium">
                                SKU
                            </label>

                            <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "sku",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Size */}

                        <div>

                            <label className="block mb-1 font-medium">
                                Size
                            </label>

                            <input
                                type="text"
                                value={variant.size}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "size",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Color */}

                        <div>

                            <label className="block mb-1 font-medium">
                                Color
                            </label>

                            <input
                                type="text"
                                value={variant.color}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "color",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Price */}

                        <div>

                            <label className="block mb-1 font-medium">
                                Price
                            </label>

                            <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "price",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        {/* Stock */}

                        <div>

                            <label className="block mb-1 font-medium">
                                Stock
                            </label>

                            <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                    updateVariant(
                                        index,
                                        "stock",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>
                        

                        <div className="md:col-span-5">

                            <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Remove Variant
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* ==========================================
                SUBMIT
            ========================================== */}

            <div className="mt-8 flex justify-end">

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                >
                    {loading
                        ? "Saving..."
                        : initialData
                        ? "Update Product"
                        : "Create Product"}
                </button>

            </div>

        </form>

    );
};

export default ProductForm;


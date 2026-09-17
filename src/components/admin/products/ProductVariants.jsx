import {
    FaPlus,
    FaTrash,
} from "react-icons/fa";


const ProductVariants = ({
    variants = [],
    setVariants,
}) => {

    // ================================================
    // Add Variant
    // ================================================

    const addVariant = () => {

        setVariants([
            ...variants,

            {
                sku: "",
                size: "",
                color: "",
                price: "",
                stock: "",
            },
        ]);

    };


    // ================================================
    // Update Variant
    // ================================================

    const handleChange = (
        index,
        field,
        value
    ) => {

        const updatedVariants = [
            ...variants,
        ];

        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value,
        };

        setVariants(
            updatedVariants
        );

    };


    // ================================================
    // Remove Variant
    // ================================================

    const removeVariant = (index) => {

        const updatedVariants =
            variants.filter(
                (_, variantIndex) =>
                    variantIndex !== index
            );

        setVariants(
            updatedVariants
        );

    };


    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            {/* ======================================== */}
            {/* Header */}
            {/* ======================================== */}

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">
                    Product Variants
                </h2>


                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <FaPlus />

                    Add Variant
                </button>

            </div>


            {/* ======================================== */}
            {/* Empty */}
            {/* ======================================== */}

            {variants.length === 0 ? (

                <div className="text-center py-10 border rounded-lg text-gray-500">
                    No variants added.
                </div>

            ) : (

                <div className="space-y-6">

                    {variants.map(
                        (variant, index) => (

                            <div
                                key={
                                    variant.id ||
                                    `new-${index}`
                                }
                                className="border rounded-xl p-5 bg-gray-50"
                            >

                                {/* ================================= */}
                                {/* Variant Header */}
                                {/* ================================= */}

                                <div className="flex items-center justify-between mb-5">

                                    <h3 className="font-semibold text-lg">
                                        Variant #{index + 1}
                                    </h3>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeVariant(
                                                index
                                            )
                                        }
                                        className="text-red-600 hover:text-red-700"
                                        title="Remove Variant"
                                    >
                                        <FaTrash
                                            size={18}
                                        />
                                    </button>

                                </div>


                                {/* ================================= */}
                                {/* Variant Fields */}
                                {/* ================================= */}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                                    {/* SKU */}

                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            SKU
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                variant.sku ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "sku",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="SKU"
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Size */}

                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Size
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                variant.size ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "size",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="XL"
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Color */}

                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Color
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                variant.color ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "color",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Black"
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Price */}

                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={
                                                variant.price ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0.00"
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Stock */}

                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Stock
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                variant.stock ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "stock",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
};


export default ProductVariants;


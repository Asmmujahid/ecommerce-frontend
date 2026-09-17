import {
    FaPlus,
    FaTrash,
} from "react-icons/fa";


const ProductImages = ({
    thumbnail,
    setThumbnail,
    images = [],
    setImages,
}) => {

    // ================================================
    // Add Gallery Image
    // ================================================

    const addImage = () => {

        setImages([
            ...images,

            {
                image: "",
            },
        ]);

    };


    // ================================================
    // Update Gallery Image
    // ================================================

    const updateImage = (
        index,
        value
    ) => {

        const updatedImages =
            [...images];

        updatedImages[index] = {
            ...updatedImages[index],
            image: value,
        };

        setImages(
            updatedImages
        );

    };


    // ================================================
    // Delete Gallery Image
    // ================================================

    const removeImage = (
        index
    ) => {

        const updatedImages =
            images.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            );

        setImages(
            updatedImages
        );

    };


    return (
        <div className="bg-white shadow rounded-xl p-6">

            {/* ======================================== */}
            {/* Header */}
            {/* ======================================== */}

            <h2 className="text-xl font-semibold mb-6">
                Product Images
            </h2>


            {/* ======================================== */}
            {/* Thumbnail */}
            {/* ======================================== */}

            <div className="mb-8">

                <label className="block font-medium mb-2">
                    Thumbnail Image
                </label>

                <input
                    type="text"
                    placeholder="https://example.com/thumbnail.jpg"
                    value={thumbnail || ""}
                    onChange={(e) =>
                        setThumbnail(
                            e.target.value
                        )
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                />


                {thumbnail && (

                    <div className="mt-4">

                        <img
                            src={thumbnail}
                            alt="Product Thumbnail"
                            className="w-36 h-36 rounded-lg border object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display =
                                    "none";
                            }}
                        />

                    </div>

                )}

            </div>


            {/* ======================================== */}
            {/* Gallery */}
            {/* ======================================== */}

            <div>

                <div className="flex items-center justify-between mb-5">

                    <h3 className="font-semibold text-lg">
                        Gallery Images
                    </h3>


                    <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        <FaPlus />

                        Add Image
                    </button>

                </div>


                {/* Empty */}

                {images.length === 0 && (

                    <div className="text-center text-gray-500 border rounded-lg py-8">

                        No gallery images added.

                    </div>

                )}


                {/* Images */}

                <div className="space-y-6">

                    {images.map(
                        (item, index) => (

                            <div
                                key={
                                    item.id ||
                                    `image-${index}`
                                }
                                className="border rounded-xl p-5"
                            >

                                {/* Image Header */}

                                <div className="flex justify-between items-center mb-4">

                                    <h4 className="font-medium">
                                        Image {index + 1}
                                    </h4>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeImage(
                                                index
                                            )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                        title="Remove Image"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>


                                {/* URL */}

                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    value={
                                        typeof item === "string"
                                            ? item
                                            : item?.image || ""
                                    }
                                    onChange={(e) =>
                                        updateImage(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                                />


                                {/* Preview */}

                                {(
                                    typeof item === "string"
                                        ? item
                                        : item?.image
                                ) && (

                                    <img
                                        src={
                                            typeof item === "string"
                                                ? item
                                                : item.image
                                        }
                                        alt={`Gallery ${index + 1}`}
                                        className="mt-4 w-36 h-36 rounded-lg border object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                )}

                            </div>

                        )
                    )}

                </div>

            </div>

        </div>
    );
};


export default ProductImages;


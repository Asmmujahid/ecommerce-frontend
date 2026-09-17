import {
    FaSearch,
    FaTimes,
} from "react-icons/fa";


const ProductSearch = ({
    search,
    setSearch,
    placeholder = "Search by product name or SKU...",
}) => {

    const handleClear = () => {

        setSearch("");

    };


    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">

            <div className="relative">

                {/* Search Icon */}

                <FaSearch
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "
                />


                {/* Input */}

                <input
                    type="text"
                    value={search || ""}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder={placeholder}
                    className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        pl-11
                        pr-12
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        transition
                    "
                />


                {/* Clear Button */}

                {search && (

                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                            hover:text-red-500
                            transition
                        "
                        title="Clear Search"
                    >
                        <FaTimes size={16} />
                    </button>

                )}

            </div>

        </div>
    );
};


export default ProductSearch;


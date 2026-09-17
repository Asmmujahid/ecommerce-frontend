import { FaSearch, FaTimes } from "react-icons/fa";

const BrandSearch = ({
    search,
    setSearch,
    placeholder = "Search brands...",
}) => {
    const handleClear = () => {
        setSearch("");
    };

    return (
        <div className="relative mb-6">

            {/* Search Icon */}
            <FaSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            {/* Input */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-12 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

            {/* Clear Button */}
            {search && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
                >
                    <FaTimes size={16} />
                </button>
            )}

        </div>
    );
};

export default BrandSearch;
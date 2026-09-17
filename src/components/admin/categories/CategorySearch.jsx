import { FaSearch, FaTimes } from "react-icons/fa";

const CategorySearch = ({
    search,
    setSearch,
}) => {
    return (
        <div className="bg-white shadow rounded-xl p-4 mb-6">

            <div className="relative">

                <FaSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search category by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                    >
                        <FaTimes />
                    </button>
                )}

            </div>

        </div>
    );
};

export default CategorySearch;
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const UserSearch = ({
    search,
    setSearch,
    placeholder = "Search by name, email or phone...",
}) => {
    return (
        <div className="relative w-full md:w-96">

            {/* Search Icon */}

            <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                fontSize="small"
            />

            {/* Input */}

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    py-3
                    pl-10
                    pr-10
                    outline-none
                    transition
                    duration-200
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                "
            />

            {/* Clear Button */}

            {search && (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        hover:text-red-500
                        transition
                    "
                >
                    <ClearIcon fontSize="small" />
                </button>
            )}
        </div>
    );
};

export default UserSearch;
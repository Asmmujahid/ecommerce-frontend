import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(
                    1,
                    "...",
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const endItem = Math.min(
        currentPage * pageSize,
        totalItems
    );

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            {/* Information */}
            <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                    {startItem}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                    {endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                    {totalItems}
                </span>{" "}
                users
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                >
                    <ChevronLeft size={18} />
                    Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={index}
                            className="px-2 text-gray-500"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() =>
                                onPageChange(page)
                            }
                            className={`w-10 h-10 rounded-lg border transition ${
                                currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                >
                    Next
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

UserPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
};



export default UserPagination;
import {
    FaFilter,
    FaTimes,
} from "react-icons/fa";

const ProductFilter = ({
    filters,
    setFilters,
    categories = [],
    brands = [],
}) => {

    // --------------------------------------------------
    // Handle Filter Change
    // --------------------------------------------------

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------
    // Clear Filters
    // --------------------------------------------------

    const clearFilters = () => {
        setFilters({
            category: "",
            brand: "",
            status: "",
            featured: "",
            stock: "",
            owner_type: "",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">

            {/* ========================================= */}
            {/* Header */}
            {/* ========================================= */}

            <div className="flex items-center justify-between mb-5">

                <div className="flex items-center gap-2">

                    <FaFilter className="text-blue-600" />

                    <h3 className="text-lg font-semibold">
                        Filters
                    </h3>

                </div>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"
                >
                    <FaTimes />

                    Clear Filters
                </button>

            </div>

            {/* ========================================= */}
            {/* Filters */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

                {/* ===================================== */}
                {/* Category */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Category
                    </label>

                    <select
                        name="category"
                        value={filters?.category || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map((category) => (

                            <option
                                key={category.id}
                                value={category.name}
                            >
                                {category.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* ===================================== */}
                {/* Brand */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Brand
                    </label>

                    <select
                        name="brand"
                        value={filters?.brand || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All Brands
                        </option>

                        {brands.map((brand) => (

                            <option
                                key={brand.id}
                                value={brand.name}
                            >
                                {brand.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* ===================================== */}
                {/* Ownership */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Ownership
                    </label>

                    <select
                        name="owner_type"
                        value={filters?.owner_type || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All Ownership
                        </option>

                        <option value="admin">
                            Admin Owned
                        </option>

                        <option value="vendor">
                            Vendor Owned
                        </option>

                    </select>

                </div>

                {/* ===================================== */}
                {/* Status */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Status
                    </label>

                    <select
                        name="status"
                        value={filters?.status || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>

                </div>

                {/* ===================================== */}
                {/* Featured */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Featured
                    </label>

                    <select
                        name="featured"
                        value={filters?.featured || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All
                        </option>

                        <option value="1">
                            Featured
                        </option>

                        <option value="0">
                            Normal
                        </option>

                    </select>

                </div>

                {/* ===================================== */}
                {/* Stock */}
                {/* ===================================== */}

                <div>

                    <label className="block text-sm font-medium mb-2">
                        Stock
                    </label>

                    <select
                        name="stock"
                        value={filters?.stock || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">
                            All
                        </option>

                        <option value="in_stock">
                            In Stock
                        </option>

                        <option value="low_stock">
                            Low Stock
                        </option>

                        <option value="out_of_stock">
                            Out Of Stock
                        </option>

                    </select>

                </div>

            </div>

        </div>
    );
};

export default ProductFilter;


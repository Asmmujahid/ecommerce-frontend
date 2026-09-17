import { Link } from "react-router-dom";
import { FaPlus, FaBoxOpen, FaTags } from "react-icons/fa";

const DashboardHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
      <div className="bg-white rounded-xl shadow-md border p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* Left Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Welcome back,
                        <span className="font-semibold text-blue-600">
                            {" "}
                            {user?.name || "Admin"}
                        </span>
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        {today}
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/admin/products/create"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        <FaBoxOpen />
                        Add Product
                    </Link>

                    <Link
                        to="/admin/categories/create"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        <FaTags />
                        Add Category
                    </Link>

                    <Link
                        to="/admin/brands/create"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        <FaPlus />
                        Add Brand
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default DashboardHeader;
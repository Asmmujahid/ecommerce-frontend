import { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";

const RecentUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentUsers();
    }, []);

    const fetchRecentUsers = async () => {
        try {
            const response = await axiosInstance.get("/admin/users");

            if (response.data.success) {
                setUsers(response.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching recent users:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-5">
                    Recent Users
                </h2>

                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-14 bg-gray-200 rounded animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-5">
                Recent Users
            </h2>

            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No Users Found
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg uppercase">
                                    {user.name?.charAt(0)}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {user.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.role === "admin"
                                        ? "bg-red-100 text-red-700"
                                        : user.role === "seller"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentUsers;
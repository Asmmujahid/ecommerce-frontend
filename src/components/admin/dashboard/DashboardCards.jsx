import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";



import {
    FaUsers,
    FaBoxOpen,
    FaTags,
    FaShoppingCart,
    FaStore,
    FaTicketAlt,
    FaStar,
    FaUndoAlt,
    FaLayerGroup,
} from "react-icons/fa";


import StatCard from "./StatCard";

const DashboardCards = () => {
   

    const {
        statistics,
        loading,
        error,
    } = useSelector((state) => state.adminDashboard);

   

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                    >
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                        
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    const cards = [
        {
            title: "Users",
            value: statistics?.users?.total_users ?? 0,
            icon: <FaUsers size={26} />,
            color: "blue",
        },
        {
            title: "Products",
            value: statistics?.products?.total_products ?? 0,
            icon: <FaBoxOpen size={26} />,
            color: "green",
        },
        {
            title: "Categories",
            value: statistics?.categories?.total_categories ?? 0,
            icon: <FaTags size={26} />,
            color: "purple",
        },
        {
            title: "Brands",
            value: statistics?.brands?.total_brands ?? 0,
            icon: <FaLayerGroup size={26} />,
            color: "indigo",
        },
        {
            title: "Orders",
            value: statistics?.orders?.total_orders ?? 0,
            icon: <FaShoppingCart size={26} />,
            color: "orange",
        },
        {
            title: "Vendors",
            value: statistics?.vendors?.total_vendors ?? 0,
            icon: <FaStore size={26} />,
            color: "teal",
        },
        {
            title: "Coupons",
            value: statistics?.coupons?.total_coupons ?? 0,
            icon: <FaTicketAlt size={26} />,
            color: "yellow",
        },
        {
            title: "Reviews",
            value: statistics?.reviews?.total_reviews ?? 0,
            icon: <FaStar size={26} />,
            color: "pink",
        },
        {
            title: "Return Requests",
            value:
                statistics?.return_requests?.total_return_requests ?? 0,
            icon: <FaUndoAlt size={26} />,
            color: "red",
        },
    ];

return (
    <div
        className="
            w-full
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-6
        "
    >
        {cards.map((card) => (
            <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
            />
        ))}
    </div>
);
};

export default DashboardCards;
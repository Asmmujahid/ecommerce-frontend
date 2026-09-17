import DashboardIcon from "@mui/icons-material/Dashboard";

import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CampaignIcon from "@mui/icons-material/Campaign";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import ReviewsIcon from "@mui/icons-material/Reviews";

import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
    {
        title: "",
        items: [
            {
                text: "Dashboard",
                icon: <DashboardIcon />,
                path: "/admin/dashboard",
            },
        ],
    },

    {
        title: "CATALOG",
        items: [
            {
                text: "Categories",
                icon: <CategoryIcon />,
                path: "/admin/categories",
            },
            {
                text: "Brands",
                icon: <BrandingWatermarkIcon />,
                path: "/admin/brands",
            },
            {
                text: "Products",
                icon: <Inventory2Icon />,
                path: "/admin/products",
            },
            {
                text: "Inventory",
                icon: <WarehouseIcon />,
                path: "/admin/inventory",
            },
            {
                text: "Banners",
                icon: <CampaignIcon />,
                path: "/admin/banners",
            },
        ],
    },

    {
        title: "SALES",
        items: [
            {
                text: "Orders",
                icon: <ShoppingCartIcon />,
                path: "/admin/orders",
            },
            {
                text: "Payments",
                icon: <PaymentIcon />,
                path: "/admin/payments",
            },
            {
                text: "Coupons",
                icon: <LocalOfferIcon />,
                path: "/admin/coupons",
            },
            {
                text: "Return Requests",
                icon: <AssignmentReturnIcon />,
                path: "/admin/return-requests",
            },
        ],
    },

    {
        title: "USERS",
        items: [
            {
                text: "Users",
                icon: <PeopleIcon />,
                path: "/admin/users",
            },
            {
                text: "Vendors",
                icon: <StoreIcon />,
                path: "/admin/vendors",
            },
            {
                text: "Reviews",
                icon: <ReviewsIcon />,
                path: "/admin/reviews",
            },
        ],
    },

    {
    title: "ACCOUNT",
    items: [
        {
            text: "Profile",
            icon: <PersonIcon />,
            path: "/admin/profile",
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            path: "/logout",
            logout: true,
        },
    ],
},
];

export default menuItems;
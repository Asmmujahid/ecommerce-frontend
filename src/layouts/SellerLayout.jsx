// src/layouts/SellerLayout.jsx

import { useEffect, useState } from "react";
import {
    Link,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Box,
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PaymentIcon from "@mui/icons-material/Payment";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/authSlice";

// Common Topbar
import Topbar from "../components/Common/Topbar/Topbar";

// =====================================================
// DRAWER WIDTH
// =====================================================

const drawerWidth = 250;

// =====================================================
// SELLER MENU ITEMS
// =====================================================

const menuItems = [
    {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/seller/dashboard",
    },
    {
        text: "Products",
        icon: <Inventory2Icon />,
        path: "/seller/products",
    },
    {
        text: "Inventory",
        icon: <InventoryIcon />,
        path: "/seller/inventory",
    },
    {
        text: "Orders",
        icon: <ShoppingCartIcon />,
        path: "/seller/orders",
    },
    {
        text: "Customers",
        icon: <PeopleIcon />,
        path: "/seller/customers",
    },
    {
        text: "Coupons",
        icon: <ConfirmationNumberIcon />,
        path: "/seller/coupons",
    },
    {
        text: "Payments",
        icon: <PaymentIcon />,
        path: "/seller/payments",
    },
    {
        text: "Reviews",
        icon: <ReviewsIcon />,
        path: "/seller/reviews",
    },
    {
        text: "Analytics",
        icon: <AnalyticsIcon />,
        path: "/seller/analytics",
    },
    {
        text: "Returns",
        icon: <AssignmentReturnIcon />,
        path: "/seller/returns",
    },
    {
        text: "Store",
        icon: <StoreIcon />,
        path: "/seller/store",
    },
    {
        text: "Profile",
        icon: <PersonIcon />,
        path: "/seller/profile",
    },
];

// =====================================================
// COMPONENT
// =====================================================

const SellerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const theme = useTheme();

    // =================================================
    // AUTH STATE
    // =================================================

    const { loading: authLoading } = useSelector(
        (state) => state.auth
    );

    // =================================================
    // MOBILE
    // =================================================

    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    // =================================================
    // SIDEBAR STATE
    // =================================================

    const [sidebarOpen, setSidebarOpen] = useState(
        !isMobile
    );

    // =================================================
    // KEEP SIDEBAR STATE CORRECT WHEN SCREEN CHANGES
    // =================================================

    useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    // =================================================
    // SIDEBAR TOGGLE
    // =================================================

    const handleSidebarToggle = () => {
        setSidebarOpen((previous) => !previous);
    };

    // =================================================
    // SIDEBAR CLOSE
    // =================================================

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // =================================================
    // MENU CLICK
    // =================================================

    const handleMenuClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            // Close sidebar on mobile
            setSidebarOpen(false);

            // Go to login page
            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            /*
             * Your authSlice already clears the local
             * authentication data even when the Laravel
             * logout request fails.
             *
             * Therefore, still redirect to login.
             */
            setSidebarOpen(false);

            navigate("/login", {
                replace: true,
            });
        }
    };

    // =================================================
    // DRAWER CONTENT
    // =================================================

    const drawerContent = (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* =================================================
                SIDEBAR HEADER
            ================================================= */}

            <Toolbar
                sx={{
                    minHeight: {
                        xs: 64,
                        sm: 68,
                    },
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    noWrap
                >
                    Seller Panel
                </Typography>
            </Toolbar>

            <Divider />

            {/* =================================================
                MENU
            ================================================= */}

            <List
                sx={{
                    px: 1,
                    py: 1,
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                {menuItems.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        location.pathname.startsWith(
                            `${item.path}/`
                        );

                    return (
                        <ListItemButton
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={isActive}
                            onClick={handleMenuClick}
                            sx={{
                                mb: 0.5,
                                borderRadius: 2,

                                "&.Mui-selected": {
                                    backgroundColor:
                                        "#1976d2",

                                    color: "#fff",

                                    "& .MuiListItemIcon-root":
                                        {
                                            color: "#fff",
                                        },

                                    "&:hover": {
                                        backgroundColor:
                                            "#1565c0",
                                    },
                                },

                                "&:hover": {
                                    backgroundColor:
                                        "#f0f0f0",
                                },
                            }}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.text}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <Divider />

            <Box
                sx={{
                    px: 1,
                    py: 1,
                }}
            >
                <ListItemButton
                    onClick={handleLogout}
                    disabled={authLoading}
                    sx={{
                        borderRadius: 2,

                        color: "#d32f2f",

                        "& .MuiListItemIcon-root": {
                            color: "#d32f2f",
                        },

                        "&:hover": {
                            backgroundColor: "#ffebee",
                        },

                        "&.Mui-disabled": {
                            opacity: 0.6,
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            authLoading
                                ? "Logging out..."
                                : "Logout"
                        }
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minWidth: 0,
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                overflowX: "hidden",
            }}
        >
            <CssBaseline />

            {/* =================================================
                SIDEBAR
            ================================================= */}

            {isMobile ? (
                /*
                 * MOBILE / TABLET
                 *
                 * Temporary drawer.
                 */
                <Drawer
                    variant="temporary"
                    open={sidebarOpen}
                    onClose={handleSidebarClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                /*
                 * DESKTOP
                 *
                 * Permanent drawer that can be collapsed.
                 */
                <Box
                    sx={{
                        width: sidebarOpen
                            ? drawerWidth
                            : 0,

                        flexShrink: 0,

                        transition:
                            "width 225ms ease",

                        overflow: "visible",
                    }}
                >
                    <Drawer
                        variant="permanent"
                        open={sidebarOpen}
                        sx={{
                            width: sidebarOpen
                                ? drawerWidth
                                : 0,

                            flexShrink: 0,

                            "& .MuiDrawer-paper": {
                                width: drawerWidth,
                                boxSizing:
                                    "border-box",

                                position: "fixed",

                                height: "100vh",

                                overflowX: "hidden",

                                transform: sidebarOpen
                                    ? "translateX(0)"
                                    : `translateX(-${drawerWidth}px)`,

                                transition:
                                    "transform 225ms ease",

                                visibility: sidebarOpen
                                    ? "visible"
                                    : "hidden",
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Box>
            )}

            {/* =================================================
                MAIN AREA
            ================================================= */}

            <Box
                component="main"
                sx={{
                    flex: "1 1 auto",

                    minWidth: 0,

                    width: 0,

                    minHeight: "100vh",

                    display: "flex",

                    flexDirection: "column",

                    overflowX: "hidden",
                }}
            >
                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    onMenuClick={
                        handleSidebarToggle
                    }
                    title="Seller Dashboard"
                />

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <Box
                    sx={{
                        flex: "1 1 auto",

                        minWidth: 0,

                        width: "100%",

                        maxWidth: "100%",

                        boxSizing: "border-box",

                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },

                        overflowX: "hidden",
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default SellerLayout;

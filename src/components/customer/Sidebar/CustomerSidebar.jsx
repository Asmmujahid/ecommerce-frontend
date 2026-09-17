// src/components/customer/Sidebar/CustomerSidebar.jsx

import {
    useMemo,
} from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Avatar,
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";

import {
    DashboardOutlined,
    PersonOutline,
    ShoppingBagOutlined,
    FavoriteBorder,
    ShoppingCartOutlined,
    LocationOnOutlined,
    RateReviewOutlined,
    NotificationsNoneOutlined,
    PaymentOutlined,
    LogoutOutlined,
} from "@mui/icons-material";

import {
    logout,
} from "../../../redux/authSlice";

// =====================================================
// SIDEBAR WIDTH
// =====================================================

const sidebarWidth = 270;

// =====================================================
// COMPONENT
// =====================================================

const CustomerSidebar = ({
    onNavigate,
}) => {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const dispatch =
        useDispatch();

    // =================================================
    // AUTH USER
    // =================================================

    const user = useSelector(
        (state) =>
            state.auth?.user
    );

    // =================================================
    // USER DATA
    // =================================================

    const userName =
        user?.name ||
        "Customer";

    const userEmail =
        user?.email ||
        "customer@example.com";

    const userAvatar =
        user?.avatar ||
        "";

    const firstLetter =
        userName
            .charAt(0)
            .toUpperCase() ||
        "U";

    // =================================================
    // MENU ITEMS
    // =================================================

    const menuItems = useMemo(
        () => [
            {
                label: "Dashboard",
                path: "/customer/dashboard",
                icon: (
                    <DashboardOutlined />
                ),
            },

            {
                label: "My Profile",
                path: "/customer/profile",
                icon: (
                    <PersonOutline />
                ),
            },

            {
                label: "My Orders",
                path: "/customer/orders",
                icon: (
                    <ShoppingBagOutlined />
                ),
            },

            {
                label: "Wishlist",
                path: "/customer/wishlist",
                icon: (
                    <FavoriteBorder />
                ),
            },

            {
                label: "Cart",
                path: "/cart",
                icon: (
                    <ShoppingCartOutlined />
                ),
            },

            {
                label: "Addresses",
                path: "/customer/addresses",
                icon: (
                    <LocationOnOutlined />
                ),
            },

            {
                label: "Payments",
                path: "/customer/payments",
                icon: (
                    <PaymentOutlined />
                ),
            },

            {
                label: "Reviews",
                path: "/customer/reviews",
                icon: (
                    <RateReviewOutlined />
                ),
            },

            {
                label: "Notifications",
                path: "/customer/notifications",
                icon: (
                    <NotificationsNoneOutlined />
                ),
            },
        ],
        []
    );

    // =================================================
    // ACTIVE ROUTE
    // =================================================

    const isActive = (
        path
    ) => {
        if (
            path ===
            "/customer/dashboard"
        ) {
            return (
                location.pathname ===
                path
            );
        }

        return (
            location.pathname ===
                path ||
            location.pathname.startsWith(
                `${path}/`
            )
        );
    };

    // =================================================
    // NAVIGATION
    // =================================================

    const handleNavigation =
        (path) => {
            navigate(path);

            if (
                typeof onNavigate ===
                "function"
            ) {
                onNavigate();
            }
        };

    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout =
        async () => {
            try {
                await dispatch(
                    logout()
                ).unwrap();
            } catch (error) {
                console.error(
                    "Logout error:",
                    error
                );
            } finally {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "role"
                );

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

                if (
                    typeof onNavigate ===
                    "function"
                ) {
                    onNavigate();
                }
            }
        };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                width:
                    sidebarWidth,

                height: "100%",

                display:
                    "flex",

                flexDirection:
                    "column",

                backgroundColor:
                    "#ffffff",
            }}
        >
            {/* =================================================
                BRAND
            ================================================= */}

            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={800}
                    color="primary"
                    sx={{
                        letterSpacing:
                            0.3,
                    }}
                >
                    E-Commerce
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Customer Panel
                </Typography>
            </Box>

            <Divider />

            {/* =================================================
                USER PROFILE
            ================================================= */}

            <Box
                sx={{
                    px: 2,
                    py: 2,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Avatar
                        src={
                            userAvatar ||
                            undefined
                        }
                        alt={
                            userName
                        }
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor:
                                "primary.main",
                        }}
                    >
                        {
                            firstLetter
                        }
                    </Avatar>

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            noWrap
                        >
                            {
                                userName
                            }
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{
                                display:
                                    "block",

                                maxWidth:
                                    180,
                            }}
                        >
                            {
                                userEmail
                            }
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider />

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <Box
                sx={{
                    flexGrow: 1,

                    overflowY:
                        "auto",

                    overflowX:
                        "hidden",

                    px: 1.5,

                    py: 2,
                }}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{
                        px: 1.5,

                        fontWeight: 700,

                        letterSpacing: 1,
                    }}
                >
                    Menu
                </Typography>

                <List
                    disablePadding
                    sx={{
                        mt: 1,
                    }}
                >
                    {menuItems.map(
                        (item) => {
                            const active =
                                isActive(
                                    item.path
                                );

                            return (
                                <ListItemButton
                                    key={
                                        item.path
                                    }
                                    selected={
                                        active
                                    }
                                    onClick={() =>
                                        handleNavigation(
                                            item.path
                                        )
                                    }
                                    sx={{
                                        minHeight:
                                            48,

                                        mb: 0.5,

                                        borderRadius:
                                            2,

                                        color:
                                            active
                                                ? "primary.main"
                                                : "text.primary",

                                        "& .MuiListItemIcon-root":
                                            {
                                                minWidth:
                                                    42,

                                                color:
                                                    active
                                                        ? "primary.main"
                                                        : "text.secondary",
                                            },

                                        "&.Mui-selected":
                                            {
                                                backgroundColor:
                                                    "rgba(25, 118, 210, 0.10)",
                                            },

                                        "&.Mui-selected:hover":
                                            {
                                                backgroundColor:
                                                    "rgba(25, 118, 210, 0.16)",
                                            },

                                        "&:hover":
                                            {
                                                backgroundColor:
                                                    "action.hover",
                                            },
                                    }}
                                >
                                    <ListItemIcon>
                                        {
                                            item.icon
                                        }
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            item.label
                                        }
                                        primaryTypographyProps={{
                                            fontSize:
                                                "0.95rem",

                                            fontWeight:
                                                active
                                                    ? 700
                                                    : 500,
                                        }}
                                    />
                                </ListItemButton>
                            );
                        }
                    )}
                </List>
            </Box>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <Divider />

            <Box
                sx={{
                    p: 1.5,
                }}
            >
                <ListItemButton
                    onClick={
                        handleLogout
                    }
                    sx={{
                        minHeight:
                            48,

                        borderRadius:
                            2,

                        color:
                            "error.main",

                        "& .MuiListItemIcon-root":
                            {
                                minWidth:
                                    42,

                                color:
                                    "error.main",
                            },

                        "&:hover":
                            {
                                backgroundColor:
                                    "rgba(211, 47, 47, 0.08)",
                            },
                    }}
                >
                    <ListItemIcon>
                        <LogoutOutlined />
                    </ListItemIcon>

                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                            fontSize:
                                "0.95rem",

                            fontWeight:
                                600,
                        }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );
};

export default CustomerSidebar;
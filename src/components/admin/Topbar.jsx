// src/components/admin/Topbar.jsx

import { useState } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { logout } from "../../redux/authSlice";

import HeaderNotifications from "../notification/HeaderNotifications";

// =====================================================
// TOPBAR
// =====================================================

const Topbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = useTheme();

    const isSmallScreen = useMediaQuery(
        theme.breakpoints.down("sm")
    );

    const { user } = useSelector(
        (state) => state.auth
    );

    const [anchorEl, setAnchorEl] =
        useState(null);

    const open = Boolean(anchorEl);

    // =====================================================
    // MENU
    // =====================================================

    const handleMenuOpen = (event) => {
        setAnchorEl(
            event.currentTarget
        );
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true,
        });
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <AppBar
            position="sticky"
            elevation={1}
            color="inherit"
            sx={{
                borderBottom:
                    "1px solid #e5e7eb",

                backgroundColor:
                    "rgba(255,255,255,0.95)",

                backdropFilter:
                    "blur(8px)",

                zIndex: (
                    theme
                ) =>
                    theme.zIndex.drawer +
                    1,
            }}
        >
            <Toolbar
                sx={{
                    minWidth: 0,

                    px: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                    },
                }}
            >
                {/* =================================================
                    SIDEBAR TOGGLE
                ================================================= */}

                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    aria-label="Toggle admin sidebar"
                    sx={{
                        mr: {
                            xs: 1,
                            sm: 2,
                        },

                        flexShrink: 0,
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,

                        minWidth: 0,

                        fontWeight: 700,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        fontSize: {
                            xs: "1rem",
                            sm: "1.25rem",
                        },
                    }}
                >
                    Admin Dashboard
                </Typography>

                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <Box
                    sx={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <HeaderNotifications />
                </Box>

                {/* =================================================
                    PROFILE
                ================================================= */}

                <Tooltip title="Account">
                    <IconButton
                        onClick={
                            handleMenuOpen
                        }
                        sx={{
                            ml: {
                                xs: 0.5,
                                sm: 1,
                            },

                            flexShrink: 0,
                        }}
                        aria-label="Open account menu"
                    >
                        {user?.avatar ? (
                            <Avatar
                                src={
                                    user.avatar
                                }
                                alt={
                                    user.name ||
                                    "Admin"
                                }
                                sx={{
                                    width: {
                                        xs: 34,
                                        sm: 40,
                                    },

                                    height: {
                                        xs: 34,
                                        sm: 40,
                                    },
                                }}
                            />
                        ) : (
                            <Avatar
                                sx={{
                                    width: {
                                        xs: 34,
                                        sm: 40,
                                    },

                                    height: {
                                        xs: 34,
                                        sm: 40,
                                    },
                                }}
                            >
                                <AccountCircleIcon />
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>

                {/* =================================================
                    PROFILE MENU
                ================================================= */}

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={
                        handleMenuClose
                    }
                    anchorOrigin={{
                        vertical:
                            "bottom",
                        horizontal:
                            "right",
                    }}
                    transformOrigin={{
                        vertical:
                            "top",
                        horizontal:
                            "right",
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                minWidth: {
                                    xs: 220,
                                    sm: 250,
                                },

                                maxWidth:
                                    "calc(100vw - 24px)",
                            },
                        },
                    }}
                >
                    {/* =================================================
                        USER INFORMATION
                    ================================================= */}

                    <Box
                        px={2}
                        py={1.5}
                    >
                        <Typography
                            fontWeight="bold"
                            noWrap
                        >
                            {user?.name ||
                                "Admin"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            {user?.email ||
                                ""}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <MenuItem
                        onClick={() => {
                            navigate(
                                "/admin/dashboard"
                            );

                            handleMenuClose();
                        }}
                    >
                        <DashboardIcon
                            fontSize="small"
                            sx={{
                                mr: 1,
                            }}
                        />

                        Dashboard
                    </MenuItem>

                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <MenuItem
                        onClick={() => {
                            navigate(
                                "/admin/profile"
                            );

                            handleMenuClose();
                        }}
                    >
                        <PersonIcon
                            fontSize="small"
                            sx={{
                                mr: 1,
                            }}
                        />

                        My Profile
                    </MenuItem>

                    <Divider />

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <MenuItem
                        onClick={
                            handleLogout
                        }
                    >
                        <LogoutIcon
                            fontSize="small"
                            sx={{
                                mr: 1,
                            }}
                        />

                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;


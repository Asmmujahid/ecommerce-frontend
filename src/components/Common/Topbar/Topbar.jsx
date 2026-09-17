// src/components/Common/Topbar/Topbar.jsx

import { useState } from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import {
    logout,
} from "../../../redux/authSlice";

import HeaderNotifications from "../../notification/HeaderNotifications";


// =====================================================
// COMPONENT
// =====================================================

const Topbar = ({
    onMenuClick,
    title = "Dashboard",
}) => {
    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    // =================================================
    // AUTH USER
    // =================================================

    const user = useSelector(
        (state) =>
            state.auth?.user
    );

    // =================================================
    // MENU
    // =================================================

    const [anchorEl, setAnchorEl] =
        useState(null);

    const menuOpen =
        Boolean(anchorEl);

    // =================================================
    // USER DATA
    // =================================================

    const userName =
        user?.name ||
        "User";

    const userEmail =
        user?.email ||
        "";

    const userAvatar =
        user?.avatar ||
        "";

    const firstLetter =
        userName
            .charAt(0)
            .toUpperCase() ||
        "U";

    // =================================================
    // OPEN ACCOUNT MENU
    // =================================================

    const handleMenuOpen = (
        event
    ) => {
        setAnchorEl(
            event.currentTarget
        );
    };

    // =================================================
    // CLOSE ACCOUNT MENU
    // =================================================

    const handleMenuClose =
        () => {
            setAnchorEl(null);
        };

    // =================================================
    // NAVIGATION
    // =================================================

    const handleNavigation =
        (path) => {
            handleMenuClose();

            navigate(path);
        };

    // =================================================
    // LOGOUT
    // =================================================

    const handleLogout =
        async () => {
            handleMenuClose();

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
            }
        };

    // =================================================
    // RENDER
    // =================================================

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="inherit"
            sx={{
                backgroundColor:
                    "#ffffff",

                borderBottom:
                    "1px solid #e5e7eb",

                zIndex: (theme) =>
                    theme.zIndex.drawer +
                    1,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: {
                        xs: 64,
                        sm: 68,
                    },

                    px: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                    },

                    gap: {
                        xs: 0.5,
                        sm: 1,
                    },

                    width: "100%",

                    minWidth: 0,
                }}
            >
                {/* =================================================
                    MENU TOGGLE
                ================================================= */}

                <Tooltip title="Menu">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={
                            onMenuClick
                        }
                        aria-label="toggle sidebar"
                        sx={{
                            flexShrink: 0,

                            mr: {
                                xs: 0.5,
                                sm: 1.5,
                            },

                            color:
                                "#374151",
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Tooltip>

                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    variant="h6"
                    sx={{
                        flex: "1 1 auto",

                        minWidth: 0,

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",

                        fontWeight: 700,

                        color:
                            "#111827",

                        fontSize: {
                            xs: "0.95rem",
                            sm: "1.1rem",
                            md: "1.25rem",
                        },
                    }}
                >
                    {title}
                </Typography>

                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <Box
                    sx={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        flexShrink: 0,

                        gap: {
                            xs: 0.25,
                            sm: 0.75,
                        },
                    }}
                >
                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <Box
                        sx={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            flexShrink: 0,
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
                            aria-controls={
                                menuOpen
                                    ? "account-menu"
                                    : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={
                                menuOpen
                                    ? "true"
                                    : undefined
                            }
                            sx={{
                                p: 0.5,

                                flexShrink: 0,
                            }}
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
                                    width: {
                                        xs: 34,
                                        sm: 40,
                                    },

                                    height: {
                                        xs: 34,
                                        sm: 40,
                                    },

                                    bgcolor:
                                        "primary.main",
                                }}
                            >
                                {
                                    firstLetter
                                }
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* =================================================
                    ACCOUNT MENU
                ================================================= */}

                <Menu
                    id="account-menu"
                    anchorEl={
                        anchorEl
                    }
                    open={
                        menuOpen
                    }
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
                    PaperProps={{
                        elevation: 4,

                        sx: {
                            mt: 1,

                            width: {
                                xs: 240,
                                sm: 270,
                            },

                            maxWidth:
                                "calc(100vw - 24px)",

                            borderRadius: 2,

                            border:
                                "1px solid #e5e7eb",

                            overflow:
                                "hidden",
                        },
                    }}
                >
                    {/* =================================================
                        USER INFORMATION
                    ================================================= */}

                    <Box
                        sx={{
                            px: 2,
                            py: 1.75,
                        }}
                    >
                        <Box
                            sx={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 1.5,

                                minWidth: 0,
                            }}
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
                                    width: 42,
                                    height: 42,

                                    flexShrink: 0,

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
                                    minWidth:
                                        0,

                                    flex: 1,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    noWrap
                                >
                                    {
                                        userName
                                    }
                                </Typography>

                                {userEmail && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {
                                            userEmail
                                        }
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Divider />

                    {/* =================================================
                        HOME
                    ================================================= */}

                    <MenuItem
                        onClick={() =>
                            handleNavigation(
                                "/"
                            )
                        }
                        sx={{
                            py: 1.25,
                            px: 2,
                        }}
                    >
                        <ListItemIcon>
                            <HomeIcon fontSize="small" />
                        </ListItemIcon>

                        Home
                    </MenuItem>

                    {/* =================================================
                        SELLER DASHBOARD
                    ================================================= */}

                    <MenuItem
                        onClick={() =>
                            handleNavigation(
                                "/seller/dashboard"
                            )
                        }
                        sx={{
                            py: 1.25,
                            px: 2,
                        }}
                    >
                        <ListItemIcon>
                            <DashboardIcon fontSize="small" />
                        </ListItemIcon>

                        Dashboard
                    </MenuItem>

                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <MenuItem
                        onClick={() =>
                            handleNavigation(
                                "/seller/profile"
                            )
                        }
                        sx={{
                            py: 1.25,
                            px: 2,
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>

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
                        sx={{
                            py: 1.25,
                            px: 2,

                            color:
                                "error.main",
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon
                                fontSize="small"
                                sx={{
                                    color:
                                        "error.main",
                                }}
                            />
                        </ListItemIcon>

                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
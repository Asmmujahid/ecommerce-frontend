// src/components/admin/Sidebar.jsx

import { useDispatch } from "react-redux";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Drawer,
    Toolbar,
    Typography,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    IconButton,
    useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { logout } from "../../redux/authSlice";

import menuItems from "./MenuItems.jsx";

// =====================================================
// CONSTANTS
// =====================================================

const drawerWidth = 260;

// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = ({
    open,
    onClose,
    isMobile,
}) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );

            // Even if API logout fails,
            // remove local authentication.
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            navigate("/", {
                replace: true,
            });
        }
    };

    // =====================================================
    // MENU ITEM CLICK
    // =====================================================

    const handleMenuItemClick = (item) => {
        if (item.logout === true) {
            handleLogout();
            return;
        }

        // On mobile/tablet, close drawer after navigation.
        if (isMobile) {
            onClose();
        }
    };

    // =====================================================
    // MOBILE DRAWER
    // =====================================================

    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },

                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",

                        backgroundColor: "#ffffff",

                        borderRight:
                            "1px solid #e5e7eb",

                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.15)",

                        zIndex:
                            theme.zIndex.drawer + 2,
                    },
                }}
            >
                {/* =================================================
                    MOBILE HEADER
                ================================================= */}

                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        minHeight: "64px !important",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        noWrap
                    >
                        Admin Panel
                    </Typography>

                    <IconButton
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>

                <Divider />

                {/* =================================================
                    MENU
                ================================================= */}

                <Box
                    sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        flexGrow: 1,
                    }}
                >
                    <List
                        disablePadding
                        sx={{
                            py: 1,
                        }}
                    >
                        {menuItems.map(
                            (section, sectionIndex) => (
                                <Box
                                    key={
                                        section.title ||
                                        `section-${sectionIndex}`
                                    }
                                >
                                    {/* Section Title */}

                                    {section.title && (
                                        <Typography
                                            sx={{
                                                px: 2,
                                                pt: 2,
                                                pb: 1,

                                                fontSize: 12,
                                                fontWeight: 700,

                                                color:
                                                    "text.secondary",

                                                letterSpacing: 1,

                                                textTransform:
                                                    "uppercase",
                                            }}
                                        >
                                            {
                                                section.title
                                            }
                                        </Typography>
                                    )}

                                    {/* Section Items */}

                                    {section.items.map(
                                        (item) => {
                                            const isLogout =
                                                item.logout ===
                                                true;

                                            const isSelected =
                                                !isLogout &&
                                                location.pathname ===
                                                    item.path;

                                            return (
                                                <ListItemButton
                                                    key={
                                                        item.text
                                                    }
                                                    component={
                                                        isLogout
                                                            ? "button"
                                                            : Link
                                                    }
                                                    to={
                                                        isLogout
                                                            ? undefined
                                                            : item.path
                                                    }
                                                    onClick={() =>
                                                        handleMenuItemClick(
                                                            item
                                                        )
                                                    }
                                                    selected={
                                                        isSelected
                                                    }
                                                    sx={{
                                                        mx: 1,
                                                        mb: 0.5,

                                                        minHeight: 46,

                                                        borderRadius: 2,

                                                        color:
                                                            "text.primary",

                                                        "& .MuiListItemIcon-root":
                                                            {
                                                                minWidth: 40,
                                                                color:
                                                                    "inherit",
                                                            },

                                                        "&.Mui-selected":
                                                            {
                                                                backgroundColor:
                                                                    "#1976d2",

                                                                color:
                                                                    "#fff",

                                                                "& .MuiListItemIcon-root":
                                                                    {
                                                                        color:
                                                                            "#fff",
                                                                    },
                                                            },

                                                        "&.Mui-selected:hover":
                                                            {
                                                                backgroundColor:
                                                                    "#1565c0",
                                                            },

                                                        "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    "#f0f0f0",
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
                                                            item.text
                                                        }
                                                    />
                                                </ListItemButton>
                                            );
                                        }
                                    )}

                                    <Divider
                                        sx={{
                                            my: 1,
                                        }}
                                    />
                                </Box>
                            )
                        )}
                    </List>
                </Box>
            </Drawer>
        );
    }

    // =====================================================
    // DESKTOP DRAWER
    // =====================================================

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                display: {
                    xs: "none",
                    md: "block",
                },

                width: open
                    ? drawerWidth
                    : 0,

                flexShrink: 0,

                transition:
                    theme.transitions.create(
                        "width",
                        {
                            duration:
                                theme.transitions.duration
                                    .shorter,
                        }
                    ),

                "& .MuiDrawer-paper": {
                    width: drawerWidth,

                    boxSizing: "border-box",

                    backgroundColor: "#ffffff",

                    borderRight:
                        "1px solid #e5e7eb",

                    overflowX: "hidden",

                    // IMPORTANT:
                    // When closed, move the drawer
                    // completely outside the screen.
                    transform: open
                        ? "translateX(0)"
                        : `translateX(-${drawerWidth}px)`,

                    transition:
                        theme.transitions.create(
                            "transform",
                            {
                                duration:
                                    theme.transitions.duration
                                        .shorter,
                            }
                        ),
                },
            }}
        >
            {/* =================================================
                DESKTOP HEADER
            ================================================= */}

            <Toolbar
                sx={{
                    minHeight:
                        "64px !important",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    noWrap
                >
                    Admin Panel
                </Typography>
            </Toolbar>

            <Divider />

            {/* =================================================
                MENU
            ================================================= */}

            <Box
                sx={{
                    height: "calc(100vh - 65px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <List
                    disablePadding
                    sx={{
                        py: 1,
                    }}
                >
                    {menuItems.map(
                        (section, sectionIndex) => (
                            <Box
                                key={
                                    section.title ||
                                    `section-${sectionIndex}`
                                }
                            >
                                {/* Section Title */}

                                {section.title && (
                                    <Typography
                                        sx={{
                                            px: 2,
                                            pt: 2,
                                            pb: 1,

                                            fontSize: 12,
                                            fontWeight: 700,

                                            color:
                                                "text.secondary",

                                            letterSpacing: 1,

                                            textTransform:
                                                "uppercase",
                                        }}
                                    >
                                        {
                                            section.title
                                        }
                                    </Typography>
                                )}

                                {/* Section Items */}

                                {section.items.map(
                                    (item) => {
                                        const isLogout =
                                            item.logout ===
                                            true;

                                        const isSelected =
                                            !isLogout &&
                                            location.pathname ===
                                                item.path;

                                        return (
                                            <ListItemButton
                                                key={
                                                    item.text
                                                }
                                                component={
                                                    isLogout
                                                        ? "button"
                                                        : Link
                                                }
                                                to={
                                                    isLogout
                                                        ? undefined
                                                        : item.path
                                                }
                                                onClick={() =>
                                                    handleMenuItemClick(
                                                        item
                                                    )
                                                }
                                                selected={
                                                    isSelected
                                                }
                                                sx={{
                                                    mx: 1,
                                                    mb: 0.5,

                                                    minHeight: 46,

                                                    borderRadius: 2,

                                                    color:
                                                        "text.primary",

                                                    "& .MuiListItemIcon-root":
                                                        {
                                                            minWidth: 40,
                                                            color:
                                                                "inherit",
                                                        },

                                                    "&.Mui-selected":
                                                        {
                                                            backgroundColor:
                                                                "#1976d2",

                                                            color:
                                                                "#fff",

                                                            "& .MuiListItemIcon-root":
                                                                {
                                                                    color:
                                                                        "#fff",
                                                                },
                                                        },

                                                    "&.Mui-selected:hover":
                                                        {
                                                            backgroundColor:
                                                                "#1565c0",
                                                        },

                                                    "&:hover":
                                                        {
                                                            backgroundColor:
                                                                "#f0f0f0",
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
                                                        item.text
                                                    }
                                                />
                                            </ListItemButton>
                                        );
                                    }
                                )}

                                <Divider
                                    sx={{
                                        my: 1,
                                    }}
                                />
                            </Box>
                        )
                    )}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;


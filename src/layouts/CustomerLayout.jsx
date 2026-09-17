// src/layouts/CustomerLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
    Box,
    CssBaseline,
    Drawer,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import CustomerSidebar from "../components/customer/Sidebar/CustomerSidebar";
import Topbar from "../components/Common/Topbar/Topbar";

// =====================================================
// CONSTANTS
// =====================================================

const drawerWidth = 270;

// =====================================================
// COMPONENT
// =====================================================

const CustomerLayout = () => {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("lg")
    );

    const [mobileOpen, setMobileOpen] =
        useState(false);

    // =================================================
    // OPEN / CLOSE SIDEBAR
    // =================================================

    const handleDrawerToggle = () => {
        setMobileOpen(
            (previous) => !previous
        );
    };

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                display: "flex",

                minHeight: "100vh",

                width: "100%",

                backgroundColor: "#f5f7fb",

                overflow: "hidden",
            }}
        >
            <CssBaseline />

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <Box
                component="nav"
                sx={{
                    width: {
                        lg: drawerWidth,
                    },

                    flexShrink: {
                        lg: 0,
                    },
                }}
                aria-label="customer navigation"
            >
                {/* =================================================
                    MOBILE DRAWER
                ================================================= */}

                <Drawer
                    variant="temporary"
                    open={
                        isMobile
                            ? mobileOpen
                            : false
                    }
                    onClose={
                        handleDrawerClose
                    }
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: {
                            xs: "block",
                            lg: "none",
                        },

                        "& .MuiDrawer-paper": {
                            width: drawerWidth,

                            boxSizing:
                                "border-box",

                            backgroundColor:
                                "#ffffff",

                            borderRight:
                                "1px solid #e5e7eb",
                        },
                    }}
                >
                    <CustomerSidebar
                        onNavigate={
                            handleDrawerClose
                        }
                    />
                </Drawer>

                {/* =================================================
                    DESKTOP DRAWER
                ================================================= */}

                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: {
                            xs: "none",
                            lg: "block",
                        },

                        "& .MuiDrawer-paper": {
                            width: drawerWidth,

                            boxSizing:
                                "border-box",

                            backgroundColor:
                                "#ffffff",

                            borderRight:
                                "1px solid #e5e7eb",

                            position: "fixed",

                            height: "100vh",
                        },
                    }}
                >
                    <CustomerSidebar />
                </Drawer>
            </Box>

            {/* =====================================================
                MAIN AREA
            ===================================================== */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,

                    width: {
                        xs: "100%",

                        lg: `calc(100% - ${drawerWidth}px)`,
                    },

                    minWidth: 0,

                    minHeight: "100vh",

                    display: "flex",

                    flexDirection: "column",

                    overflow: "hidden",
                }}
            >
                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    onMenuClick={
                        handleDrawerToggle
                    }
                />

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <Box
                    sx={{
                        flexGrow: 1,

                        width: "100%",

                        minWidth: 0,

                        boxSizing:
                            "border-box",

                        p: {
                            xs: 1.5,
                            sm: 2.5,
                            md: 3,
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

export default CustomerLayout;
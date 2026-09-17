// src/layouts/AdminLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
    Box,
    CssBaseline,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

// =====================================================
// ADMIN LAYOUT
// =====================================================

const AdminLayout = () => {
    const theme = useTheme();

    // Detect smaller screens.
    // This is especially important when Chrome DevTools
    // reduces the available viewport width.
    const isMobile = useMediaQuery(
        theme.breakpoints.down("md")
    );

    // Sidebar starts open on desktop and closed on mobile.
    const [sidebarOpen, setSidebarOpen] = useState(
        !isMobile
    );

    // =====================================================
    // OPEN / CLOSE SIDEBAR
    // =====================================================

    const handleSidebarToggle = () => {
        setSidebarOpen((previous) => !previous);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // =====================================================
    // KEEP SIDEBAR STATE CORRECT WHEN SCREEN CHANGES
    // =====================================================

    // We don't need an effect here.
    // Sidebar itself uses the responsive breakpoint.
    // The current state is still controlled by this layout.

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
                position: "relative",
            }}
        >
            <CssBaseline />

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                isMobile={isMobile}
            />

            {/* =================================================
                MAIN AREA
            ================================================= */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
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
                    onMenuClick={handleSidebarToggle}
                />

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <Box
                    sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        width: "100%",

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

export default AdminLayout;


// src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Common/Footer/Footer";

// =====================================================
// MAIN LAYOUT
// =====================================================

const MainLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f8f9fa",
            }}
        >
            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <Navbar />

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                }}
            >
                {/*
                 * IMPORTANT:
                 *
                 * Do NOT put Container around Outlet here.
                 *
                 * Individual pages such as Products, ProductDetails,
                 * Categories, etc. can control their own Container.
                 */}

                <Outlet />
            </Box>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <Footer />
        </Box>
    );
};

export default MainLayout;
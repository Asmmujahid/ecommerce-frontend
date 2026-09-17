
// src/pages/Customer/Banners/Banners.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    Typography,
} from "@mui/material";

import {
    fetchBanners,
    selectBanners,
    selectBannerLoading,
    selectBannerError,
} from "../../../redux/customer/bannerSlice";

import BannerList from "../../../components/customer/banners/BannerList";

// =====================================================
// Component
// =====================================================

const Banners = () => {
    const dispatch = useDispatch();

    // =================================================
    // Redux State
    // =================================================

    const banners = useSelector(selectBanners);

    const loading = useSelector(
        selectBannerLoading
    );

    const error = useSelector(
        selectBannerError
    );

    // =================================================
    // Fetch Banners
    // =================================================

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    // =================================================
    // Render
    // =================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                py: {
                    xs: 3,
                    sm: 5,
                    md: 7,
                },
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    px: {
                        xs: 0,
                        sm: 2,
                    },
                }}
            >
                {/* =========================================
                    Page Header
                ========================================= */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 0,
                        },
                        mb: {
                            xs: 3,
                            sm: 4,
                        },
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        justifyContent:
                            "space-between",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight={800}
                            color="text.primary"
                            sx={{
                                fontSize: {
                                    xs: "1.8rem",
                                    sm: "2.2rem",
                                    md: "2.5rem",
                                },
                            }}
                        >
                            Banners
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                            }}
                        >
                            Discover our latest offers,
                            promotions and featured
                            products.
                        </Typography>
                    </Box>

                    {/* =====================================
                        Back to Home
                    ===================================== */}

                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>

                {/* =========================================
                    Banner List
                ========================================= */}

                <BannerList
                    banners={banners}
                    loading={loading}
                    error={error}
                />

                {/* =========================================
                    Banner Count
                ========================================= */}

                {!loading &&
                    !error &&
                    banners.length > 0 && (
                        <Box
                            sx={{
                                mt: 4,
                                px: {
                                    xs: 2,
                                    sm: 0,
                                },
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                textAlign="center"
                            >
                                Showing{" "}
                                <strong>
                                    {banners.length}
                                </strong>{" "}
                                active banner
                                {banners.length !== 1
                                    ? "s"
                                    : ""}
                            </Typography>
                        </Box>
                    )}
            </Container>
        </Box>
    );
};

export default Banners;



// src/components/customer/banners/BannerList.jsx

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";

import {
    ChevronLeft,
    ChevronRight,
    OpenInNew,
} from "@mui/icons-material";

// =====================================================
// CONSTANTS
// =====================================================

import { STORAGE_URL } from "../../../utils/storage";

const AUTO_SLIDE_INTERVAL = 5000;

const FALLBACK_IMAGE =
    "/images/no-image.png";

// =====================================================
// COMPONENT
// =====================================================

const BannerList = ({
    banners = [],
    loading = false,
    error = null,
}) => {
    // =================================================
    // STATE
    // =================================================

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isPaused, setIsPaused] =
        useState(false);

    // =================================================
    // VALID BANNERS
    // =================================================

    const validBanners = useMemo(() => {
        if (!Array.isArray(banners)) {
            return [];
        }

        return banners.filter(
            (banner) =>
                banner &&
                typeof banner === "object"
        );
    }, [banners]);

    // =================================================
    // RESET CURRENT INDEX
    // =================================================

    useEffect(() => {
        if (validBanners.length === 0) {
            setCurrentIndex(0);
            return;
        }

        setCurrentIndex((previousIndex) => {
            if (
                previousIndex >=
                validBanners.length
            ) {
                return 0;
            }

            return previousIndex;
        });
    }, [validBanners.length]);

    // =================================================
    // NEXT BANNER
    // =================================================

    const handleNext = useCallback(() => {
        if (validBanners.length <= 1) {
            return;
        }

        setCurrentIndex(
            (previousIndex) =>
                (previousIndex + 1) %
                validBanners.length
        );
    }, [validBanners.length]);

    // =================================================
    // PREVIOUS BANNER
    // =================================================

    const handlePrevious = useCallback(() => {
        if (validBanners.length <= 1) {
            return;
        }

        setCurrentIndex(
            (previousIndex) =>
                previousIndex === 0
                    ? validBanners.length - 1
                    : previousIndex - 1
        );
    }, [validBanners.length]);

    // =================================================
    // AUTO SLIDE
    // =================================================

    useEffect(() => {
        if (
            loading ||
            isPaused ||
            validBanners.length <= 1
        ) {
            return;
        }

        const intervalId = setInterval(() => {
            handleNext();
        }, AUTO_SLIDE_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [
        loading,
        isPaused,
        validBanners.length,
        handleNext,
    ]);

    // =================================================
    // IMAGE URL
    // =================================================

    const getImageUrl = useCallback(
        (banner) => {
            if (!banner?.image) {
                return FALLBACK_IMAGE;
            }

            const image =
                String(
                    banner.image
                ).trim();

            if (!image) {
                return FALLBACK_IMAGE;
            }

            // -----------------------------------------
            // Full URL
            // -----------------------------------------

            if (
                image.startsWith(
                    "http://"
                ) ||
                image.startsWith(
                    "https://"
                )
            ) {
                return image;
            }

            // -----------------------------------------
            // Laravel Storage URL
            // -----------------------------------------

            return `${STORAGE_URL}/${image.replace(
                /^\/+/,
                ""
            )}`;
        },
        []
    );

    // =================================================
    // LOADING STATE
    // =================================================

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: {
                        xs: 250,
                        sm: 350,
                        md: 450,
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        "background.paper",
                    borderRadius: {
                        xs: 0,
                        sm: 3,
                    },
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =================================================
    // ERROR STATE
    // =================================================

    if (error) {
        return (
            <Box
                sx={{
                    width: "100%",
                    p: 3,
                }}
            >
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    // =================================================
    // EMPTY STATE
    // =================================================

    if (validBanners.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        "background.paper",
                    borderRadius: {
                        xs: 0,
                        sm: 3,
                    },
                    px: 3,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                >
                    No Banners Available
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Promotional banners will
                    appear here.
                </Typography>
            </Box>
        );
    }

    // =================================================
    // CURRENT BANNER
    // =================================================

    const currentBanner =
        validBanners[currentIndex];

    // =================================================
    // CURRENT IMAGE
    // =================================================

    const imageUrl =
        getImageUrl(currentBanner);

    // =================================================
    // BANNER LINK
    // =================================================

    const bannerLink =
        currentBanner?.link
            ? String(
                  currentBanner.link
              ).trim()
            : "";

    const isExternalLink =
        bannerLink.startsWith(
            "http://"
        ) ||
        bannerLink.startsWith(
            "https://"
        );

    // =================================================
    // SELECT BANNER
    // =================================================

    const handleSelectBanner = (
        index
    ) => {
        setCurrentIndex(index);
    };

    // =================================================
    // KEYBOARD NAVIGATION
    // =================================================

    const handleKeyDown = (event) => {
        if (
            validBanners.length <= 1
        ) {
            return;
        }

        if (
            event.key === "ArrowLeft"
        ) {
            event.preventDefault();

            handlePrevious();
        }

        if (
            event.key === "ArrowRight"
        ) {
            event.preventDefault();

            handleNext();
        }
    };

    // =================================================
    // BANNER CONTENT
    // =================================================

    const bannerContent = (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                borderRadius: {
                    xs: 0,
                    sm: 3,
                },
                backgroundColor:
                    "#111827",
            }}
        >
            {/* =========================================
                BANNER IMAGE
            ========================================= */}

            <CardMedia
                component="img"
                image={imageUrl}
                alt={
                    currentBanner?.title ||
                    "Promotional banner"
                }
                onError={(event) => {
                    const target =
                        event.currentTarget;

                    if (
                        !target.src.includes(
                            FALLBACK_IMAGE
                        )
                    ) {
                        target.src =
                            FALLBACK_IMAGE;
                    }
                }}
                sx={{
                    width: "100%",
                    height: {
                        xs: 250,
                        sm: 350,
                        md: 450,
                        lg: 500,
                    },
                    objectFit: "cover",
                    display: "block",
                }}
            />

            {/* =========================================
                DARK GRADIENT OVERLAY
            ========================================= */}

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(90deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 100%)",
                    pointerEvents: "none",
                }}
            />

            {/* =========================================
                BANNER INFORMATION
            ========================================= */}

            {(currentBanner?.title ||
                currentBanner?.description ||
                bannerLink) && (
                <Box
                    sx={{
                        position: "absolute",
                        left: {
                            xs: 20,
                            sm: 40,
                            md: 60,
                        },
                        right: {
                            xs: 20,
                            sm: 40,
                        },
                        top: "50%",
                        transform:
                            "translateY(-50%)",
                        maxWidth: {
                            xs: "75%",
                            sm: "60%",
                            md: "50%",
                        },
                        color: "white",
                        zIndex: 2,
                    }}
                >
                    {/* =================================
                        TITLE
                    ================================= */}

                    {currentBanner?.title && (
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight={800}
                            sx={{
                                fontSize: {
                                    xs: "1.5rem",
                                    sm: "2.2rem",
                                    md: "3rem",
                                    lg: "3.5rem",
                                },
                                lineHeight: 1.15,
                                textShadow:
                                    "0 2px 8px rgba(0,0,0,0.45)",
                            }}
                        >
                            {
                                currentBanner.title
                            }
                        </Typography>
                    )}

                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    {currentBanner?.description && (
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 1.5,
                                color:
                                    "rgba(255,255,255,0.92)",
                                maxWidth: 500,
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },
                                lineHeight: 1.6,
                            }}
                        >
                            {
                                currentBanner.description
                            }
                        </Typography>
                    )}

                    {/* =================================
                        SHOP NOW
                    ================================= */}

                    {bannerLink && (
                        <Button
                            component="span"
                            variant="contained"
                            size="large"
                            endIcon={
                                <OpenInNew />
                            }
                            sx={{
                                mt: 3,
                                fontWeight: 700,
                                textTransform:
                                    "none",
                            }}
                        >
                            Shop Now
                        </Button>
                    )}
                </Box>
            )}

            {/* =========================================
                PREVIOUS BUTTON
            ========================================= */}

            {validBanners.length > 1 && (
                <IconButton
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        handlePrevious();
                    }}
                    aria-label="Previous banner"
                    sx={{
                        position: "absolute",
                        left: {
                            xs: 8,
                            sm: 16,
                        },
                        top: "50%",
                        transform:
                            "translateY(-50%)",
                        width: {
                            xs: 38,
                            sm: 44,
                        },
                        height: {
                            xs: 38,
                            sm: 44,
                        },
                        backgroundColor:
                            "rgba(255,255,255,0.92)",
                        color: "#111827",
                        zIndex: 5,

                        "&:hover": {
                            backgroundColor:
                                "#ffffff",
                        },
                    }}
                >
                    <ChevronLeft />
                </IconButton>
            )}

            {/* =========================================
                NEXT BUTTON
            ========================================= */}

            {validBanners.length > 1 && (
                <IconButton
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        handleNext();
                    }}
                    aria-label="Next banner"
                    sx={{
                        position: "absolute",
                        right: {
                            xs: 8,
                            sm: 16,
                        },
                        top: "50%",
                        transform:
                            "translateY(-50%)",
                        width: {
                            xs: 38,
                            sm: 44,
                        },
                        height: {
                            xs: 38,
                            sm: 44,
                        },
                        backgroundColor:
                            "rgba(255,255,255,0.92)",
                        color: "#111827",
                        zIndex: 5,

                        "&:hover": {
                            backgroundColor:
                                "#ffffff",
                        },
                    }}
                >
                    <ChevronRight />
                </IconButton>
            )}

            {/* =========================================
                DOT INDICATORS
            ========================================= */}

            {validBanners.length > 1 && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 18,
                        left: "50%",
                        transform:
                            "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        zIndex: 5,
                    }}
                >
                    {validBanners.map(
                        (
                            banner,
                            index
                        ) => (
                            <Box
                                key={
                                    banner?.id ??
                                    index
                                }
                                component="button"
                                type="button"
                                onClick={(
                                    event
                                ) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    handleSelectBanner(
                                        index
                                    );
                                }}
                                aria-label={`Go to banner ${
                                    index + 1
                                }`}
                                aria-current={
                                    index ===
                                    currentIndex
                                        ? "true"
                                        : undefined
                                }
                                sx={{
                                    width:
                                        index ===
                                        currentIndex
                                            ? 28
                                            : 9,
                                    height: 9,
                                    border: 0,
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    padding: 0,
                                    backgroundColor:
                                        index ===
                                        currentIndex
                                            ? "#ffffff"
                                            : "rgba(255,255,255,0.55)",
                                    transition:
                                        "all 0.25s ease",

                                    "&:hover": {
                                        backgroundColor:
                                            "#ffffff",
                                    },
                                }}
                            />
                        )
                    )}
                </Box>
            )}
        </Card>
    );

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
            }}
            onMouseEnter={() =>
                setIsPaused(true)
            }
            onMouseLeave={() =>
                setIsPaused(false)
            }
            onFocus={() =>
                setIsPaused(true)
            }
            onBlur={() =>
                setIsPaused(false)
            }
            onKeyDown={handleKeyDown}
            tabIndex={
                validBanners.length > 1
                    ? 0
                    : undefined
            }
            role={
                validBanners.length > 1
                    ? "region"
                    : undefined
            }
            aria-label={
                validBanners.length > 1
                    ? "Promotional banner slider"
                    : undefined
            }
        >
            {/* =========================================
                EXTERNAL LINK
            ========================================= */}

            {bannerLink &&
            isExternalLink ? (
                <a
                    href={bannerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "block",
                        textDecoration:
                            "none",
                    }}
                >
                    {bannerContent}
                </a>
            ) : bannerLink ? (
                /* =====================================
                    INTERNAL LINK
                ===================================== */

                <Link
                    to={bannerLink}
                    style={{
                        display: "block",
                        textDecoration:
                            "none",
                    }}
                >
                    {bannerContent}
                </Link>
            ) : (
                /* =====================================
                    NO LINK
                ===================================== */

                bannerContent
            )}
        </Box>
    );
};

// =====================================================
// EXPORT
// =====================================================

export default BannerList;


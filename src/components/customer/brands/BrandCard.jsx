
// src/components/customer/brands/BrandCard.jsx

import { Link } from "react-router-dom";

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
} from "@mui/material";

// =====================================================
// Storage URL
// =====================================================

const STORAGE_URL =
    "http://127.0.0.1:8000/storage";

// =====================================================
// Brand Logo Helper
// =====================================================

const getBrandLogo = (brand) => {
    if (!brand?.logo) {
        return "/images/no-image.png";
    }

    const logo = String(brand.logo).trim();

    // Already complete URL
    if (
        logo.startsWith("http://") ||
        logo.startsWith("https://")
    ) {
        return logo;
    }

    // Remove leading slashes
    const cleanLogo = logo.replace(/^\/+/, "");

    // Already contains storage/
    if (cleanLogo.startsWith("storage/")) {
        return `http://127.0.0.1:8000/${cleanLogo}`;
    }

    return `${STORAGE_URL}/${cleanLogo}`;
};

// =====================================================
// Component
// =====================================================

const BrandCard = ({ brand }) => {
    if (!brand?.id) {
        return null;
    }

    const logo = getBrandLogo(brand);

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",

                border: "1px solid",
                borderColor: "grey.200",

                backgroundColor: "#fff",

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 4,
                },
            }}
        >
            <CardActionArea
                component={Link}
                to={`/brands/${brand.id}/products`}
                sx={{
                    height: "100%",
                    minHeight: 145,

                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",
                    justifyContent: "center",

                    textDecoration: "none",
                    color: "inherit",

                    p: 1.5,
                }}
            >
                {/* =========================================
                    LOGO
                ========================================= */}

                <Box
                    sx={{
                        width: "100%",
                        height: 85,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: "#f8fafc",

                        borderRadius: 1.5,

                        p: 1,
                    }}
                >
                    <CardMedia
                        component="img"
                        image={logo}
                        alt={
                            brand.name ||
                            "Brand logo"
                        }
                        onError={(event) => {
                            event.currentTarget.onerror =
                                null;

                            event.currentTarget.src =
                                "/images/no-image.png";
                        }}
                        sx={{
                            maxWidth: "90%",
                            maxHeight: 65,
                            width: "auto",
                            objectFit: "contain",
                        }}
                    />
                </Box>

                {/* =========================================
                    BRAND NAME
                ========================================= */}

                <CardContent
                    sx={{
                        width: "100%",
                        p: "10px 4px 2px !important",

                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="text.primary"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {brand.name ||
                            "Unnamed Brand"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default BrandCard;


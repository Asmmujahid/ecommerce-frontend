// src/components/Common/Footer/Footer.jsx

import {
    Box,
    Container,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import {
    Facebook,
    Instagram,
    Twitter,
    Email,
    Phone,
    LocationOn,
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

// =====================================================
// FOOTER
// =====================================================

const Footer = () => {
    const currentYear =
        new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                width: "100%",
                bgcolor: "#111827",
                color: "#ffffff",
                mt: "auto",
            }}
        >
           
            {/* =====================================================
                MAIN FOOTER
            ===================================================== */}

            <Box
                sx={{
                    bgcolor: "#111827",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        px: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",

                            /*
                             * IMPORTANT:
                             * CSS Grid prevents the columns from
                             * overlapping.
                             */

                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1.5fr 1fr 1fr",
                                md: "1.5fr 1fr 1fr 1.3fr",
                            },

                            columnGap: {
                                xs: 0,
                                sm: 4,
                                md: 5,
                            },

                            rowGap: {
                                xs: 4,
                                sm: 4,
                                md: 0,
                            },

                            py: {
                                xs: 4,
                                sm: 5,
                            },
                        }}
                    >
                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1.5,
                                    fontSize: "1.15rem",
                                }}
                            >
                                E-Commerce
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#9ca3af",
                                    lineHeight: 1.8,
                                    maxWidth: 310,
                                }}
                            >
                                Your trusted online
                                shopping platform for
                                quality products, secure
                                payments, and a smooth
                                shopping experience.
                            </Typography>

                            {/* SOCIAL ICONS */}

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    mt: 2.5,
                                }}
                            >
                                <IconButton
                                    component="a"
                                    href="#"
                                    aria-label="Facebook"
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        color: "#ffffff",
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)",

                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.16)",
                                        },
                                    }}
                                >
                                    <Facebook
                                        fontSize="small"
                                    />
                                </IconButton>

                                <IconButton
                                    component="a"
                                    href="#"
                                    aria-label="Instagram"
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        color: "#ffffff",
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)",

                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.16)",
                                        },
                                    }}
                                >
                                    <Instagram
                                        fontSize="small"
                                    />
                                </IconButton>

                                <IconButton
                                    component="a"
                                    href="#"
                                    aria-label="Twitter"
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        color: "#ffffff",
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)",

                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.16)",
                                        },
                                    }}
                                >
                                    <Twitter
                                        fontSize="small"
                                    />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* =================================================
                            QUICK LINKS
                        ================================================= */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                Quick Links
                            </Typography>

                            <Stack spacing={1.2}>
                                <Box
                                    component={RouterLink}
                                    to="/"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Home
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/products"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Products
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/categories"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Categories
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/brands"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Brands
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/shop"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Shop
                                </Box>
                            </Stack>
                        </Box>

                        {/* =================================================
                            CUSTOMER
                        ================================================= */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                Customer
                            </Typography>

                            <Stack spacing={1.2}>
                                <Box
                                    component={RouterLink}
                                    to="/customer/dashboard"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    My Account
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/cart"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Shopping Cart
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/customer/orders"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    My Orders
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/customer/wishlist"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    Wishlist
                                </Box>

                                <Box
                                    component={RouterLink}
                                    to="/customer/reviews"
                                    sx={{
                                        color: "#9ca3af",
                                        fontSize: 14,
                                        textDecoration:
                                            "none",
                                        width: "fit-content",

                                        "&:hover": {
                                            color: "#ffffff",
                                        },
                                    }}
                                >
                                    My Reviews
                                </Box>
                            </Stack>
                        </Box>

                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                Contact Us
                            </Typography>

                            <Stack spacing={1.5}>
                                {/* LOCATION */}

                                <Stack
                                    direction="row"
                                    spacing={1.2}
                                    alignItems="flex-start"
                                >
                                    <LocationOn
                                        sx={{
                                            color: "#9ca3af",
                                            fontSize: 20,
                                            mt: 0.2,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "#9ca3af",
                                            lineHeight:
                                                1.6,
                                        }}
                                    >
                                        Karachi,
                                        Pakistan
                                    </Typography>
                                </Stack>

                                {/* PHONE */}

                                <Stack
                                    direction="row"
                                    spacing={1.2}
                                    alignItems="center"
                                >
                                    <Phone
                                        sx={{
                                            color: "#9ca3af",
                                            fontSize: 20,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "#9ca3af",
                                        }}
                                    >
                                        +92 300 0000000
                                    </Typography>
                                </Stack>

                                {/* EMAIL */}

                                <Stack
                                    direction="row"
                                    spacing={1.2}
                                    alignItems="flex-start"
                                >
                                    <Email
                                        sx={{
                                            color: "#9ca3af",
                                            fontSize: 20,
                                            mt: 0.2,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color:
                                                "#9ca3af",
                                            wordBreak:
                                                "break-word",
                                        }}
                                    >
                                        support@example.com
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>

                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <Divider
                        sx={{
                            borderColor:
                                "rgba(255,255,255,0.08)",
                        }}
                    />

                    {/* =================================================
                        BOTTOM FOOTER
                    ================================================= */}

                    <Box
                        sx={{
                            minHeight: 64,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 2,

                            flexDirection: {
                                xs: "column",
                                sm: "row",
                            },

                            py: {
                                xs: 2,
                                sm: 1.5,
                            },

                            textAlign: {
                                xs: "center",
                                sm: "left",
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9ca3af",
                                fontSize: 13,
                            }}
                        >
                            © {currentYear} E-Commerce.
                            All rights reserved.
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                color: "#6b7280",
                                fontSize: 12,
                            }}
                        >
                            Built with React · Material
                            UI · Redux Toolkit · Laravel
                            12
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Footer;
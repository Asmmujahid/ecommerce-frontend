import { useEffect } from "react";

import {
    Box,
    Breadcrumbs,
    Container,
    Link as MuiLink,
    Typography,
} from "@mui/material";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchWishlist,
    selectWishlistItems,
    selectWishlistLoading,
    selectWishlistError,
} from "../../../redux/customer/wishlistSlice";

import WishlistList from "../../../components/customer/wishlist/WishlistList";

const Wishlist = () => {

    const dispatch = useDispatch();

    // =====================================================
    // Redux
    // =====================================================

    const wishlistItems =
        useSelector(selectWishlistItems);

    const loading =
        useSelector(selectWishlistLoading);

    const error =
        useSelector(selectWishlistError);

    // =====================================================
    // Fetch Wishlist
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (token) {
            dispatch(fetchWishlist());
        }

    }, [dispatch]);

    // =====================================================
    // Render
    // =====================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 3,
            }}
        >

            {/* =================================================
                Breadcrumb
            ================================================= */}

            <Breadcrumbs
                separator={
                    <NavigateNextIcon
                        fontSize="small"
                    />
                }
                sx={{
                    mb: 3,
                }}
            >

                <MuiLink
                    component={Link}
                    to="/"
                    underline="hover"
                    color="inherit"
                >
                    Home
                </MuiLink>

                <Typography
                    color="text.primary"
                >
                    Wishlist
                </Typography>

            </Breadcrumbs>

            {/* =================================================
                Header
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    gap: 1,
                    mb: 4,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        My Wishlist
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Products you have saved
                        for later.
                    </Typography>

                </Box>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1
                        ? "item"
                        : "items"}
                </Typography>

            </Box>

            {/* =================================================
                Wishlist List
            ================================================= */}

            <WishlistList
                items={wishlistItems}
                loading={loading}
                error={error}
            />

        </Container>
    );
};

export default Wishlist;
import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import WishlistCard from "./WishlistCard";

const WishlistList = ({
    items = [],
    loading = false,
    error = null,
}) => {

    // =====================================================
    // Loading
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // Error
    // =====================================================

    if (error) {
        return (
            <Alert
                severity="error"
                sx={{ mb: 3 }}
            >
                {error}
            </Alert>
        );
    }

    // =====================================================
    // Empty Wishlist
    // =====================================================

    if (!items.length) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    p: 4,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                >
                    Your Wishlist is Empty
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    You have not added any products
                    to your wishlist yet.
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // Wishlist Products
    // =====================================================

    return (
        <Grid
            container
            spacing={3}
        >
            {items.map((wishlist) => (
                <Grid
                    item
                    key={wishlist.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                >
                    <WishlistCard
                        wishlist={wishlist}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default WishlistList;
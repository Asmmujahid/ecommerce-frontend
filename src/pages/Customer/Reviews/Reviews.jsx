// src/pages/Customer/Reviews/Reviews.jsx

import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";

import {
    Add,
    Close,
    Refresh,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    fetchReviews,
    fetchReviewableProducts,
    deleteReview,
    clearReviewError,
    clearReviewSuccess,
    selectReviews,
    selectReviewableProducts,
    selectReviewLoading,
    selectReviewableLoading,
    selectReviewError,
    selectReviewDeleting,
    selectReviewSuccess,
    selectReviewMessage,
} from "../../../redux/customer/reviewSlice";

import ReviewList from "../../../components/customer/review/ReviewList";

import ReviewDialog from "../../../components/customer/review/ReviewDialog";

// =====================================================
// COMPONENT
// =====================================================

const Reviews = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    // =================================================
    // REVIEWS
    // =================================================

    const reviews = useSelector(
        selectReviews
    );

    const loading = useSelector(
        selectReviewLoading
    );

    const deleting = useSelector(
        selectReviewDeleting
    );

    // =================================================
    // REVIEWABLE PRODUCTS
    // =================================================

    const reviewableProducts = useSelector(
        selectReviewableProducts
    );

    const reviewableLoading = useSelector(
        selectReviewableLoading
    );

    // =================================================
    // ERROR / SUCCESS
    // =================================================

    const error = useSelector(
        selectReviewError
    );

    const success = useSelector(
        selectReviewSuccess
    );

    const message = useSelector(
        selectReviewMessage
    );

    // =================================================
    // PRODUCT SELECTOR DIALOG
    // =================================================

    const [
        productSelectorOpen,
        setProductSelectorOpen,
    ] = useState(false);

    // =================================================
    // REVIEW DIALOG
    // =================================================

    const [
        reviewDialogOpen,
        setReviewDialogOpen,
    ] = useState(false);

    const [
        selectedProductId,
        setSelectedProductId,
    ] = useState(null);

    const [
        selectedProductName,
        setSelectedProductName,
    ] = useState("");

    // =================================================
    // SNACKBAR
    // =================================================

    const [
        snackbarOpen,
        setSnackbarOpen,
    ] = useState(false);

    // =================================================
    // LOAD REVIEWS
    // =================================================

    useEffect(() => {
        dispatch(fetchReviews());
    }, [dispatch]);

    // =================================================
    // SUCCESS
    // =================================================

    useEffect(() => {
        if (success && message) {
            setSnackbarOpen(true);
        }
    }, [success, message]);

    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = () => {
        dispatch(fetchReviews());

        dispatch(
            fetchReviewableProducts()
        );
    };

    // =================================================
    // OPEN PRODUCT SELECTOR
    // =================================================

    const handleOpenProductSelector = () => {
        setProductSelectorOpen(true);

        dispatch(
            fetchReviewableProducts()
        );
    };

    // =================================================
    // CLOSE PRODUCT SELECTOR
    // =================================================

    const handleCloseProductSelector = () => {
        setProductSelectorOpen(false);
    };

    // =================================================
    // SELECT PRODUCT
    // =================================================

    const handleSelectProduct = (product) => {
        if (!product?.id) {
            return;
        }

        setSelectedProductId(product.id);

        setSelectedProductName(
            product.name ||
                `Product #${product.id}`
        );

        setProductSelectorOpen(false);

        setReviewDialogOpen(true);
    };

    // =================================================
    // CLOSE REVIEW DIALOG
    // =================================================

    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false);

        setSelectedProductId(null);

        setSelectedProductName("");

        // Refresh reviews after closing the form.
        dispatch(fetchReviews());

        dispatch(
            fetchReviewableProducts()
        );
    };

    // =================================================
    // VIEW REVIEW
    // =================================================

    const handleView = (id) => {
        if (!id) {
            return;
        }

        navigate(
            `/customer/reviews/${id}`
        );
    };

    // =================================================
    // EDIT REVIEW
    // =================================================

    const handleEdit = (id) => {
        if (!id) {
            return;
        }

        navigate(
            `/customer/reviews/${id}/edit`
        );
    };

    // =================================================
    // DELETE REVIEW
    // =================================================

    const handleDelete = async (id) => {
        if (!id || deleting) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmed) {
            return;
        }

        const result = await dispatch(
            deleteReview(id)
        );

        if (
            deleteReview.fulfilled.match(
                result
            )
        ) {
            dispatch(
                fetchReviews()
            );

            dispatch(
                fetchReviewableProducts()
            );
        }
    };

    // =================================================
    // CLOSE SNACKBAR
    // =================================================

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);

        dispatch(
            clearReviewSuccess()
        );
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: 4,
            }}
        >
            <Stack spacing={4}>

                {/* =================================================
                    HEADER
                ================================================= */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                        borderRadius: 2,
                    }}
                >
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center",
                        }}
                        spacing={2}
                    >
                        {/* =================================================
                            HEADER TEXT
                        ================================================= */}

                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                            >
                                My Reviews
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mt: 0.5,
                                }}
                            >
                                Review products you
                                purchased and
                                received.
                            </Typography>
                        </Box>

                        {/* =================================================
                            HEADER ACTIONS
                        ================================================= */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={1}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "auto",
                                },
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={
                                    <Refresh />
                                }
                                onClick={
                                    handleRefresh
                                }
                                disabled={
                                    loading
                                }
                            >
                                Refresh
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={
                                    <Add />
                                }
                                onClick={
                                    handleOpenProductSelector
                                }
                            >
                                Write Review
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <Alert
                        severity="error"
                        onClose={() =>
                            dispatch(
                                clearReviewError()
                            )
                        }
                    >
                        {error}
                    </Alert>
                )}

                {/* =================================================
                    REVIEW COUNT
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {reviews.length}{" "}
                    {reviews.length === 1
                        ? "Review"
                        : "Reviews"}
                </Typography>

                {/* =================================================
                    REVIEW LIST
                ================================================= */}

                <ReviewList
                    reviews={reviews}
                    loading={loading}
                    error={null}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    deleting={deleting}
                />
            </Stack>

            {/* =====================================================
                SELECT PRODUCT DIALOG
            ===================================================== */}

            <Dialog
                open={productSelectorOpen}
                onClose={
                    handleCloseProductSelector
                }
                fullWidth
                maxWidth="sm"
                aria-labelledby="select-product-dialog-title"
            >
                {/* =================================================
                    IMPORTANT:

                    DialogTitle renders as <h2>.

                    Do NOT put Box, Stack, or Typography h6
                    directly inside it.

                    We use Typography component="span".
                ================================================= */}

                <DialogTitle
                    id="select-product-dialog-title"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: 2,
                        pr: 1,
                    }}
                >
                    {/* =================================================
                        TITLE CONTENT

                        The outer Typography is a span.
                    ================================================= */}

                    <Typography
                        component="span"
                        sx={{
                            display: "block",
                            flex: 1,
                        }}
                    >
                        <Typography
                            component="span"
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                display: "block",
                            }}
                        >
                            Select Product
                        </Typography>

                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mt: 0.5,
                            }}
                        >
                            Select a delivered
                            product to write
                            your review.
                        </Typography>
                    </Typography>

                    {/* =================================================
                        CLOSE BUTTON
                    ================================================= */}

                    <IconButton
                        onClick={
                            handleCloseProductSelector
                        }
                        size="small"
                        aria-label="Close product selector"
                        sx={{
                            flexShrink: 0,
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                {/* =================================================
                    DIALOG CONTENT
                ================================================= */}

                <DialogContent dividers>

                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {reviewableLoading && (
                        <Box
                            sx={{
                                py: 5,
                                display: "flex",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    )}

                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    {!reviewableLoading &&
                        reviewableProducts.length >
                            0 && (
                            <Stack
                                spacing={2}
                            >
                                {reviewableProducts.map(
                                    (
                                        product
                                    ) => (
                                        <Paper
                                            key={
                                                product.id
                                            }
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                cursor: "pointer",

                                                transition:
                                                    "all 0.2s ease",

                                                "&:hover":
                                                    {
                                                        borderColor:
                                                            "primary.main",
                                                        backgroundColor:
                                                            "action.hover",
                                                    },
                                            }}
                                            onClick={() =>
                                                handleSelectProduct(
                                                    product
                                                )
                                            }
                                        >
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={2}
                                                justifyContent="space-between"
                                                alignItems={{
                                                    xs: "flex-start",
                                                    sm: "center",
                                                }}
                                            >
                                                {/* =================================================
                                                    PRODUCT INFORMATION
                                                ================================================= */}

                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                    >
                                                        {
                                                            product.name
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Product
                                                        ID:{" "}
                                                        {
                                                            product.id
                                                        }
                                                    </Typography>

                                                    {product.price !==
                                                        undefined &&
                                                        product.price !==
                                                            null && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    mt: 0.5,
                                                                }}
                                                            >
                                                                Price:{" "}
                                                                {
                                                                    product.price
                                                                }
                                                            </Typography>
                                                        )}
                                                </Box>

                                                {/* =================================================
                                                    REVIEW BUTTON
                                                ================================================= */}

                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={(
                                                        event
                                                    ) => {
                                                        event.stopPropagation();

                                                        handleSelectProduct(
                                                            product
                                                        );
                                                    }}
                                                >
                                                    Review
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )
                                )}
                            </Stack>
                        )}

                    {/* =================================================
                        NO PRODUCTS
                    ================================================= */}

                    {!reviewableLoading &&
                        reviewableProducts.length ===
                            0 && (
                            <Alert severity="info">
                                You currently
                                have no
                                products
                                available
                                for review.

                                <br />
                                <br />

                                You can review
                                a product
                                after your
                                order has
                                been
                                delivered.
                            </Alert>
                        )}
                </DialogContent>

                {/* =================================================
                    DIALOG ACTIONS
                ================================================= */}

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseProductSelector
                        }
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =====================================================
                REVIEW FORM DIALOG
            ===================================================== */}

            {selectedProductId !== null && (
                <ReviewDialog
                    open={
                        reviewDialogOpen
                    }
                    onClose={
                        handleCloseReviewDialog
                    }
                    productId={
                        selectedProductId
                    }
                    productName={
                        selectedProductName
                    }
                />
            )}

            {/* =====================================================
                SUCCESS SNACKBAR
            ===================================================== */}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={
                    handleCloseSnackbar
                }
                message={
                    message ||
                    "Review submitted successfully."
                }
            />
        </Container>
    );
};

export default Reviews;
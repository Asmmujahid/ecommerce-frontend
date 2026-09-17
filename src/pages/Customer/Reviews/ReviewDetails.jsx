
// src/pages/Customer/Reviews/ReviewDetails.jsx

import { useEffect } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Delete,
    Edit,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    fetchReview,
    deleteReview,
    clearReviewError,
    selectReview,
    selectReviewLoading,
    selectReviewError,
    selectReviewDeleting,
} from "../../../redux/customer/reviewSlice";

// =====================================================
// COMPONENT
// =====================================================

const ReviewDetails = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // =================================================
    // REDUX STATE
    // =================================================

    const review = useSelector(
        selectReview
    );

    const loading = useSelector(
        selectReviewLoading
    );

    const error = useSelector(
        selectReviewError
    );

    const deleting = useSelector(
        selectReviewDeleting
    );

    // =================================================
    // LOAD REVIEW
    // =================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        dispatch(
            fetchReview(id)
        );

        return () => {
            dispatch(
                clearReviewError()
            );
        };
    }, [dispatch, id]);

    // =================================================
    // BACK
    // =================================================

    const handleBack = () => {
        navigate(
            "/customer/reviews"
        );
    };

    // =================================================
    // EDIT
    // =================================================

    const handleEdit = () => {
        if (!review?.id) {
            return;
        }

        navigate(
            `/customer/reviews/${review.id}/edit`
        );
    };

    // =================================================
    // DELETE
    // =================================================

    const handleDelete = async () => {
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

        const result =
            await dispatch(
                deleteReview(id)
            );

        if (
            deleteReview.fulfilled.match(
                result
            )
        ) {
            navigate(
                "/customer/reviews",
                {
                    replace: true,
                }
            );
        }
    };

    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 8,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems:
                            "center",
                        minHeight: 250,
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (error) {
        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 4,
                }}
            >
                <Stack spacing={2}>
                    <Alert severity="error">
                        {error}
                    </Alert>

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={
                            handleBack
                        }
                        variant="outlined"
                        sx={{
                            width: "fit-content",
                        }}
                    >
                        Back to Reviews
                    </Button>
                </Stack>
            </Container>
        );
    }

    // =================================================
    // NOT FOUND
    // =================================================

    if (!review) {
        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 4,
                }}
            >
                <Stack spacing={2}>
                    <Alert severity="info">
                        Review not found.
                    </Alert>

                    <Button
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={
                            handleBack
                        }
                        variant="outlined"
                        sx={{
                            width: "fit-content",
                        }}
                    >
                        Back to Reviews
                    </Button>
                </Stack>
            </Container>
        );
    }

    // =================================================
    // PRODUCT NAME
    // =================================================

    const productName =
        review.product?.name ||
        `Product #${review.product_id}`;

    // =================================================
    // RATING
    // =================================================

    const rating =
        Number(review.rating) || 0;

    // =================================================
    // DATE
    // =================================================

    const formattedDate =
        review.created_at
            ? new Date(
                  review.created_at
              ).toLocaleDateString(
                  "en-US",
                  {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  }
              )
            : null;

    // =================================================
    // RENDER
    // =================================================

    return (
        <Container
            maxWidth="md"
            sx={{
                py: 4,
            }}
        >
            <Stack spacing={3}>
                {/* =========================================
                    BACK BUTTON
                ========================================= */}

                <Button
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={
                        handleBack
                    }
                    sx={{
                        width: "fit-content",
                    }}
                >
                    Back to Reviews
                </Button>

                {/* =========================================
                    REVIEW CARD
                ========================================= */}

                <Card
    variant="outlined"
    elevation={0}
    sx={{
        borderRadius: 2,
    }}
>
                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 4,
                            },
                        }}
                    >
                        <Stack spacing={3}>
                            {/* =================================
                                HEADER
                            ================================= */}

                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                >
                                    Review Details
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Review #
                                    {
                                        review.id
                                    }
                                </Typography>
                            </Box>

                            <Divider />

                            {/* =================================
                                PRODUCT
                            ================================= */}

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Product
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        productName
                                    }
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    Product ID:{" "}
                                    {
                                        review.product_id
                                    }
                                </Typography>
                            </Box>

                            {/* =================================
                                RATING
                            ================================= */}

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                    }}
                                >
                                    Rating
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Rating
                                        value={
                                            rating
                                        }
                                        readOnly
                                        precision={
                                            1
                                        }
                                    />

                                    <Typography
                                        fontWeight={
                                            700
                                        }
                                    >
                                        {rating}/5
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* =================================
                                COMMENT
                            ================================= */}

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Comment
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 1,
                                        lineHeight: 1.8,
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {
                                        review.comment ||
                                        "No comment added."
                                    }
                                </Typography>
                            </Box>

                            {/* =================================
                                DATE
                            ================================= */}

                            {formattedDate && (
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        Reviewed On
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        {
                                            formattedDate
                                        }
                                    </Typography>
                                </Box>
                            )}

                            <Divider />

                            {/* =================================
                                ACTIONS
                            ================================= */}

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={
                                        <Edit />
                                    }
                                    onClick={
                                        handleEdit
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    Edit Review
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={
                                        deleting ? (
                                            <CircularProgress
                                                size={
                                                    18
                                                }
                                                color="inherit"
                                            />
                                        ) : (
                                            <Delete />
                                        )
                                    }
                                    disabled={
                                        deleting
                                    }
                                    onClick={
                                        handleDelete
                                    }
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Review"}
                                </Button>

                                <Button
                                    variant="text"
                                    startIcon={
                                        <ArrowBack />
                                    }
                                    onClick={
                                        handleBack
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    Back
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default ReviewDetails;

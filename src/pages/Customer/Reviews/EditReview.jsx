// src/pages/Customer/Reviews/EditReview.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Save,
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
    updateReview,
    clearReviewError,
    clearReviewSuccess,
    selectReview,
    selectReviewLoading,
    selectReviewUpdating,
    selectReviewError,
    selectReviewUpdateError,
    selectReviewSuccess,
    selectReviewMessage,
} from "../../../redux/customer/reviewSlice";

// =====================================================
// COMPONENT
// =====================================================

const EditReview = () => {
    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();

    const review =
        useSelector(
            selectReview
        );

    const loading =
        useSelector(
            selectReviewLoading
        );

    const updating =
        useSelector(
            selectReviewUpdating
        );

    const error =
        useSelector(
            selectReviewError
        );

    const updateError =
        useSelector(
            selectReviewUpdateError
        );

    const success =
        useSelector(
            selectReviewSuccess
        );

    const message =
        useSelector(
            selectReviewMessage
        );

    const [
        rating,
        setRating,
    ] = useState(0);

    const [
        comment,
        setComment,
    ] = useState("");

    const [
        localError,
        setLocalError,
    ] = useState("");

    // =================================================
    // LOAD REVIEW
    // =================================================

    useEffect(() => {
        if (id) {
            dispatch(
                fetchReview(id)
            );
        }

        return () => {
            dispatch(
                clearReviewError()
            );

            dispatch(
                clearReviewSuccess()
            );
        };
    }, [
        dispatch,
        id,
    ]);

    // =================================================
    // SET FORM DATA
    // =================================================

    useEffect(() => {
        if (review) {
            setRating(
                Number(
                    review.rating
                ) || 0
            );

            setComment(
                review.comment ||
                    ""
            );
        }
    }, [review]);

    // =================================================
    // SUCCESS
    // =================================================

    useEffect(() => {
        if (success) {
            const timer =
                setTimeout(() => {
                    navigate(
                        `/customer/reviews/${id}`
                    );
                }, 1000);

            return () =>
                clearTimeout(
                    timer
                );
        }
    }, [
        success,
        navigate,
        id,
    ]);

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setLocalError("");

        if (rating < 1) {
            setLocalError(
                "Please select a rating."
            );
            return;
        }

        if (
            comment.trim().length >
            1000
        ) {
            setLocalError(
                "Comment cannot exceed 1000 characters."
            );
            return;
        }

        await dispatch(
            updateReview({
                id,
                reviewData: {
                    rating,
                    comment:
                        comment.trim() ||
                        null,
                },
            })
        );
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
                    textAlign:
                        "center",
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    // =================================================
    // ERROR
    // =================================================

    if (error && !review) {
        return (
            <Container
                maxWidth="md"
                sx={{
                    py: 4,
                }}
            >
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/customer/reviews"
                        )
                    }
                >
                    Back to Reviews
                </Button>
            </Container>
        );
    }

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
                    <Stack
                        spacing={3}
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                            >
                                Edit Review
                            </Typography>

                            {review && (
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        review
                                            .product
                                            ?.name
                                    }
                                </Typography>
                            )}
                        </Box>

                        {localError && (
                            <Alert severity="error">
                                {
                                    localError
                                }
                            </Alert>
                        )}

                        {updateError && (
                            <Alert severity="error">
                                {
                                    updateError
                                }
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success">
                                {message ||
                                    "Review updated successfully."}
                            </Alert>
                        )}

                        {/* RATING */}

                        <Box>
                            <Typography
                                fontWeight={700}
                                sx={{
                                    mb: 1,
                                }}
                            >
                                Rating
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Rating
                                    value={
                                        rating
                                    }
                                    onChange={(
                                        _event,
                                        newValue
                                    ) =>
                                        setRating(
                                            newValue ||
                                                0
                                        )
                                    }
                                    size="large"
                                    disabled={
                                        updating
                                    }
                                />

                                <Typography
                                    fontWeight={700}
                                >
                                    {
                                        rating
                                    }
                                    /5
                                </Typography>
                            </Stack>
                        </Box>

                        {/* COMMENT */}

                        <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Your Review"
                            value={
                                comment
                            }
                            onChange={(
                                event
                            ) =>
                                setComment(
                                    event
                                        .target
                                        .value
                                )
                            }
                            disabled={
                                updating
                            }
                            inputProps={{
                                maxLength: 1000,
                            }}
                            helperText={`${comment.length}/1000`}
                        />

                        {/* ACTIONS */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    updating ? (
                                        <CircularProgress
                                            size={
                                                18
                                            }
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={
                                    updating
                                }
                            >
                                {updating
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={
                                    <ArrowBack />
                                }
                                disabled={
                                    updating
                                }
                                onClick={() =>
                                    navigate(
                                        `/customer/reviews/${id}`
                                    )
                                }
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default EditReview;

// src/components/customer/review/ReviewForm.jsx

import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    Send,
    Star,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    createReview,
    clearReviewError,
    clearReviewSuccess,
    selectReviewSubmitting,
    selectReviewSubmitError,
    selectReviewSuccess,
    selectReviewMessage,
} from "../../../redux/customer/reviewSlice";


const ReviewForm = ({
    productId,
    productName = "",
    onSuccess,
    onCancel,
}) => {

    const dispatch = useDispatch();

    const submitting =
        useSelector(
            selectReviewSubmitting
        );

    const submitError =
        useSelector(
            selectReviewSubmitError
        );

    const success =
        useSelector(
            selectReviewSuccess
        );

    const message =
        useSelector(
            selectReviewMessage
        );


    const [rating, setRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [localError, setLocalError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | RESET WHEN FORM OPENS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setRating(0);
        setComment("");
        setLocalError("");

        dispatch(clearReviewError());
        dispatch(clearReviewSuccess());

    }, [productId, dispatch]);


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!success) {
            return;
        }

        const timer =
            setTimeout(() => {

                if (
                    typeof onSuccess ===
                    "function"
                ) {
                    onSuccess();
                }

            }, 500);

        return () =>
            clearTimeout(timer);

    }, [success, onSuccess]);


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setLocalError("");

        if (!productId) {

            setLocalError(
                "Product is required."
            );

            return;
        }

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


        const result =
            await dispatch(
                createReview({
                    product_id:
                        productId,

                    rating:
                        Number(rating),

                    comment:
                        comment.trim() ||
                        null,
                })
            );


        if (
            createReview.fulfilled.match(
                result
            )
        ) {

            setRating(0);
            setComment("");
        }

    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Stack spacing={3}>

                {/* PRODUCT */}

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
                    >
                        {productName ||
                            `Product #${productId}`}
                    </Typography>

                </Box>


                {/* ERROR */}

                {localError && (
                    <Alert severity="error">
                        {localError}
                    </Alert>
                )}


                {submitError && (
                    <Alert severity="error">
                        {submitError}
                    </Alert>
                )}


                {/* SUCCESS */}

                {success && (
                    <Alert severity="success">
                        {message ||
                            "Review submitted successfully."}
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
                        Your Rating
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        <Rating
                            value={rating}
                            onChange={(
                                _event,
                                value
                            ) => {

                                setRating(
                                    value || 0
                                );

                            }}
                            disabled={
                                submitting
                            }
                            size="large"
                            emptyIcon={
                                <Star
                                    fontSize="inherit"
                                    sx={{
                                        opacity: 0.4,
                                    }}
                                />
                            }
                        />

                        <Typography
                            fontWeight={700}
                        >
                            {rating}/5
                        </Typography>

                    </Stack>

                </Box>


                {/* COMMENT */}

                <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={10}
                    label="Your Review"
                    placeholder="Tell other customers about this product..."
                    value={comment}
                    onChange={(event) =>
                        setComment(
                            event.target.value
                        )
                    }
                    disabled={submitting}
                    inputProps={{
                        maxLength: 1000,
                    }}
                    helperText={`${comment.length}/1000`}
                />


                {/* BUTTONS */}

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
                            submitting ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Send />
                            )
                        }
                        disabled={
                            submitting
                        }
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Review"}
                    </Button>


                    {onCancel && (
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={onCancel}
                            disabled={
                                submitting
                            }
                        >
                            Cancel
                        </Button>
                    )}

                </Stack>

            </Stack>

        </Box>
    );
};


ReviewForm.propTypes = {

    productId:
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,

    productName:
        PropTypes.string,

    onSuccess:
        PropTypes.func,

    onCancel:
        PropTypes.func,
};


export default ReviewForm;


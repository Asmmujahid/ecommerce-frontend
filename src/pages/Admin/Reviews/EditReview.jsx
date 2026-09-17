import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReviewForm from "../../../components/admin/review/ReviewForm";

import {
    getReview,
    updateReview,
    clearCurrentReview,
    clearReviewError,
    clearReviewMessage,
} from "../../../redux/admin/reviewSlice";

const EditReview = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        review,
        loading,
        error,
        successMessage,
    } = useSelector((state) => state.adminReview);

    useEffect(() => {
        dispatch(getReview(id));

        return () => {
            dispatch(clearCurrentReview());
            dispatch(clearReviewError());
            dispatch(clearReviewMessage());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearReviewMessage());
                navigate("/admin/reviews");
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch, navigate]);

    const handleSubmit = (formData) => {
        dispatch(
            updateReview({
                id,
                reviewData: {
                    status: formData.status,
                },
            })
        );
    };

    return (
        <Container maxWidth="md">
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Edit Review
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/admin/reviews")}
                >
                    Back
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Card>
                <CardContent>
                    {loading && !review ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            py={6}
                        >
                            <CircularProgress />
                        </Box>
                    ) : review ? (
                        <ReviewForm
                            initialValues={review}
                            loading={loading}
                            submitLabel="Update Review"
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <Alert severity="info">
                            Review not found.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default EditReview;
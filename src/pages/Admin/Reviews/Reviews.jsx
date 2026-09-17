import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import ReviewTable from "../../../components/admin/review/ReviewTable";

import {
    getReviews,
    deleteReview,
    clearReviewError,
    clearReviewMessage,
} from "../../../redux/admin/reviewSlice";

const Reviews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        reviews,
        loading,
        error,
        successMessage,
    } = useSelector((state) => state.adminReview);

    useEffect(() => {
        dispatch(getReviews());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearReviewMessage());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearReviewError());
            dispatch(clearReviewMessage());
        };
    }, [dispatch]);

    const handleView = (id) => {
        navigate(`/admin/reviews/view/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/admin/reviews/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        dispatch(deleteReview(id));
    };

    return (
        <Container maxWidth="xl">
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
                    Review Management
                </Typography>
            </Stack>

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            py={6}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <ReviewTable
                            reviews={reviews}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default Reviews;
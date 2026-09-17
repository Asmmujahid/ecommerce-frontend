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

import ReviewView from "../../../components/admin/review/ReviewView";

import {
    getReview,
    clearCurrentReview,
    clearReviewError,
} from "../../../redux/admin/reviewSlice";

const ViewReview = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        review,
        loading,
        error,
    } = useSelector((state) => state.adminReview);

    useEffect(() => {
        if (id) {
            dispatch(getReview(id));
        }

        return () => {
            dispatch(clearCurrentReview());
            dispatch(clearReviewError());
        };
    }, [dispatch, id]);

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
                    Review Details
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
                    ) : review ? (
                        <ReviewView review={review} />
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

export default ViewReview;
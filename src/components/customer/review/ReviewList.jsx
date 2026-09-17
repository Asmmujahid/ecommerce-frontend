// src/components/customer/review/ReviewList.jsx

import PropTypes from "prop-types";

import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import ReviewCard from "./ReviewCard";

// =====================================================
// COMPONENT
// =====================================================

const ReviewList = ({
    reviews = [],
    loading = false,
    error = null,
    onView,
    onEdit,
    onDelete,
    deleting = false,
}) => {
    if (loading) {
        return (
            <Box
                sx={{
                    py: 8,
                    display: "flex",
                    justifyContent:
                        "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (!reviews.length) {
        return (
            <Alert severity="info">
                You have not written any
                reviews yet.
            </Alert>
        );
    }

    return (
        <Grid
            container
            spacing={3}
        >
            {reviews.map(
                (review) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={
                            review.id
                        }
                    >
                        <ReviewCard
                            review={
                                review
                            }
                            onView={
                                onView
                            }
                            onEdit={
                                onEdit
                            }
                            onDelete={
                                onDelete
                            }
                            deleting={
                                deleting
                            }
                        />
                    </Grid>
                )
            )}
        </Grid>
    );
};

ReviewList.propTypes = {
    reviews: PropTypes.array,

    loading: PropTypes.bool,

    error: PropTypes.string,

    onView: PropTypes.func,

    onEdit: PropTypes.func,

    onDelete: PropTypes.func,

    deleting: PropTypes.bool,
};

export default ReviewList;

// src/components/customer/review/ReviewCard.jsx

import PropTypes from "prop-types";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Delete,
    Edit,
    Visibility,
} from "@mui/icons-material";

// =====================================================
// COMPONENT
// =====================================================

const ReviewCard = ({
    review,
    onView = null,
    onEdit = null,
    onDelete = null,
    deleting = false,
}) => {
    // =================================================
    // SAFETY CHECK
    // =================================================

    if (!review) {
        return null;
    }

    // =================================================
    // PRODUCT
    // =================================================

    const product = review.product;

    const productName =
        product?.name ||
        `Product #${review.product_id}`;

    // =================================================
    // RATING
    // =================================================

    const rating =
        Number(review.rating) || 0;

    // =================================================
    // STATUS
    // =================================================

    const status =
        review.status || "active";

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
                      month: "short",
                      day: "numeric",
                  }
              )
            : "";

    // =================================================
    // STATUS COLOR
    // =================================================

    const getStatusColor = () => {
        switch (status) {
            case "active":
                return "success";

            case "flagged":
                return "warning";

            case "rejected":
                return "error";

            case "pending":
                return "info";

            default:
                return "default";
        }
    };

    // =================================================
    // STATUS LABEL
    // =================================================

    const statusLabel =
        status.charAt(0).toUpperCase() +
        status.slice(1);

    // =================================================
    // VIEW
    // =================================================

    const handleView = () => {
        if (
            typeof onView === "function" &&
            review.id
        ) {
            onView(review.id);
        }
    };

    // =================================================
    // EDIT
    // =================================================

    const handleEdit = () => {
        if (
            typeof onEdit === "function" &&
            review.id
        ) {
            onEdit(review.id);
        }
    };

    // =================================================
    // DELETE
    // =================================================

    const handleDelete = () => {
        if (
            typeof onDelete === "function" &&
            review.id &&
            !deleting
        ) {
            onDelete(review.id);
        }
    };

    // =================================================
    // RENDER
    // =================================================

    return (
        <Card
            variant="outlined"
            elevation={0}
            sx={{
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition:
                    "box-shadow 0.2s ease, transform 0.2s ease",

                "&:hover": {
                    boxShadow: 2,
                    transform:
                        "translateY(-2px)",
                },
            }}
        >
            <CardContent
                sx={{
                    flex: 1,
                }}
            >
                <Stack spacing={2}>
                    {/* =================================
                        PRODUCT
                    ================================= */}

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {productName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Product ID:{" "}
                            {review.product_id}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* =================================
                        RATING
                    ================================= */}

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
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
                                value={rating}
                                readOnly
                                precision={1}
                            />

                            <Typography
                                fontWeight={700}
                            >
                                {rating}/5
                            </Typography>
                        </Stack>
                    </Box>

                    {/* =================================
                        STATUS
                    ================================= */}

                    <Chip
                        label={statusLabel}
                        size="small"
                        color={getStatusColor()}
                        sx={{
                            width: "fit-content",
                        }}
                    />

                    {/* =================================
                        COMMENT
                    ================================= */}

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                            }}
                        >
                            Review
                        </Typography>

                        {review.comment ? (
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace:
                                        "pre-wrap",
                                    lineHeight: 1.7,
                                    wordBreak:
                                        "break-word",
                                }}
                            >
                                {review.comment}
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontStyle="italic"
                            >
                                No comment added.
                            </Typography>
                        )}
                    </Box>

                    {/* =================================
                        DATE
                    ================================= */}

                    {formattedDate && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Reviewed on{" "}
                            {formattedDate}
                        </Typography>
                    )}

                    <Divider />

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        {/* VIEW */}

                        {typeof onView ===
                            "function" && (
                            <Tooltip title="View review">
                                <IconButton
                                    color="primary"
                                    onClick={
                                        handleView
                                    }
                                    aria-label="View review"
                                >
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* EDIT */}

                        {typeof onEdit ===
                            "function" && (
                            <Tooltip title="Edit review">
                                <IconButton
                                    color="secondary"
                                    onClick={
                                        handleEdit
                                    }
                                    disabled={
                                        deleting
                                    }
                                    aria-label="Edit review"
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* DELETE */}

                        {typeof onDelete ===
                            "function" && (
                            <Tooltip title="Delete review">
                                <span>
                                    <IconButton
                                        color="error"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            deleting
                                        }
                                        aria-label="Delete review"
                                    >
                                        <Delete />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

ReviewCard.propTypes = {
    review: PropTypes.object.isRequired,

    onView: PropTypes.func,

    onEdit: PropTypes.func,

    onDelete: PropTypes.func,

    deleting: PropTypes.bool,
};

// =====================================================
// EXPORT
// =====================================================

export default ReviewCard;


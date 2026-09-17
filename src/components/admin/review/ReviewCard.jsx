import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    IconButton,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "success";

        case "hidden":
            return "warning";

        case "flagged":
            return "error";

        default:
            return "default";
    }
};

const ReviewCard = ({
    review,
    onView,
    onEdit,
    onDelete,
}) => {
    if (!review) return null;

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >
            <CardHeader
                avatar={
                    <Avatar>
                        {review.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </Avatar>
                }
                title={
                    review.user?.name || "Unknown User"
                }
                subheader={
                    review.created_at
                        ? new Date(
                              review.created_at
                          ).toLocaleDateString()
                        : "-"
                }
                action={
                    <Chip
                        label={
                            review.status || "active"
                        }
                        color={getStatusColor(
                            review.status
                        )}
                        size="small"
                    />
                }
            />

            <Divider />

            <CardContent>
                <Stack spacing={2}>
                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Product
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {review.product?.name ||
                                "N/A"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
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
                                    Number(
                                        review.rating
                                    ) || 0
                                }
                                precision={0.5}
                                readOnly
                            />

                            <Typography
                                variant="body2"
                            >
                                ({review.rating})
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Review
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                whiteSpace:
                                    "pre-wrap",
                            }}
                        >
                            {review.comment ||
                                "No comment provided."}
                        </Typography>
                    </Box>

                    <Divider />

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <Tooltip title="View">
                            <IconButton
                                color="info"
                                onClick={() =>
                                    onView?.(
                                        review.id
                                    )
                                }
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    onEdit?.(
                                        review.id
                                    )
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                onClick={() =>
                                    onDelete?.(
                                        review.id
                                    )
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
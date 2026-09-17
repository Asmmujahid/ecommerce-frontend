import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

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

const DetailItem = ({ label, value }) => (
    <Box mb={2}>
        <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
        >
            {label}
        </Typography>

        <Typography variant="body1">
            {value || "-"}
        </Typography>
    </Box>
);

const ReviewView = ({ review }) => {
    if (!review) {
        return (
            <Card>
                <CardContent>
                    <Typography align="center">
                        Review not found.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={3}>
            <CardContent>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    Review Details
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    {/* Customer */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Customer
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >

                            <Avatar sx={{ width: 56, height: 56 }}>
                                {review.user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </Avatar>

                            <Box>

                                <Typography fontWeight={600}>
                                    {review.user?.name ||
                                        "Unknown User"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {review.user?.email || "-"}
                                </Typography>

                            </Box>

                        </Stack>

                    </Grid>

                    {/* Product */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Product
                        </Typography>

                        <Typography fontWeight={600}>
                            {review.product?.name || "-"}
                        </Typography>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Rating
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >

                            <Rating
                                readOnly
                                precision={0.5}
                                value={
                                    Number(review.rating) || 0
                                }
                            />

                            <Typography>
                                ({review.rating})
                            </Typography>

                        </Stack>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                review.status || "active"
                            }
                            color={getStatusColor(review.status)}
                        />

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <DetailItem
                    label="Review Comment"
                    value={review.comment}
                />

                <Divider sx={{ my: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailItem
                            label="Created At"
                            value={
                                review.created_at
                                    ? new Date(
                                          review.created_at
                                      ).toLocaleString()
                                    : "-"
                            }
                        />

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailItem
                            label="Updated At"
                            value={
                                review.updated_at
                                    ? new Date(
                                          review.updated_at
                                      ).toLocaleString()
                                    : "-"
                            }
                        />

                    </Grid>

                </Grid>

            </CardContent>
        </Card>
    );
};

export default ReviewView;
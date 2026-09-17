import {
    Avatar,
    Chip,
    IconButton,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Box,
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

const ReviewTable = ({
    reviews = [],
    onView,
    onEdit,
    onDelete,
}) => {
    if (reviews.length === 0) {
        return (
            <Paper sx={{ p: 4 }}>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No reviews found.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            #
                        </TableCell>

                        <TableCell>
                            Customer
                        </TableCell>

                        <TableCell>
                            Product
                        </TableCell>

                        <TableCell>
                            Rating
                        </TableCell>

                        <TableCell>
                            Comment
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        <TableCell>
                            Date
                        </TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {reviews.map((review) => (

                        <TableRow
                            key={review.id}
                            hover
                        >

                            <TableCell>
                                {review.id}
                            </TableCell>

                            <TableCell>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >

                                    <Avatar>
                                        {review.user?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() ||
                                            "U"}
                                    </Avatar>

                                    <Typography>

                                        {review.user
                                            ?.name ||
                                            "Unknown"}

                                    </Typography>

                                </Box>

                            </TableCell>

                            <TableCell>

                                {review.product
                                    ?.name ||
                                    "N/A"}

                            </TableCell>

                            <TableCell>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >

                                    <Rating
                                        value={
                                            Number(
                                                review.rating
                                            ) || 0
                                        }
                                        readOnly
                                        precision={
                                            0.5
                                        }
                                        size="small"
                                    />

                                    <Typography
                                        variant="body2"
                                    >
                                        (
                                        {
                                            review.rating
                                        }
                                        )
                                    </Typography>

                                </Box>

                            </TableCell>

                            <TableCell>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        maxWidth: 250,
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    {review.comment ||
                                        "-"}
                                </Typography>

                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={
                                        review.status ||
                                        "active"
                                    }
                                    color={getStatusColor(
                                        review.status
                                    )}
                                    size="small"
                                />

                            </TableCell>

                            <TableCell>

                                {review.created_at
                                    ? new Date(
                                          review.created_at
                                      ).toLocaleDateString()
                                    : "-"}

                            </TableCell>

                            <TableCell
                                align="center"
                            >

                                <Tooltip title="View">

                                    <IconButton
                                        color="info"
                                        onClick={() =>
                                            onView(
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
                                            onEdit(
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
                                            onDelete(
                                                review.id
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </Tooltip>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default ReviewTable;
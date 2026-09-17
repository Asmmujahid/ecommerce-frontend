// src/pages/seller/Reviews/ReviewTable.jsx

import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

const ReviewTable = ({ reviews = [] }) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedReviews = reviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>

          <TableHead>
            <TableRow>

              <TableCell>
                <strong>#</strong>
              </TableCell>

              <TableCell>
                <strong>Customer</strong>
              </TableCell>

              <TableCell>
                <strong>Product</strong>
              </TableCell>

              <TableCell>
                <strong>Rating</strong>
              </TableCell>

              <TableCell>
                <strong>Comment</strong>
              </TableCell>

              <TableCell>
                <strong>Date</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review, index) => (

                <TableRow hover key={review.id}>

                  {/* Serial */}

                  <TableCell>
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {/* Customer */}

                  <TableCell>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src={review.user?.image}
                        alt={review.user?.name}
                      >
                        {review.user?.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography fontWeight={600}>
                          {review.user?.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {review.user?.email}
                        </Typography>
                      </Box>
                    </Box>

                  </TableCell>

                  {/* Product */}

                  <TableCell>

                    <Typography fontWeight={600}>
                      {review.product?.name}
                    </Typography>

                  </TableCell>

                  {/* Rating */}

                  <TableCell>

                    <Box display="flex" alignItems="center" gap={1}>

                      <Rating
                        value={Number(review.rating)}
                        readOnly
                        precision={0.5}
                      />

                      <Chip
                        label={`${review.rating}/5`}
                        size="small"
                        color={
                          review.rating >= 4
                            ? "success"
                            : review.rating >= 3
                            ? "warning"
                            : "error"
                        }
                      />

                    </Box>

                  </TableCell>

                  {/* Comment */}

                  <TableCell>

                    <Typography
                      sx={{
                        maxWidth: 250,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.comment || "-"}
                    </Typography>

                  </TableCell>

                  {/* Date */}

                  <TableCell>

                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : "-"}

                  </TableCell>

                  {/* Action */}

                  <TableCell align="center">

                    <Tooltip title="View Review">

                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/seller/reviews/${review.id}`)
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>

                    </Tooltip>

                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>

                <TableCell colSpan={7} align="center">

                  <Typography py={4}>
                    No Reviews Found
                  </Typography>

                </TableCell>

              </TableRow>
            )}

          </TableBody>

        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        page={page}
        count={reviews.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Paper>
  );
};

export default ReviewTable;
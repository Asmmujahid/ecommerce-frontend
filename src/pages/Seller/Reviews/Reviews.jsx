import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { getReviews } from "../../../redux/seller/sellerReviewSlice";
import ReviewTable from "./ReviewTable";

const Reviews = () => {
  const dispatch = useDispatch();

  const { reviews, loading, error } = useSelector(
    (state) => state.sellerReview
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const filteredReviews = reviews.filter((review) => {
    const customer = review.user?.name?.toLowerCase() || "";
    const product = review.product?.name?.toLowerCase() || "";
    const comment = review.comment?.toLowerCase() || "";

    return (
      customer.includes(search.toLowerCase()) ||
      product.includes(search.toLowerCase()) ||
      comment.includes(search.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Product Reviews
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Search Reviews"
          placeholder="Search by customer, product or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <ReviewTable reviews={filteredReviews} />
        )}
      </Paper>
    </Box>
  );
};

export default Reviews;
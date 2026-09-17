// src/pages/seller/Reviews/ViewReview.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StarIcon from "@mui/icons-material/Star";
import CommentIcon from "@mui/icons-material/Comment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import {
  getReview,
  clearReview,
} from "../../../redux/seller/sellerReviewSlice";

const ViewReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { review, loading, error } = useSelector(
    (state) => state.sellerReview
  );

  useEffect(() => {
    dispatch(getReview(id));

    return () => {
      dispatch(clearReview());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!review) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Review not found.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>

      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Review Details
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/seller/reviews")}
        >
          Back
        </Button>
      </Stack>

      <Grid container spacing={3}>

        {/* Customer */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                mb={2}
              >
                <Avatar
                  src={review.user?.image}
                  sx={{
                    width: 70,
                    height: 70,
                  }}
                >
                  {review.user?.name?.charAt(0)}
                </Avatar>

                <Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {review.user?.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {review.user?.email}
                  </Typography>

                </Box>

              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>

                <Stack direction="row" spacing={1}>
                  <PersonIcon color="primary" />
                  <Typography>
                    Customer Information
                  </Typography>
                </Stack>

                <Typography>
                  <strong>Name:</strong>{" "}
                  {review.user?.name}
                </Typography>

                <Typography>
                  <strong>Email:</strong>{" "}
                  {review.user?.email}
                </Typography>

              </Stack>

            </CardContent>

          </Card>

        </Grid>

        {/* Product */}

        <Grid item xs={12} md={6}>

          <Card>

            <CardContent>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <Inventory2Icon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Product
                </Typography>

              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography mb={2}>
                <strong>Name:</strong>{" "}
                {review.product?.name}
              </Typography>

              <Typography>
                <strong>Product ID:</strong>{" "}
                {review.product?.id}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        {/* Rating */}

        <Grid item xs={12}>

          <Card>

            <CardContent>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <StarIcon color="warning" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Rating
                </Typography>

              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >

                <Rating
                  value={Number(review.rating)}
                  precision={0.5}
                  readOnly
                  size="large"
                />

                <Chip
                  color={
                    review.rating >= 4
                      ? "success"
                      : review.rating >= 3
                      ? "warning"
                      : "error"
                  }
                  label={`${review.rating} / 5`}
                />

              </Stack>

            </CardContent>

          </Card>

        </Grid>

        {/* Comment */}

        <Grid item xs={12}>

          <Card>

            <CardContent>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <CommentIcon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Customer Comment
                </Typography>

              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography
                sx={{
                  whiteSpace: "pre-line",
                }}
              >
                {review.comment || "No comment provided."}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        {/* Date */}

        <Grid item xs={12}>

          <Card>

            <CardContent>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <CalendarMonthIcon color="primary" />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Review Information
                </Typography>

              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Typography>
                <strong>Created At:</strong>{" "}
                {review.created_at
                  ? new Date(
                      review.created_at
                    ).toLocaleString()
                  : "-"}
              </Typography>

              <Typography mt={1}>
                <strong>Updated At:</strong>{" "}
                {review.updated_at
                  ? new Date(
                      review.updated_at
                    ).toLocaleString()
                  : "-"}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Box>
  );
};

export default ViewReview;
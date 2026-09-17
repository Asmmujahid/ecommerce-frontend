// src/pages/seller/Analytics/Analytics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import {
  getAnalytics,
} from "../../../redux/seller/sellerAnalyticsSlice";

import AnalyticsCards from "./AnalyticsCards";
import SalesChart from "./SalesChart";
import TopProducts from "./TopProducts";

const Analytics = () => {
  const dispatch = useDispatch();

  const {
    analytics,
    loading,
    error,
  } = useSelector((state) => state.sellerAnalytics);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>

      {/* Page Title */}

      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Seller Analytics
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        View your store sales, products performance,
        orders and monthly revenue.
      </Typography>

      {/* Statistics Cards */}

      <AnalyticsCards analytics={analytics} />

      {/* Charts */}

      <Grid
        container
        spacing={3}
        mt={1}
      >
        <Grid
    size={{
        xs: 12,
        lg: 8,
    }}
>
          <SalesChart
            monthlySales={analytics?.monthly_sales || []}
          />
        </Grid>

        <Grid
    size={{
        xs: 12,
        lg: 4,
    }}
>
          <TopProducts
            products={analytics?.top_products || []}
          />
        </Grid>
      </Grid>

    </Box>
  );
};

export default Analytics;
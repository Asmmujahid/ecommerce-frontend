// src/pages/seller/Profile/Profile.jsx

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
  getSellerProfile,
} from "../../../redux/seller/sellerProfileSlice";

import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  const dispatch = useDispatch();

  const {
    profile,
    loading,
    error,
  } = useSelector((state) => state.sellerProfile);

  useEffect(() => {
    dispatch(getSellerProfile());
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
        <CircularProgress size={45} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Page Heading */}

      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        My Profile
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        Manage your seller profile information and
        account security.
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side */}

        <Grid item xs={12} md={4}>
          <ProfileCard profile={profile} />
        </Grid>

        {/* Right Side */}

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ProfileForm profile={profile} />
            </Grid>

            <Grid item xs={12}>
              <ChangePassword />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
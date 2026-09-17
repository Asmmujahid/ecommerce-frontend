// src/pages/seller/Profile/ProfileForm.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  updateSellerProfile,
  clearSellerProfileError,
  clearSellerProfileMessage,
} from "../../../redux/seller/sellerProfileSlice";

const ProfileForm = ({ profile }) => {
  const dispatch = useDispatch();

  const {
    updateLoading,
    success,
    message,
    error,
  } = useSelector((state) => state.sellerProfile);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateSellerProfile(formData));
  };

  const handleCloseSnackbar = () => {
    dispatch(clearSellerProfileMessage());
    dispatch(clearSellerProfileError());
  };

  return (
    <>
      <Card elevation={3}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            Profile Information
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            mt={2}
          >
            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Avatar URL"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                />
              </Grid>

              {formData.avatar && (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                  >
                    Avatar Preview
                  </Typography>

                  <img
                    src={formData.avatar}
                    alt="Avatar Preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ddd",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </Grid>

            </Grid>
          </Box>

        </CardContent>
      </Card>

      {/* Success Snackbar */}

      <Snackbar
        open={success && Boolean(message)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          {typeof error === "string"
            ? error
            : "Failed to update profile."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileForm;
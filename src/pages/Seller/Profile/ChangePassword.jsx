// src/pages/seller/Profile/ChangePassword.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  changeSellerPassword,
  clearSellerProfileError,
  clearSellerProfileMessage,
} from "../../../redux/seller/sellerProfileSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const {
    passwordLoading,
    success,
    message,
    error,
  } = useSelector((state) => state.sellerProfile);

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.new_password !==
      formData.new_password_confirmation
    ) {
      alert("New password and confirmation do not match.");
      return;
    }

    dispatch(
      changeSellerPassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirmation:
          formData.new_password_confirmation,
      })
    );

    setFormData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
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
            Change Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Choose a strong password to keep your account secure.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* Current Password */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Current Password"
                  name="current_password"
                  type={
                    showPassword.current
                      ? "text"
                      : "password"
                  }
                  value={formData.current_password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            togglePassword("current")
                          }
                        >
                          {showPassword.current ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* New Password */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="New Password"
                  name="new_password"
                  type={
                    showPassword.new
                      ? "text"
                      : "password"
                  }
                  value={formData.new_password}
                  onChange={handleChange}
                  helperText="Minimum 8 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            togglePassword("new")
                          }
                        >
                          {showPassword.new ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Confirm Password */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  name="new_password_confirmation"
                  type={
                    showPassword.confirm
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.new_password_confirmation
                  }
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            togglePassword("confirm")
                          }
                        >
                          {showPassword.confirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Change Password"
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
          sx={{ width: "100%" }}
          onClose={handleCloseSnackbar}
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
          sx={{ width: "100%" }}
          onClose={handleCloseSnackbar}
        >
          {typeof error === "string"
            ? error
            : "Something went wrong."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;
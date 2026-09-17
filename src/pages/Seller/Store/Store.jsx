import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";

import {
    getStore,
    updateStore,
    clearStoreMessage,
    clearStoreError,
} from "../../../redux/seller/sellerStoreSlice";

import StoreForm from "./StoreForm";
import StorePreview from "./StorePreview";

const Store = () => {
  const dispatch = useDispatch();

  const handleSubmit = (formData) => {
    dispatch(updateStore(formData));
};

  const {
    store,
    loading,
    updateLoading,
    error,
    message,
  } = useSelector((state) => state.sellerStore);

  useEffect(() => {
    dispatch(getStore());
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    dispatch(clearStoreMessage());
    dispatch(clearStoreError());
  };

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

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
      >
        Store Settings
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
      >
        Manage your seller store information, branding,
        contact details and appearance.
      </Typography>

      <Grid
        container
        spacing={3}
      >
        {/* Store Form */}

        <Grid
          item
          xs={12}
          md={7}
        >
        <StoreForm
    store={store}
    loading={updateLoading}
    onSubmit={handleSubmit}
/>
        </Grid>

        {/* Store Preview */}

        <Grid
          item
          xs={12}
          md={5}
        >
          <StorePreview store={store} />
        </Grid>
      </Grid>

      {/* Success Snackbar */}

      <Snackbar
        open={Boolean(message)}
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
            : "Something went wrong"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Store;
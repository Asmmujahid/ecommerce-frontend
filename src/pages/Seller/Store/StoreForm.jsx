import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const StoreForm = ({
  store,
  loading = false,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    store_name: "",
    description: "",
    logo: "",
    banner: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (store) {
      setFormData({
        store_name: store.store_name || "",
        description: store.description || "",
        logo: store.logo || "",
        banner: store.banner || "",
        phone: store.phone || "",
        address: store.address || "",
      });
    }
  }, [store]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }
  };



  return (
    <Card elevation={3}>
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Store Information
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Store Name"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logo URL"
                name="logo"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={handleChange}
              />
            </Grid>

            {formData.logo && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  mb={1}
                >
                  Logo Preview
                </Typography>

                <img
                  src={formData.logo}
                  alt="Logo"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Banner URL"
                name="banner"
                placeholder="https://example.com/banner.jpg"
                value={formData.banner}
                onChange={handleChange}
              />
            </Grid>

            {formData.banner && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  mb={1}
                >
                  Banner Preview
                </Typography>

                <img
                  src={formData.banner}
                  alt="Banner"
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="flex-end"
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Update Store"
                  )}
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </Box>

      </CardContent>
    </Card>
  );
};

export default StoreForm;
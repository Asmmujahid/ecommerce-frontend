// src/pages/seller/Store/StorePreview.jsx

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import StorefrontIcon from "@mui/icons-material/Storefront";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";

const StorePreview = ({ store }) => {
  if (!store) return null;

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Banner */}

      {store.banner ? (
        <CardMedia
          component="img"
          image={store.banner}
          alt="Store Banner"
          sx={{
            height: 220,
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 220,
            background:
              "linear-gradient(135deg,#1976d2,#42a5f5)",
          }}
        />
      )}

      <CardContent>

        {/* Logo + Store Name */}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          mt={-8}
          mb={3}
        >
          <Avatar
            src={store.logo}
            sx={{
              width: 110,
              height: 110,
              border: "4px solid white",
              bgcolor: "primary.main",
            }}
          >
            {!store.logo && <StorefrontIcon sx={{ fontSize: 45 }} />}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight={700}>
              {store.store_name || "My Store"}
            </Typography>

            <Chip
              color="primary"
              size="small"
              label={`/${store.store_slug || "store-slug"}`}
              sx={{ mt: 1 }}
            />
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Description */}

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionIcon color="primary" />
              <Typography variant="h6">
                Store Description
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              mt={1}
            >
              {store.description ||
                "No description available."}
            </Typography>
          </Grid>

          {/* Phone */}

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1}>
              <PhoneIcon color="success" />

              <Box>
                <Typography fontWeight={600}>
                  Phone
                </Typography>

                <Typography color="text.secondary">
                  {store.phone || "Not provided"}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Address */}

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1}>
              <LocationOnIcon color="error" />

              <Box>
                <Typography fontWeight={600}>
                  Address
                </Typography>

                <Typography color="text.secondary">
                  {store.address || "Not provided"}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Footer */}

        <Box textAlign="center">
          <Typography
            variant="body2"
            color="text.secondary"
          >
            This is how customers will see your store
            profile.
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
};

export default StorePreview;
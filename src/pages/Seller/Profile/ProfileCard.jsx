// src/pages/seller/Profile/ProfileCard.jsx

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  VerifiedUser,
  CalendarMonth,
} from "@mui/icons-material";

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  const createdDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "-";

  const updatedDate = profile.updated_at
    ? new Date(profile.updated_at).toLocaleDateString()
    : "-";

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          height: 110,
          bgcolor: "primary.main",
        }}
      />

      <CardContent
        sx={{
          mt: -7,
          textAlign: "center",
        }}
      >
        {/* Avatar */}

        <Avatar
          src={profile.avatar || ""}
          alt={profile.name}
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto",
            border: "4px solid white",
            bgcolor: "primary.main",
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          {!profile.avatar &&
            profile.name?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Typography
          variant="h5"
          mt={2}
          fontWeight={700}
        >
          {profile.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Seller Account
        </Typography>

        <Box mt={2}>
          <Chip
            color={
              profile.status === "active"
                ? "success"
                : "error"
            }
            label={profile.status || "Unknown"}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Information */}

        <Stack spacing={2}>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Person color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Full Name
              </Typography>

              <Typography fontWeight={600}>
                {profile.name || "-"}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Email color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Email Address
              </Typography>

              <Typography fontWeight={600}>
                {profile.email || "-"}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <Phone color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Phone Number
              </Typography>

              <Typography fontWeight={600}>
                {profile.phone || "-"}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <VerifiedUser color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Role
              </Typography>

              <Typography fontWeight={600}>
                {Array.isArray(profile.roles)
                  ? profile.roles.join(", ")
                  : profile.roles || "Seller"}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <CalendarMonth color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Joined
              </Typography>

              <Typography fontWeight={600}>
                {createdDate}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
          >
            <CalendarMonth color="primary" />

            <Box textAlign="left">
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Last Updated
              </Typography>

              <Typography fontWeight={600}>
                {updatedDate}
              </Typography>
            </Box>
          </Box>

        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
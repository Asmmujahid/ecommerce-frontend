import PropTypes from "prop-types";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

/**
 * Format date for display
 */
const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

/**
 * Convert different possible API status values
 * into a single boolean value.
 *
 * Supports:
 * true
 * false
 * 1
 * 0
 * "1"
 * "0"
 * "true"
 * "false"
 */
const isProfileActive = (status) => {
    if (status === true || status === 1 || status === "1") {
        return true;
    }

    if (
        status === false ||
        status === 0 ||
        status === "0" ||
        status === "false"
    ) {
        return false;
    }

    return false;
};

/**
 * Reusable profile detail item
 */
const DetailItem = ({ icon, label, value }) => (
    <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
            py: 1.5,
            minWidth: 0,
        }}
    >
        {icon}

        <Box
            sx={{
                minWidth: 0,
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                    wordBreak: "break-word",
                }}
            >
                {value ?? "-"}
            </Typography>
        </Box>
    </Stack>
);

const ProfileView = ({ profile }) => {
    if (!profile) {
        return null;
    }

    const active = isProfileActive(profile.status);

    return (
        <Card
            elevation={3}
            sx={{
                width: "100%",
                maxWidth: "100%",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2,
                            sm: 3,
                        },
                    },
                }}
            >
                {/* Profile Header */}
                <Stack
                    alignItems="center"
                    spacing={2}
                    mb={3}
                >
                    {/* Avatar */}
                    <Avatar
                        src={profile.avatar || ""}
                        alt={profile.name || "Profile"}
                        sx={{
                            width: 110,
                            height: 110,
                            bgcolor: "primary.main",
                            fontSize: 40,
                            fontWeight: "bold",
                        }}
                    >
                        {!profile.avatar &&
                            profile.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                    </Avatar>

                    {/* Name */}
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                        sx={{
                            wordBreak: "break-word",
                        }}
                    >
                        {profile.name || "-"}
                    </Typography>

                    {/* Status */}
                    <Chip
                        color={active ? "success" : "error"}
                        label={active ? "Active" : "Inactive"}
                    />

                    {/* Roles */}
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        justifyContent="center"
                        useFlexGap
                    >
                        {profile.roles?.length ? (
                            profile.roles.map((role, index) => (
                                <Chip
                                    key={`${role}-${index}`}
                                    icon={
                                        <VerifiedUserIcon />
                                    }
                                    label={role}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        textTransform:
                                            "capitalize",
                                    }}
                                />
                            ))
                        ) : (
                            <Chip
                                label="No Role"
                                color="default"
                            />
                        )}
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Profile Details */}
                <Grid container spacing={2}>
                    {/* Admin ID */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <BadgeIcon color="primary" />
                            }
                            label="Admin ID"
                            value={profile.id}
                        />
                    </Grid>

                    {/* Full Name */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <PersonIcon color="primary" />
                            }
                            label="Full Name"
                            value={profile.name}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <EmailIcon color="primary" />
                            }
                            label="Email"
                            value={profile.email}
                        />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <PhoneIcon color="primary" />
                            }
                            label="Phone"
                            value={profile.phone}
                        />
                    </Grid>

                    {/* Account Created */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <CalendarMonthIcon color="primary" />
                            }
                            label="Account Created"
                            value={formatDate(
                                profile.created_at
                            )}
                        />
                    </Grid>

                    {/* Last Updated */}
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={
                                <CalendarMonthIcon color="primary" />
                            }
                            label="Last Updated"
                            value={formatDate(
                                profile.updated_at
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

DetailItem.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
};

ProfileView.propTypes = {
    profile: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        name: PropTypes.string,

        email: PropTypes.string,

        phone: PropTypes.string,

        avatar: PropTypes.string,

        // Backend can return boolean or 0/1.
        status: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.number,
            PropTypes.string,
        ]),

        roles: PropTypes.arrayOf(
            PropTypes.string
        ),

        created_at: PropTypes.string,

        updated_at: PropTypes.string,
    }),
};

export default ProfileView;
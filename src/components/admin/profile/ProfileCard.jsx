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

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const DetailItem = ({ icon, label, value }) => (
    <Stack
        direction="row"
        spacing={2}
        alignItems="center"
    >
        {icon}

        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value || "-"}
            </Typography>
        </Box>
    </Stack>
);

DetailItem.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
};

const ProfileCard = ({ profile }) => {
    if (!profile) return null;

    const avatar =
        profile.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name || "Admin"
        )}&background=1976d2&color=fff`;

    return (
        <Card elevation={3}>
            <CardContent>

                <Stack
                    alignItems="center"
                    spacing={2}
                    mb={3}
                >
                    <Avatar
                        src={avatar}
                        alt={profile.name}
                        sx={{
                            width: 120,
                            height: 120,
                        }}
                    />

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {profile.name}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
                        <Chip
                            icon={<VerifiedUserIcon />}
                            label={profile.status || "Active"}
                            color={
                                profile.status === "inactive"
                                    ? "error"
                                    : "success"
                            }
                        />

                        {profile.roles?.length > 0 && (
                            <Chip
                                label={profile.roles.join(", ")}
                                color="primary"
                            />
                        )}
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<BadgeIcon color="primary" />}
                            label="Admin ID"
                            value={profile.id}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<PersonIcon color="primary" />}
                            label="Full Name"
                            value={profile.name}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<EmailIcon color="primary" />}
                            label="Email"
                            value={profile.email}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<PhoneIcon color="primary" />}
                            label="Phone"
                            value={profile.phone || "-"}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<CalendarMonthIcon color="primary" />}
                            label="Account Created"
                            value={formatDate(profile.created_at)}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DetailItem
                            icon={<CalendarMonthIcon color="primary" />}
                            label="Last Updated"
                            value={formatDate(profile.updated_at)}
                        />
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
};

ProfileCard.propTypes = {
    profile: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        avatar: PropTypes.string,
        status: PropTypes.string,
        roles: PropTypes.array,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
};

export default ProfileCard;
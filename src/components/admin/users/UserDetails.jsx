import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import {
    Person,
    Email,
    Phone,
    CalendarMonth,
    Badge,
    VerifiedUser,
} from "@mui/icons-material";

const UserDetails = ({
    user,
    onClose,
    onEdit,
    onDelete,
}) => {
    if (!user) {
        return (
            <Paper
                elevation={2}
                className="p-8 text-center"
            >
                <Typography color="text.secondary">
                    No user selected.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            className="rounded-xl p-6"
        >
            {/* Header */}

            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                spacing={3}
                alignItems="center"
            >
                <Avatar
                    src={user.avatar}
                    sx={{
                        width: 90,
                        height: 90,
                        fontSize: 32,
                    }}
                >
                    {user.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Box flex={1}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {user.name}
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Customer Profile
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        mt={2}
                    >
                        <Chip
                            label={
                                user.status
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                user.status
                                    ? "success"
                                    : "error"
                            }
                        />

                        <Chip
                            label="Customer"
                            color="primary"
                        />
                    </Stack>
                </Box>
            </Stack>

            <Divider className="my-6" />

            {/* Information */}

            <Stack spacing={3}>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Person color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Full Name
                        </Typography>

                        <Typography fontWeight={600}>
                            {user.name}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Email color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Email Address
                        </Typography>

                        <Typography>
                            {user.email}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Phone color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Phone Number
                        </Typography>

                        <Typography>
                            {user.phone || "-"}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Badge color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            User ID
                        </Typography>

                        <Typography>
                            #{user.id}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <VerifiedUser color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Role
                        </Typography>

                        <Typography>
                            {user.roles?.length
                                ? user.roles[0].name
                                : "Customer"}
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <CalendarMonth color="primary" />

                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Joined
                        </Typography>

                        <Typography>
                            {user.created_at
                                ? new Date(
                                      user.created_at
                                  ).toLocaleDateString()
                                : "-"}
                        </Typography>
                    </Box>
                </Stack>

            </Stack>

            <Divider className="my-6" />

            {/* Buttons */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Close
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                        onEdit?.(user)
                    }
                >
                    Edit
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        onDelete?.(user.id)
                    }
                >
                    Delete
                </Button>
            </Stack>
        </Paper>
    );
};

UserDetails.propTypes = {
    user: PropTypes.object,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default UserDetails;
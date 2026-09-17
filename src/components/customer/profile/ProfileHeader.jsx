// src/components/customer/profile/ProfileHeader.jsx

import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// =====================================================
// COMPONENT
// =====================================================

const ProfileHeader = ({
    onBack,
}) => {
    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
                xs: "flex-start",
                sm: "center",
            }}
            spacing={2}
            sx={{
                mb: 3,
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                        fontSize: {
                            xs: "1.8rem",
                            sm: "2.1rem",
                        },
                    }}
                >
                    My Profile
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5,
                    }}
                >
                    Manage your personal
                    information and account
                    settings.
                </Typography>
            </Box>

            {onBack && (
                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={onBack}
                >
                    Back
                </Button>
            )}
        </Stack>
    );
};

export default ProfileHeader;
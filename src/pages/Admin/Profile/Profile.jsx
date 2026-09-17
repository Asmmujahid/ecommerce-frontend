import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from "@mui/material";

import ProfileView from "../../../components/admin/profile/ProfileView";
import ProfileForm from "../../../components/admin/profile/ProfileForm";
import ChangePasswordForm from "../../../components/admin/profile/ChangePasswordForm";

import {
    getProfile,
    updateProfile,
    clearProfileError,
    clearProfileMessage,
} from "../../../redux/admin/profileSlice";

const Profile = () => {
    const dispatch = useDispatch();

    const {
        profile,
        loading,
        error,
        successMessage,
    } = useSelector((state) => state.adminProfile);

    useEffect(() => {
        dispatch(getProfile());

        return () => {
            dispatch(clearProfileError());
            dispatch(clearProfileMessage());
        };
    }, [dispatch]);

    const handleProfileUpdate = async (data) => {
        const result = await dispatch(updateProfile(data));

        if (!result.error) {
            dispatch(getProfile());
        }
    };

    if (loading && !profile) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="70vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                My Profile
            </Typography>

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        dispatch(clearProfileMessage())
                    }
                >
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        dispatch(clearProfileError())
                    }
                >
                    {error}
                </Alert>
            )}

            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                    lg={4}
                >
                    <ProfileView profile={profile} />
                </Grid>

                <Grid
                    item
                    xs={12}
                    lg={8}
                >
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <ProfileForm
                                profile={profile}
                                loading={loading}
                                onSubmit={handleProfileUpdate}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >
                            <ChangePasswordForm />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
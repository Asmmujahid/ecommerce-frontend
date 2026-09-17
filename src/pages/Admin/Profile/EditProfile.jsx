import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ProfileForm from "../../../components/admin/profile/ProfileForm";

import {
    getProfile,
    updateProfile,
    clearProfileError,
    clearProfileMessage,
} from "../../../redux/admin/profileSlice";

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleSubmit = async (formData) => {
        const result = await dispatch(updateProfile(formData));

        if (!result.error) {
            navigate("/admin/profile");
        }
    };

    if (loading && !profile) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container
            maxWidth="md"
            sx={{ py: 4 }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Edit Profile
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/admin/profile")}
                >
                    Back
                </Button>
            </Box>

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Card elevation={3}>
                <CardContent>
                    <ProfileForm
                        profile={profile}
                        loading={loading}
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default EditProfile;
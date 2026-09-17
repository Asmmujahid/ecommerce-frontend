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
    Stack,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BannerForm from "../../../components/admin/banner/BannerForm";

import {
    createBanner,
    clearBannerError,
    clearBannerMessage,
} from "../../../redux/admin/bannerSlice";

const CreateBanner = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error,
        successMessage,
    } = useSelector((state) => state.adminBanner);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearBannerMessage());
                navigate("/admin/banners");
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearBannerError());
            dispatch(clearBannerMessage());
        };
    }, [dispatch]);

    const handleSubmit = (formData) => {
        dispatch(createBanner(formData));
    };

    return (
        <Container maxWidth="md">

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Create Banner
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                   onClick={() =>
                        navigate(
                            "/admin/banners"
                        )
                    }
                >
                    Back
                </Button>

            </Stack>

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

            <Card>

                <CardContent>

                    {loading ? (

                        <Box
                            display="flex"
                            justifyContent="center"
                            py={5}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                        <BannerForm
                            loading={loading}
                            submitLabel="Create Banner"
                            onSubmit={handleSubmit}
                        />

                    )}

                </CardContent>

            </Card>

        </Container>
    );
};

export default CreateBanner;
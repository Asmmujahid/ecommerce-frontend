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

import AddIcon from "@mui/icons-material/Add";

import BannerTable from "../../../components/admin/banner/BannerTable";

import {
    getBanners,
    deleteBanner,
    clearBannerMessage,
} from "../../../redux/admin/bannerSlice";

const Banners = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        banners,
        loading,
        error,
        successMessage,
    } = useSelector((state) => state.adminBanner);

    useEffect(() => {
        dispatch(getBanners());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearBannerMessage());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    const handleAddBanner = () => {
        navigate("/admin/banners/create");
    };

    const handleView = (id) => {
        navigate(`/admin/banners/view/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/admin/banners/edit/${id}`);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this banner?"
        );

        if (!confirmed) return;

        dispatch(deleteBanner(id));
    };

    return (
        <Container maxWidth="xl">

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
                    Banner Management
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddBanner}
                >
                    Add Banner
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
                            py={6}
                        >
                            <CircularProgress />
                        </Box>

                    ) : (

                        <BannerTable
                            banners={banners}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                    )}

                </CardContent>

            </Card>

        </Container>
    );
};

export default Banners;
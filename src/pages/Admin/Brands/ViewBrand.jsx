import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Button,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
    getBrand,
    resetBrandState,
} from "../../../redux/admin/brandSlice";

const ViewBrand = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        brand,
        loading,
        error,
    } = useSelector((state) => state.adminBrand);

    useEffect(() => {
        dispatch(getBrand(id));

        return () => {
            dispatch(resetBrandState());
        };
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={8}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    if (!brand) {
        return (
            <Alert severity="warning">
                Brand not found.
            </Alert>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 3,
            }}
        >
            {/* Header */}

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
                    Brand Details
                </Typography>

                <Box display="flex" gap={2}>
                    <Button
                        component={Link}
                        to={`/admin/brands/edit/${brand.id}`}
                        variant="contained"
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>

                    <Button
                        component={Link}
                        to="/admin/brands"
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                    >
                        Back
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        ID
                    </Typography>

                    <Typography variant="h6">
                        {brand.id}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Name
                    </Typography>

                    <Typography variant="h6">
                        {brand.name}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Slug
                    </Typography>

                    <Typography>
                        {brand.slug}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Logo
                    </Typography>

                    {brand.logo ? (
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            style={{
                                width: 120,
                                height: 120,
                                objectFit: "contain",
                                borderRadius: 8,
                                border: "1px solid #ddd",
                            }}
                        />
                    ) : (
                        <Typography color="text.secondary">
                            No Logo
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Status
                    </Typography>

                    <Chip
                        label={brand.status ? "Active" : "Inactive"}
                        color={brand.status ? "success" : "default"}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Products
                    </Typography>

                    <Typography variant="h6">
                        {brand.products_count ?? 0}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Created At
                    </Typography>

                    <Typography>
                        {brand.created_at}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Updated At
                    </Typography>

                    <Typography>
                        {brand.updated_at}
                    </Typography>
                </Grid>

            </Grid>

        </Paper>
    );
};

export default ViewBrand;
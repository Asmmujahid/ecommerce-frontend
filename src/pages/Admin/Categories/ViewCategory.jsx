import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../redux/admin/categorySlice";

const ViewCategory = () => {
    const { id } = useParams();

  const dispatch = useDispatch();

const {
    category,
    loading,
    error,
} = useSelector((state) => state.adminCategory);

useEffect(() => {
    dispatch(getCategory(id));
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

    if (!category) {
    return (
        <Alert severity="warning">
            Category not found.
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
                    Category Details
                </Typography>

                <Box display="flex" gap={2}>
                    <Button
                        component={Link}
                        to={`/admin/categories/${id}/edit`}
                        variant="contained"
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>

                    <Button
                        component={Link}
                        to="/admin/categories"
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
                        {category.id}
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
                        {category.name}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Slug
                    </Typography>

                    <Typography variant="body1">
                        {category.slug}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Description
                    </Typography>

                    <Typography variant="body1">
                        {category.description || "N/A"}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Status
                    </Typography>

                    <Chip
                        label={
                            category.status === 1 ||
                            category.status === "active"
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            category.status === 1 ||
                            category.status === "active"
                                ? "success"
                                : "default"
                        }
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
                        {category.products_count ?? 0}
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
                        {category.created_at}
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
                        {category.updated_at}
                    </Typography>
                </Grid>

            </Grid>
        </Paper>
    );
};

export default ViewCategory;
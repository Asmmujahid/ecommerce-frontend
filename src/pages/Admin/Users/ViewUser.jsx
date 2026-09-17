import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Avatar,
    Chip,
    Button,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Person,
    Email,
    Phone,
} from "@mui/icons-material";

import {
    getUser,
    resetUserState,
} from "../../../redux/admin/userSlice";

const ViewUser = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        user,
        loading,
        error,
    } = useSelector((state) => state.adminUser);

    useEffect(() => {
        dispatch(getUser(id));

        return () => {
            dispatch(resetUserState());
        };
    }, [dispatch, id]);

    if (loading) {
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

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={3}>
                <Alert severity="warning">
                    User not found.
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
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
                    mb={4}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Customer Details
                    </Typography>

                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/admin/users")
                            }
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() =>
                                navigate(`/admin/users/edit/${user.id}`)
                            }
                        >
                            Edit
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid
                    container
                    spacing={4}
                >
                    {/* Avatar */}

                    <Grid
                        item
                        xs={12}
                        md={3}
                        display="flex"
                        justifyContent="center"
                    >
                        <Avatar
                            src={user.avatar || ""}
                            sx={{
                                width: 150,
                                height: 150,
                                fontSize: 48,
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </Grid>

                    {/* Details */}

                    <Grid
                        item
                        xs={12}
                        md={9}
                    >
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    {user.name}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Customer ID
                                </Typography>

                                <Typography>
                                    #{user.id}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>

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
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    <Email
                                        sx={{
                                            fontSize: 18,
                                            mr: 1,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Email
                                </Typography>

                                <Typography>
                                    {user.email}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    <Phone
                                        sx={{
                                            fontSize: 18,
                                            mr: 1,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Phone
                                </Typography>

                                <Typography>
                                    {user.phone || "N/A"}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    <Person
                                        sx={{
                                            fontSize: 18,
                                            mr: 1,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Role
                                </Typography>

                                <Typography>
                                    Customer
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Joined
                                </Typography>

                                <Typography>
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Last Updated
                                </Typography>

                                <Typography>
                                    {new Date(
                                        user.updated_at
                                    ).toLocaleString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ViewUser;
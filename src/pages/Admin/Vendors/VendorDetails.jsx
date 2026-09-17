import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Chip,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Store,
    Person,
    Phone,
    Home,
    Image,
} from "@mui/icons-material";

import {
    getVendor,
} from "../../../redux/admin/vendorSlice";

const VendorDetails = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

     const {
    vendor,
    loading,
    error,
    success,
} = useSelector((state) => state.adminVendor);

    // =====================================
    // Load Vendor
    // =====================================

    useEffect(() => {

        if (id) {

            dispatch(getVendor(id));

        }

    }, [dispatch, id]);

    // =====================================
    // Back
    // =====================================

    const handleBack = () => {

        navigate("/admin/vendors");

    };

    // =====================================
    // Edit
    // =====================================

    const handleEdit = () => {

        navigate(`/admin/vendors/edit/${id}`);

    };

    // =====================================
    // Loading
    // =====================================

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

    // =====================================
    // Error
    // =====================================

    if (error) {

        return (

            <Box p={3}>

                <Alert severity="error">

                    {error}

                </Alert>

            </Box>

        );

    }

    // =====================================
    // Vendor Not Found
    // =====================================

    if (!vendor) {

        return (

            <Box p={3}>

                <Alert severity="warning">

                    Vendor not found.

                </Alert>

            </Box>

        );

    }

        return (

        <Box p={3}>

            {/* ===================================== */}
            {/* Header */}
            {/* ===================================== */}

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
                    Vendor Details
                </Typography>

                <Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        sx={{ mr: 2 }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Vendor
                    </Button>

                </Box>

            </Box>

            <Paper sx={{ p: 4 }}>

                {/* ===================================== */}
                {/* Store Information */}
                {/* ===================================== */}

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Store Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: "1fr",
                        md: "1fr 1fr",
                    }}
                    gap={3}
                >

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            <Store
                                sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                }}
                            />
                            Store Name
                        </Typography>

                        <Typography>
                            {vendor.store_name}
                        </Typography>

                    </Box>

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                vendor.status
                                    ? "Approved"
                                    : "Pending"
                            }
                            color={
                                vendor.status
                                    ? "success"
                                    : "warning"
                            }
                        />

                    </Box>

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            Description
                        </Typography>

                        <Typography>
                            {vendor.description ||
                                "N/A"}
                        </Typography>

                    </Box>

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            <Phone
                                sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                }}
                            />
                            Phone
                        </Typography>

                        <Typography>
                            {vendor.phone ||
                                "N/A"}
                        </Typography>

                    </Box>

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            <Home
                                sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                }}
                            />
                            Address
                        </Typography>

                        <Typography>
                            {vendor.address ||
                                "N/A"}
                        </Typography>

                    </Box>

                </Box>

                {/* ===================================== */}
                {/* Owner */}
                {/* ===================================== */}

                <Typography
                    variant="h6"
                    mt={5}
                    gutterBottom
                >
                    Owner Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box
                    display="grid"
                    gridTemplateColumns={{
                        xs: "1fr",
                        md: "1fr 1fr",
                    }}
                    gap={3}
                >

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            <Person
                                sx={{
                                    mr: 1,
                                    verticalAlign: "middle",
                                }}
                            />
                            Name
                        </Typography>

                        <Typography>
                            {vendor.user?.name}
                        </Typography>

                    </Box>

                    <Box>

                        <Typography
                            fontWeight="bold"
                        >
                            Email
                        </Typography>

                        <Typography>
                            {vendor.user?.email}
                        </Typography>

                    </Box>

                </Box>

                {/* ===================================== */}
                {/* Logo */}
                {/* ===================================== */}

                <Typography
                    variant="h6"
                    mt={5}
                    gutterBottom
                >
                    Logo
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {vendor.logo ? (

                    <img
                        src={vendor.logo}
                        alt="Logo"
                        style={{
                            width: 180,
                            borderRadius: 10,
                            border:
                                "1px solid #ddd",
                        }}
                    />

                ) : (

                    <Typography>
                        No Logo
                    </Typography>

                )}

                {/* ===================================== */}
                {/* Banner */}
                {/* ===================================== */}

                <Typography
                    variant="h6"
                    mt={5}
                    gutterBottom
                >
                    Banner
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {vendor.banner ? (

                    <img
                        src={vendor.banner}
                        alt="Banner"
                        style={{
                            width: "100%",
                            maxWidth: 700,
                            borderRadius: 10,
                            border:
                                "1px solid #ddd",
                        }}
                    />

                ) : (

                    <Typography>
                        No Banner
                    </Typography>

                )}

            </Paper>

        </Box>

    );

};

export default VendorDetails;
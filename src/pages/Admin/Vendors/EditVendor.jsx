import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import VendorForm from "../../../components/admin/vendors/VendorForm";

import {
    getVendor,
    updateVendor,
    clearVendor,
} from "../../../redux/admin/vendorSlice";

const EditVendor = () => {

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

        dispatch(
            getVendor(id)
        );

        return () => {

            dispatch(
                clearVendor()
            );

        };

    }, [dispatch, id]);

    // =====================================
    // Submit
    // =====================================

    const handleSubmit = async (
        formData
    ) => {

        try {

            await dispatch(

                updateVendor({

                    id,

                    vendorData: formData,

                })

            ).unwrap();

            navigate(
                "/admin/vendors"
            );

        } catch (error) {

            console.error(error);

        }

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
                minHeight="70vh"
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
                    Edit Vendor
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate("/admin/vendors")
                    }
                >
                    Back
                </Button>

            </Box>

            {/* ===================================== */}
            {/* Vendor Form */}
            {/* ===================================== */}

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >

                <VendorForm
                    vendor={vendor}
                    isEdit={true}
                    onSubmit={handleSubmit}
                />

            </Paper>

        </Box>

    );

};

export default EditVendor;
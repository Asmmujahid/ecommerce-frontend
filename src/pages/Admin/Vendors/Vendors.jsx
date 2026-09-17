import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Pagination,
    Stack,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import VendorTable from "../../../components/admin/vendors/VendorTable";
import VendorSearch from "../../../components/admin/vendors/VendorSearch";

import {
    getVendors,
    deleteVendor,
} from "../../../redux/admin/vendorSlice";

const Vendors = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

  const {
    vendors,
    loading,
    error,
    success,
} = useSelector((state) => state.adminVendor);
    

    const [filteredVendors, setFilteredVendors] = useState([]);

    const [page, setPage] = useState(1);

    const rowsPerPage = 10;

    // ==========================
    // Fetch Vendors
    // ==========================

    useEffect(() => {

        dispatch(getVendors());

    }, [dispatch]);

    // ==========================
    // Update Search Result
    // ==========================

    useEffect(() => {

        setFilteredVendors(vendors);

    }, [vendors]);

    // ==========================
    // Pagination
    // ==========================

    const totalPages = Math.ceil(
        filteredVendors.length / rowsPerPage
    );

    const paginatedVendors = useMemo(() => {

        const start =
            (page - 1) * rowsPerPage;

        return filteredVendors.slice(
            start,
            start + rowsPerPage
        );

    }, [
        filteredVendors,
        page,
    ]);

    // ==========================
    // Pagination Change
    // ==========================

    const handlePageChange = (
        event,
        value
    ) => {

        setPage(value);

    };

    // ==========================
    // Search
    // ==========================

    const handleSearch = (results) => {

        setFilteredVendors(results);

        setPage(1);

    };

    // ==========================
    // Delete Vendor
    // ==========================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this vendor?"
            );

        if (!confirmDelete) return;

        try {

            await dispatch(
                deleteVendor(id)
            ).unwrap();

        } catch (err) {

            console.error(err);

        }

    };

    // ==========================
    // View Vendor
    // ==========================

    const handleView = (id) => {

        navigate(
            `/admin/vendors/view/${id}`
        );

    };

    // ==========================
    // Edit Vendor
    // ==========================

    const handleEdit = (id) => {

        navigate(
            `/admin/vendors/edit/${id}`
        );

    };

        return (
        <Container maxWidth="xl">

            <Card>

                <CardContent>

                    {/* ===================================== */}
                    {/* Header */}
                    {/* ===================================== */}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Vendors
                        </Typography>

                    </Stack>

                    {/* ===================================== */}
                    {/* Search */}
                    {/* ===================================== */}

                    <VendorSearch
                        vendors={vendors}
                        onSearch={handleSearch}
                    />

                    {/* ===================================== */}
                    {/* Loading */}
                    {/* ===================================== */}

                    {loading && (

                        <Box
                            display="flex"
                            justifyContent="center"
                            py={5}
                        >

                            <CircularProgress />

                        </Box>

                    )}

                    {/* ===================================== */}
                    {/* Error */}
                    {/* ===================================== */}

                    {!loading && error && (

                        <Typography
                            color="error"
                            align="center"
                            py={3}
                        >
                            {error}
                        </Typography>

                    )}

                    {/* ===================================== */}
                    {/* Empty */}
                    {/* ===================================== */}

                    {!loading &&
                        !error &&
                        filteredVendors.length === 0 && (

                            <Typography
                                align="center"
                                py={5}
                            >
                                No vendors found.
                            </Typography>

                        )}

                    {/* ===================================== */}
                    {/* Vendor Table */}
                    {/* ===================================== */}

                    {!loading &&
                        !error &&
                        filteredVendors.length > 0 && (

                            <VendorTable
                                vendors={paginatedVendors}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                        )}

                    {/* ===================================== */}
                    {/* Pagination */}
                    {/* ===================================== */}

                    {!loading &&
                        !error &&
                        totalPages > 1 && (

                            <Box
                                mt={4}
                                display="flex"
                                justifyContent="center"
                            >

                                <Pagination
                                    page={page}
                                    count={totalPages}
                                    color="primary"
                                    onChange={handlePageChange}
                                />

                            </Box>

                        )}

                </CardContent>

            </Card>

        </Container>
    );
};

export default Vendors;

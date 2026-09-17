// src/pages/Customer/Addresses/Addresses.jsx

import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";

import {
    AddOutlined,
    ArrowBack,
    LocationOnOutlined,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AddressList from "../../../components/customer/address/AddressList";
import AddressForm from "../../../components/customer/address/AddressForm";
import DeleteAddressDialog from "../../../components/customer/address/DeleteAddressDialog";

import {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,

    selectAddresses,
    selectAddressLoading,
    selectAddressCreating,
    selectAddressUpdating,
    selectAddressDeleting,
    selectAddressError,
    selectAddressMessage,

    clearAddressError,
    clearAddressMessage,
} from "../../../redux/customer/addressSlice";

// =====================================================
// COMPONENT
// =====================================================

const Addresses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =====================================================
    // REDUX STATE
    // =====================================================

    const addresses = useSelector(selectAddresses);

    const loading = useSelector(
        selectAddressLoading
    );

    const creating = useSelector(
        selectAddressCreating
    );

    const updating = useSelector(
        selectAddressUpdating
    );

    const deleting = useSelector(
        selectAddressDeleting
    );

    const error = useSelector(
        selectAddressError
    );

    const message = useSelector(
        selectAddressMessage
    );

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [formOpen, setFormOpen] =
        useState(false);

    const [editingAddress, setEditingAddress] =
        useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedAddress, setSelectedAddress] =
        useState(null);

    // =====================================================
    // FETCH ADDRESSES
    // =====================================================

    useEffect(() => {
        dispatch(fetchAddresses());

        return () => {
            dispatch(clearAddressError());
            dispatch(clearAddressMessage());
        };
    }, [dispatch]);

    // =====================================================
    // ADD ADDRESS
    // =====================================================

    const handleAddAddress = () => {
        setEditingAddress(null);
        setFormOpen(true);

        dispatch(clearAddressError());
    };

    // =====================================================
    // EDIT ADDRESS
    // =====================================================

    const handleEditAddress = (address) => {
        if (!address) {
            return;
        }

        setEditingAddress(address);
        setFormOpen(true);

        dispatch(clearAddressError());
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const handleCloseForm = () => {
        if (creating || updating) {
            return;
        }

        setFormOpen(false);
        setEditingAddress(null);
    };

    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmitAddress = async (
        formData
    ) => {
        try {
            if (editingAddress) {
                await dispatch(
                    updateAddress({
                        id: editingAddress.id,
                        addressData: formData,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    createAddress(formData)
                ).unwrap();
            }

            setFormOpen(false);
            setEditingAddress(null);

            // Refresh list
            dispatch(fetchAddresses());
        } catch (submitError) {
            console.error(
                "Address save error:",
                submitError
            );
        }
    };

    // =====================================================
    // OPEN DELETE DIALOG
    // =====================================================

    const handleDeleteAddress = (address) => {
        if (!address) {
            return;
        }

        setSelectedAddress(address);
        setDeleteDialogOpen(true);

        dispatch(clearAddressError());
    };

    // =====================================================
    // CLOSE DELETE DIALOG
    // =====================================================

    const handleCloseDeleteDialog = () => {
        if (deleting) {
            return;
        }

        setDeleteDialogOpen(false);
        setSelectedAddress(null);
    };

    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirmDelete = async () => {
        if (!selectedAddress?.id) {
            return;
        }

        try {
            await dispatch(
                deleteAddress(
                    selectedAddress.id
                )
            ).unwrap();

            setDeleteDialogOpen(false);
            setSelectedAddress(null);

            // Refresh addresses
            dispatch(fetchAddresses());
        } catch (deleteError) {
            console.error(
                "Delete address error:",
                deleteError
            );
        }
    };

    // =====================================================
    // SET DEFAULT
    // =====================================================
    //
    // Your current Laravel backend does not have a
    // separate set-default endpoint.
    //
    // We can update the address by sending:
    //
    // is_default: true
    //
    // The backend will automatically make other
    // addresses non-default.
    //
    // =====================================================

    const handleSetDefault = async (
        address
    ) => {
        if (!address?.id) {
            return;
        }

        try {
            await dispatch(
                updateAddress({
                    id: address.id,
                    addressData: {
                        is_default: true,
                    },
                })
            ).unwrap();

            dispatch(fetchAddresses());
        } catch (defaultError) {
            console.error(
                "Set default address error:",
                defaultError
            );
        }
    };

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = () => {
        if (!error) {
            return "";
        }

        if (typeof error === "string") {
            return error;
        }

        if (error?.message) {
            return error.message;
        }

        return "Something went wrong.";
    };

    // =====================================================
    // SUCCESS MESSAGE
    // =====================================================

    const getSuccessMessage = () => {
        if (!message) {
            return "";
        }

        if (typeof message === "string") {
            return message;
        }

        if (message?.message) {
            return message.message;
        }

        return "Operation completed successfully.";
    };

    // =====================================================
    // FORM LOADING
    // =====================================================

    const formLoading =
        creating || updating;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: {
                    xs: 3,
                    md: 5,
                },
            }}
        >
            {/* =================================================
                BREADCRUMBS
            ================================================= */}

            <Breadcrumbs
                sx={{
                    mb: 3,
                }}
            >
                <Button
                    variant="text"
                    size="small"
                    onClick={() =>
                        navigate("/")
                    }
                    sx={{
                        minWidth: 0,
                        p: 0,
                        textTransform: "none",
                    }}
                >
                    Home
                </Button>

                <Typography color="text.primary">
                    Addresses
                </Typography>
            </Breadcrumbs>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                                "primary.main",
                            color: "white",
                        }}
                    >
                        <LocationOnOutlined />
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            My Addresses
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 0.5,
                            }}
                        >
                            Manage your delivery
                            addresses.
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/")
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform:
                                "none",
                        }}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={
                            handleAddAddress
                        }
                        sx={{
                            borderRadius: 2,
                            textTransform:
                                "none",
                        }}
                    >
                        Add Address
                    </Button>
                </Stack>
            </Stack>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                    onClose={() =>
                        dispatch(
                            clearAddressError()
                        )
                    }
                >
                    {getErrorMessage()}
                </Alert>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {message && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                    }}
                    onClose={() =>
                        dispatch(
                            clearAddressMessage()
                        )
                    }
                >
                    {getSuccessMessage()}
                </Alert>
            )}

            {/* =================================================
                ADDRESS FORM
            ================================================= */}

            {formOpen && (
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        border: "1px solid",
                        borderColor:
                            "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent
                        sx={{
                            p: {
                                xs: 2,
                                sm: 3,
                            },
                        }}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            justifyContent="space-between"
                            alignItems={{
                                xs: "flex-start",
                                sm: "center",
                            }}
                            spacing={2}
                            sx={{
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {editingAddress
                                        ? "Edit Address"
                                        : "Add New Address"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.5,
                                    }}
                                >
                                    {editingAddress
                                        ? "Update your delivery address information."
                                        : "Enter your delivery address information."}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                onClick={
                                    handleCloseForm
                                }
                                disabled={
                                    formLoading
                                }
                                sx={{
                                    borderRadius: 2,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Cancel
                            </Button>
                        </Stack>

                        <AddressForm
                            address={
                                editingAddress
                            }
                            loading={
                                formLoading
                            }
                            onSubmit={
                                handleSubmitAddress
                            }
                            onCancel={
                                handleCloseForm
                            }
                        />
                    </CardContent>
                </Card>
            )}

            {/* =================================================
                ADDRESS LIST
            ================================================= */}

            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                }}
            >
                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    {loading &&
                    (!addresses ||
                        addresses.length ===
                            0) ? (
                        <Box
                            sx={{
                                minHeight: 300,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                flexDirection:
                                    "column",
                                gap: 2,
                            }}
                        >
                            <CircularProgress />

                            <Typography
                                color="text.secondary"
                            >
                                Loading addresses...
                            </Typography>
                        </Box>
                    ) : (
                        <AddressList
                            addresses={
                                addresses
                            }
                            loading={loading}
                            error={null}
                            onAdd={
                                handleAddAddress
                            }
                            onEdit={
                                handleEditAddress
                            }
                            onDelete={
                                handleDeleteAddress
                            }
                            onSetDefault={
                                handleSetDefault
                            }
                        />
                    )}
                </CardContent>
            </Card>

            {/* =================================================
                DELETE DIALOG
            ================================================= */}

            <DeleteAddressDialog
                open={
                    deleteDialogOpen
                }
                address={
                    selectedAddress
                }
                loading={deleting}
                error={error}
                onClose={
                    handleCloseDeleteDialog
                }
                onConfirm={
                    handleConfirmDelete
                }
            />
        </Container>
    );
};

export default Addresses;
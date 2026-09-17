// src/components/customer/address/AddressList.jsx

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import {
    AddOutlined,
    LocationOffOutlined,
} from "@mui/icons-material";

import AddressCard from "./AddressCard";

const AddressList = ({
    addresses = [],
    loading = false,
    error = null,
    onAdd,
    onEdit,
    onDelete,
    onSetDefault,
}) => {
    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 250,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading your addresses...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Alert
                severity="error"
                sx={{
                    borderRadius: 2,
                }}
            >
                {typeof error === "string"
                    ? error
                    : error?.message ||
                      "Failed to load addresses."}
            </Alert>
        );
    }

    // =====================================================
    // NORMALIZE ADDRESSES
    // =====================================================

    const addressList = Array.isArray(addresses)
        ? addresses
        : [];

    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (addressList.length === 0) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 4,
                    backgroundColor: "#fafafa",
                }}
            >
                <LocationOffOutlined
                    sx={{
                        fontSize: 60,
                        color: "text.disabled",
                        mb: 2,
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 1,
                    }}
                >
                    No addresses found
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 450,
                        mb: 3,
                    }}
                >
                    You have not added any delivery
                    addresses yet. Add an address to
                    make checkout faster and easier.
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={onAdd}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        textTransform: "none",
                    }}
                >
                    Add New Address
                </Button>
            </Box>
        );
    }

    // =====================================================
    // ADDRESS LIST
    // =====================================================

    return (
        <Stack spacing={2}>
            {/* ==========================================
                Header
            ========================================== */}

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
                    mb: 1,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Saved Addresses
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {addressList.length}{" "}
                        {addressList.length === 1
                            ? "address"
                            : "addresses"}{" "}
                        saved
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={onAdd}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2.5,
                    }}
                >
                    Add Address
                </Button>
            </Stack>

            {/* ==========================================
                Cards
            ========================================== */}

            {addressList.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={() =>
                        onEdit?.(address)
                    }
                    onDelete={() =>
                        onDelete?.(address)
                    }
                    onSetDefault={() =>
                        onSetDefault?.(address)
                    }
                />
            ))}
        </Stack>
    );
};

export default AddressList;
// src/components/customer/address/DeleteAddressDialog.jsx

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";

import {
    DeleteForeverOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";

const DeleteAddressDialog = ({
    open = false,
    address = null,
    loading = false,
    error = null,
    onClose,
    onConfirm,
}) => {
    // =====================================================
    // CLOSE DIALOG
    // =====================================================

    const handleClose = () => {
        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirm = async () => {
        if (
            loading ||
            typeof onConfirm !== "function"
        ) {
            return;
        }

        try {
            await onConfirm(address);
        } catch (deleteError) {
            console.error(
                "Delete address error:",
                deleteError
            );
        }
    };

    // =====================================================
    // ADDRESS DISPLAY
    // =====================================================

    const getAddressText = () => {
        if (!address) {
            return "";
        }

        const parts = [
            address.address_line,
            address.city,
            address.state,
            address.postal_code,
            address.country,
        ].filter(Boolean);

        return parts.join(", ");
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

        return "Failed to delete address.";
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown={loading}
        >
            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    pb: 1,
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <WarningAmberOutlined
                        color="error"
                        sx={{
                            fontSize: 30,
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Delete Address
                    </Typography>
                </Stack>
            </DialogTitle>

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent>
                <Stack spacing={2}>
                    <Typography
                        color="text.secondary"
                    >
                        Are you sure you want to delete
                        this address? This action cannot be
                        undone.
                    </Typography>

                    {/* ADDRESS PREVIEW */}

                    {address && (
                        <Stack
                            spacing={0.8}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                backgroundColor:
                                    "grey.50",
                                border: "1px solid",
                                borderColor:
                                    "divider",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                {address.name ||
                                    "Address"}
                            </Typography>

                            {address.phone && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {address.phone}
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.6,
                                }}
                            >
                                {getAddressText()}
                            </Typography>

                            {address.type && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        textTransform:
                                            "capitalize",
                                    }}
                                >
                                    Type:{" "}
                                    {address.type}
                                </Typography>
                            )}
                        </Stack>
                    )}

                    {/* ERROR */}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2,
                            }}
                        >
                            {getErrorMessage()}
                        </Alert>
                    )}
                </Stack>
            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2.5,
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        minWidth: 100,
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={
                        loading || !address
                    }
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteForeverOutlined />
                        )
                    }
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        minWidth: 140,
                    }}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete Address"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAddressDialog;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
    getReturnRequests,
    clearReturnMessage,
    clearReturnError,
} from "../../../redux/seller/sellerReturnSlice";

import ReturnTable from "./ReturnTable";
import ReturnStatusModal from "./ReturnStatusModal";

const Returns = () => {
    const dispatch = useDispatch();

    const sellerReturn = useSelector(
        (state) => state.sellerReturn
    );

    const {
        returnRequests = [],
        loading = false,
        error = null,
        message = "",
        success = false,
    } = sellerReturn || {};

    const [selectedReturn, setSelectedReturn] =
        useState(null);

    const [openStatusModal, setOpenStatusModal] =
        useState(false);

    const [openSnackbar, setOpenSnackbar] =
        useState(false);

    useEffect(() => {
        dispatch(getReturnRequests());

        return () => {
            dispatch(clearReturnError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (success && message) {
            setOpenSnackbar(true);
        }
    }, [success, message]);

    const handleRefresh = () => {
        dispatch(getReturnRequests());
    };

    const handleStatusModal = (request) => {
        setSelectedReturn(request);
        setOpenStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setSelectedReturn(null);
        setOpenStatusModal(false);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);

        dispatch(clearReturnMessage());
    };

    return (
        <Box p={3}>
            {/* Header */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Return Requests
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={1}
                    >
                        Manage customer return requests.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    {loading
                        ? "Loading..."
                        : "Refresh"}
                </Button>
            </Box>

            {/* Error */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        dispatch(clearReturnError())
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Initial Loading */}

            {loading &&
            returnRequests.length === 0 ? (
                <Box
                    sx={{
                        height: "50vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress size={45} />
                </Box>
            ) : (
                <ReturnTable
                    rows={returnRequests}
                    loading={loading}
                    onUpdateStatus={
                        handleStatusModal
                    }
                />
            )}

            {/* Status Modal */}

            <ReturnStatusModal
                open={openStatusModal}
                onClose={handleCloseStatusModal}
                returnRequest={selectedReturn}
            />

            {/* Success Snackbar */}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={handleSnackbarClose}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Returns;
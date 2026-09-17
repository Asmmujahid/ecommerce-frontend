import {
    useEffect,
} from "react";

import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

import {
    Add,
    Refresh,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    fetchReturnRequests,
    cancelReturnRequest,
    selectReturnRequests,
    selectReturnLoading,
    selectReturnError,
    selectReturnCancelling,
    selectReturnCancelError,
    clearReturnError,
    clearReturnSuccess,
} from "../../../redux/customer/returnRequestSlice";

import ReturnList from "../../../components/customer/return/ReturnList";

const Returns = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const returnRequests =
        useSelector(selectReturnRequests);

    const loading =
        useSelector(selectReturnLoading);

    const error =
        useSelector(selectReturnError);

    const cancelling =
        useSelector(selectReturnCancelling);

    const cancelError =
        useSelector(selectReturnCancelError);

    useEffect(() => {
        dispatch(fetchReturnRequests());

        return () => {
            dispatch(clearReturnError());
            dispatch(clearReturnSuccess());
        };
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchReturnRequests());
    };

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this return request?"
        );

        if (!confirmed) {
            return;
        }

        await dispatch(
            cancelReturnRequest(id)
        );

        dispatch(fetchReturnRequests());
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 4,
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    justifyContent:
                        "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        My Return Requests
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View and manage your product
                        return requests.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() =>
                            navigate(
                                "/customer/return-requests/create"
                            )
                        }
                    >
                        Request Return
                    </Button>
                </Box>
            </Box>

            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {cancelError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {cancelError}
                </Alert>
            )}

            {/* LOADING */}

            {loading ? (
                <Box
                    sx={{
                        minHeight: 250,
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <ReturnList
                    returnRequests={
                        returnRequests
                    }
                    onCancel={handleCancel}
                    cancelling={cancelling}
                />
            )}
        </Container>
    );
};

export default Returns;
import { useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReturnRequestView from "../../../components/admin/returnRequest/ReturnRequestView";

import {
    getReturnRequest,
    clearCurrentReturnRequest,
    clearReturnRequestError,
} from "../../../redux/admin/returnRequestSlice";

const ViewReturnRequest = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        returnRequest,
        loading,
        error,
    } = useSelector(
        (state) =>
            state.adminReturnRequest
    );

    useEffect(() => {
        if (id) {
            dispatch(
                getReturnRequest(id)
            );
        }

        return () => {
            dispatch(
                clearCurrentReturnRequest()
            );

            dispatch(
                clearReturnRequestError()
            );
        };
    }, [dispatch, id]);

    const handleBack = () => {
        navigate(
            "/admin/return-requests"
        );
    };

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

    return (
        <Container maxWidth="lg">
            {/* HEADER */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                flexDirection={{
                    xs: "column",
                    sm: "row",
                }}
                gap={2}
                mb={3}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Return Request Details
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBackIcon />
                    }
                    onClick={handleBack}
                >
                    Back
                </Button>
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

            {/* NOT FOUND */}

            {!loading &&
                !error &&
                !returnRequest && (
                    <Alert severity="warning">
                        Return request not found.
                    </Alert>
                )}

            {/* DETAILS */}

            {returnRequest && (
                <ReturnRequestView
                    request={
                        returnRequest
                    }
                />
            )}
        </Container>
    );
};

export default ViewReturnRequest;
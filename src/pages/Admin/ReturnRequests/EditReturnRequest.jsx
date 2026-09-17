import {
    useEffect,
} from "react";

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
    Card,
    CardContent,
    CircularProgress,
    Container,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReturnRequestForm from "../../../components/admin/returnRequest/ReturnRequestForm";

import {
    getReturnRequest,
    updateReturnRequest,
    clearReturnRequestMessage,
    clearReturnRequestError,
    clearCurrentReturnRequest,
} from "../../../redux/admin/returnRequestSlice";

const EditReturnRequest = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        returnRequest,
        loading,
        error,
        successMessage,
    } = useSelector(
        (state) =>
            state.adminReturnRequest
    );

    // =====================================================
    // FETCH RETURN REQUEST
    // =====================================================

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

            dispatch(
                clearReturnRequestMessage()
            );
        };
    }, [dispatch, id]);

    // =====================================================
    // SUCCESS REDIRECT
    // =====================================================

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timer = setTimeout(() => {
            dispatch(
                clearReturnRequestMessage()
            );

            navigate(
                "/admin/return-requests"
            );
        }, 1200);

        return () => {
            clearTimeout(timer);
        };
    }, [
        successMessage,
        dispatch,
        navigate,
    ]);

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        formData
    ) => {
        if (!id) {
            return;
        }

        await dispatch(
            updateReturnRequest({
                id,
                returnRequestData:
                    formData,
            })
        );
    };

    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {
        navigate(
            "/admin/return-requests"
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading &&
        !returnRequest
    ) {
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

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Container maxWidth="md">
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
                    Edit Return Request
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
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* SUCCESS */}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
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

            {/* FORM */}

            {returnRequest && (
                <Card>
                    <CardContent>
                        <ReturnRequestForm
                            initialValues={
                                returnRequest
                            }
                            onSubmit={
                                handleSubmit
                            }
                            loading={loading}
                            submitLabel="Update Return Request"
                        />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default EditReturnRequest;
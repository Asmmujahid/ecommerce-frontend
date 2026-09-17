import {
    useEffect,
} from "react";

import {
    Container,
    Card,
    CardContent,
    Typography,
    Stack,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

import {
    ArrowBack,
    Cancel,
} from "@mui/icons-material";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    fetchReturnRequest,
    cancelReturnRequest,
    selectReturnRequest,
    selectReturnLoading,
    selectReturnError,
    selectReturnCancelling,
    selectReturnCancelError,
    clearReturnError,
} from "../../../redux/customer/returnRequestSlice";

import ReturnStatusChip from "../../../components/customer/return/ReturnStatusChip";

const ReturnDetails = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const returnRequest =
        useSelector(
            selectReturnRequest
        );

    const loading =
        useSelector(selectReturnLoading);

    const error =
        useSelector(selectReturnError);

    const cancelling =
        useSelector(
            selectReturnCancelling
        );

    const cancelError =
        useSelector(
            selectReturnCancelError
        );

    useEffect(() => {
        if (id) {
            dispatch(
                fetchReturnRequest(id)
            );
        }

        return () => {
            dispatch(clearReturnError());
        };
    }, [dispatch, id]);

    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this return request?"
        );

        if (!confirmed) {
            return;
        }

        const result = await dispatch(
            cancelReturnRequest(id)
        );

        if (
            cancelReturnRequest.fulfilled.match(
                result
            )
        ) {
            navigate(
                "/customer/return-requests"
            );
        }
    };

    if (loading) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 6 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent:
                            "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 4 }}
            >
                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBack />}
                    sx={{ mt: 2 }}
                    onClick={() =>
                        navigate(
                            "/customer/return-requests"
                        )
                    }
                >
                    Back to Returns
                </Button>
            </Container>
        );
    }

    if (!returnRequest) {
        return (
            <Container
                maxWidth="md"
                sx={{ py: 4 }}
            >
                <Alert severity="info">
                    Return request not found.
                </Alert>
            </Container>
        );
    }

    const isPending =
        String(
            returnRequest.status
        ).toLowerCase() === "pending";

    const formattedDate =
        returnRequest.created_at
            ? new Date(
                  returnRequest.created_at
              ).toLocaleString("en-PK")
            : "N/A";

    return (
        <Container
            maxWidth="md"
            sx={{ py: 4 }}
        >
            <Button
                startIcon={<ArrowBack />}
                onClick={() =>
                    navigate(
                        "/customer/return-requests"
                    )
                }
                sx={{ mb: 3 }}
            >
                Back to Returns
            </Button>

            {cancelError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {cancelError}
                </Alert>
            )}

            <Card variant="outlined">
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        {/* HEADER */}

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
                            gap={2}
                        >
                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                Return #{returnRequest.id}
                            </Typography>

                            <ReturnStatusChip
                                status={
                                    returnRequest.status
                                }
                            />
                        </Stack>

                        <Divider />

                        {/* ORDER */}

                        <Box>
                            <Typography
                                color="text.secondary"
                            >
                                Order ID
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                #
                                {
                                    returnRequest.order_id
                                }
                            </Typography>
                        </Box>

                        {/* ORDER ITEM */}

                        <Box>
                            <Typography
                                color="text.secondary"
                            >
                                Order Item ID
                            </Typography>

                            <Typography
                                fontWeight={600}
                            >
                                #
                                {
                                    returnRequest.order_item_id
                                }
                            </Typography>
                        </Box>

                        {/* REASON */}

                        <Box>
                            <Typography
                                color="text.secondary"
                            >
                                Return Reason
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 1,
                                    whiteSpace:
                                        "pre-wrap",
                                }}
                            >
                                {
                                    returnRequest.reason
                                }
                            </Typography>
                        </Box>

                        {/* REFUND */}

                        <Box>
                            <Typography
                                color="text.secondary"
                            >
                                Refund Amount
                            </Typography>

                            <Typography
                                fontWeight={700}
                            >
                                {returnRequest.refund_amount !==
                                null
                                    ? `Rs. ${Number(
                                          returnRequest.refund_amount
                                      ).toLocaleString()}`
                                    : "Not determined yet"}
                            </Typography>
                        </Box>

                        {/* ADMIN NOTE */}

                        {returnRequest.admin_note && (
                            <Box>
                                <Typography
                                    color="text.secondary"
                                >
                                    Admin Note
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        whiteSpace:
                                            "pre-wrap",
                                    }}
                                >
                                    {
                                        returnRequest.admin_note
                                    }
                                </Typography>
                            </Box>
                        )}

                        {/* CREATED */}

                        <Box>
                            <Typography
                                color="text.secondary"
                            >
                                Submitted At
                            </Typography>

                            <Typography>
                                {formattedDate}
                            </Typography>
                        </Box>

                        {/* ACTION */}

                        {isPending && (
                            <>
                                <Divider />

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={
                                        <Cancel />
                                    }
                                    disabled={
                                        cancelling
                                    }
                                    onClick={
                                        handleCancel
                                    }
                                >
                                    {cancelling
                                        ? "Cancelling..."
                                        : "Cancel Return Request"}
                                </Button>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ReturnDetails;
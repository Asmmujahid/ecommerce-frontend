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
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import {
    Controller,
    useForm,
} from "react-hook-form";

import {
    getOrder,
    updateOrder,
    resetOrderState,
} from "../../../redux/admin/orderSlice";

const EditOrder = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {
        order,
        loading,
        error,
    } = useSelector(
        (state) => state.adminOrder
    );

    // ==========================================
    // Form
    // ==========================================

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm({
        defaultValues: {
            status: "",
            payment_status: "",
            tracking_number: "",
            admin_note: "",
        },
    });

    // ==========================================
    // Fetch Order
    // ==========================================

    useEffect(() => {
        dispatch(getOrder(id));

        return () => {
            dispatch(
                resetOrderState()
            );
        };
    }, [dispatch, id]);

    // ==========================================
    // Populate Form
    // ==========================================

    useEffect(() => {
        if (!order) {
            return;
        }

        reset({
            status:
                order.status || "",

            payment_status:
                order.payment_status ||
                "",

            tracking_number:
                order.tracking_number ||
                "",

            admin_note:
                order.admin_note ||
                "",
        });
    }, [
        order,
        reset,
    ]);

    // ==========================================
    // Submit
    // ==========================================

    const onSubmit = async (
        data
    ) => {
        try {
            await dispatch(
                updateOrder({
                    id,
                    orderData: {
                        status:
                            data.status,
                        payment_status:
                            data.payment_status,
                        tracking_number:
                            data.tracking_number ||
                            null,
                        admin_note:
                            data.admin_note ||
                            null,
                    },
                })
            ).unwrap();

            navigate(
                `/admin/orders/${id}`
            );
        } catch (err) {
            console.error(err);
        }
    };

    // ==========================================
    // Loading
    // ==========================================

    if (loading && !order) {
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

    // ==========================================
    // Order Not Found
    // ==========================================

    if (!order && !loading) {
        return (
            <Box p={3}>
                <Alert severity="info">
                    Order not found.
                </Alert>
            </Box>
        );
    }

    // ==========================================
    // Total
    // ==========================================

    const orderTotal =
        order?.total ??
        order?.total_amount ??
        0;

    return (
        <Box p={3}>

            {/* ======================================
                Header
            ====================================== */}

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
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Edit Order
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        {order?.order_number ||
                            `Order #${id}`}
                    </Typography>
                </Box>

                <Button
                    startIcon={
                        <ArrowBackIcon />
                    }
                    variant="outlined"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Back
                </Button>
            </Stack>

            {/* ======================================
                Error
            ====================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>

                    {/* ==================================
                        Readonly Information
                    ================================== */}

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Order Number"
                                value={
                                    order
                                        ?.order_number ||
                                    ""
                                }
                                disabled
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Customer"
                                value={
                                    order
                                        ?.user
                                        ?.name ||
                                    ""
                                }
                                disabled
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Customer Email"
                                value={
                                    order
                                        ?.user
                                        ?.email ||
                                    ""
                                }
                                disabled
                            />
                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Order Total"
                                value={`Rs. ${Number(
                                    orderTotal
                                ).toLocaleString()}`}
                                disabled
                            />
                        </Grid>

                    </Grid>

                    <Divider
                        sx={{
                            my: 4,
                        }}
                    />

                    {/* ==================================
                        Form
                    ================================== */}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                    >

                        <Grid
                            container
                            spacing={3}
                        >

                            {/* =================================
                                Order Status
                            ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <Controller
                                    name="status"
                                    control={
                                        control
                                    }
                                    rules={{
                                        required:
                                            "Order status is required",
                                    }}
                                    render={({
                                        field,
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            select
                                            label="Order Status"
                                            error={
                                                !!errors.status
                                            }
                                            helperText={
                                                errors
                                                    .status
                                                    ?.message
                                            }
                                        >
                                            <MenuItem value="pending">
                                                Pending
                                            </MenuItem>

                                            <MenuItem value="processing">
                                                Processing
                                            </MenuItem>

                                            <MenuItem value="shipped">
                                                Shipped
                                            </MenuItem>

                                            <MenuItem value="delivered">
                                                Delivered
                                            </MenuItem>

                                            <MenuItem value="cancelled">
                                                Cancelled
                                            </MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            {/* =================================
                                Payment Status
                            ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >
                                <Controller
                                    name="payment_status"
                                    control={
                                        control
                                    }
                                    rules={{
                                        required:
                                            "Payment status is required",
                                    }}
                                    render={({
                                        field,
                                    }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            select
                                            label="Payment Status"
                                            error={
                                                !!errors.payment_status
                                            }
                                            helperText={
                                                errors
                                                    .payment_status
                                                    ?.message
                                            }
                                        >
                                            <MenuItem value="pending">
                                                Pending
                                            </MenuItem>

                                            <MenuItem value="paid">
                                                Paid
                                            </MenuItem>

                                            <MenuItem value="failed">
                                                Failed
                                            </MenuItem>

                                            <MenuItem value="refunded">
                                                Refunded
                                            </MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            {/* =================================
                                Tracking Number
                            ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    label="Tracking Number"
                                    {...register(
                                        "tracking_number"
                                    )}
                                />
                            </Grid>

                            {/* =================================
                                Admin Note
                            ================================= */}

                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >
                                <TextField
                                    fullWidth
                                    rows={5}
                                    multiline
                                    label="Admin Note"
                                    {...register(
                                        "admin_note"
                                    )}
                                />
                            </Grid>

                        </Grid>

                        {/* ==================================
                            Buttons
                        ================================== */}

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            mt={4}
                        >

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <SaveIcon />
                                    )
                                }
                                disabled={
                                    loading
                                }
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        `/admin/orders/${id}`
                                    )
                                }
                                disabled={
                                    loading
                                }
                            >
                                Cancel
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>
            </Card>
        </Box>
    );
};

export default EditOrder;


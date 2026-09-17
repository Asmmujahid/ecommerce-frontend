import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const DeleteOrderDialog = ({
    open,
    onClose,
    onConfirm,
    order,
}) => {
    const getTotal = () => {
        const value =
            order?.total_amount ??
            order?.total ??
            0;

        return Number(value || 0).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                >
                    <WarningAmberRoundedIcon color="error" />

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Delete Order
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this
                    order?
                </DialogContentText>

                {order && (
                    <Box mt={2}>
                        <Typography
                            variant="body2"
                            gutterBottom
                        >
                            <strong>Order #:</strong>{" "}
                            {order.order_number ??
                                `#${order.id}`}
                        </Typography>

                        <Typography
                            variant="body2"
                            gutterBottom
                        >
                            <strong>Customer:</strong>{" "}
                            {order.user?.name ?? "N/A"}
                        </Typography>

                        <Typography
                            variant="body2"
                            gutterBottom
                        >
                            <strong>Total:</strong> Rs.{" "}
                            {getTotal()}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="body2"
                            color="error"
                            fontWeight="bold"
                        >
                            This action cannot be undone.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                >
                    Delete Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteOrderDialog;


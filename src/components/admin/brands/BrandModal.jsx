import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

const BrandModal = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    pb: 1,
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent>
                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Please Wait..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BrandModal;
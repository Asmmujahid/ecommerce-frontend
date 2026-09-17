import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@mui/material";

const ConfirmDialog = ({
    open,
    title = "Confirmation",
    message = "Are you sure you want to continue?",
    confirmText = "Yes",
    cancelText = "Cancel",
    confirmColor = "error",
    onConfirm,
    onClose,
    loading = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color={confirmColor}
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Please Wait..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
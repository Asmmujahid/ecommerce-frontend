import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Avatar,
    Typography,
    Box,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const DeleteUserDialog = ({
    open,
    onClose,
    onConfirm,
    user,
    loading = false,
}) => {
    if (!user) return null;

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "error.main",
                    fontWeight: 700,
                }}
            >
                <WarningAmberRoundedIcon color="error" />
                Delete User
            </DialogTitle>

            <DialogContent>

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={3}
                >
                    <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{
                            width: 60,
                            height: 60,
                        }}
                    >
                        {user.name?.charAt(0)}
                    </Avatar>

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                        >
                            {user.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {user.email}
                        </Typography>

                        {user.phone && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {user.phone}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <DialogContentText>
                    Are you sure you want to permanently delete this
                    customer?
                </DialogContentText>

                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        mt: 2,
                        fontWeight: 600,
                    }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    disabled={loading}
                    onClick={() => onConfirm(user.id)}
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : null
                    }
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;
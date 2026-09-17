// src/components/customer/profile/DeleteAccountCard.jsx

import {
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

// =====================================================
// COMPONENT
// =====================================================

const DeleteAccountCard = ({
    deleting,
    onDelete,
}) => {
    return (
        <Card
            sx={{
                mt: 3,
                width: "100%",
                border: "1px solid",
                borderColor:
                    "error.light",
                borderRadius: 2,
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        sm: 3,
                    },
                }}
            >
                <Stack spacing={2}>
                    <Typography
                        variant="h6"
                        color="error"
                        fontWeight={700}
                    >
                        Danger Zone
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Deleting your account is
                        permanent. Your account
                        information will be
                        removed.
                    </Typography>

                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={
                            <DeleteIcon />
                        }
                        onClick={onDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting..."
                            : "Delete Account"}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default DeleteAccountCard;
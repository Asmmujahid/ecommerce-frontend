import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";

import {
    updateReturnRequest,
} from "../../../redux/seller/sellerReturnSlice";

const ReturnStatusModal = ({
    open,
    onClose,
    returnRequest,
}) => {
    const dispatch = useDispatch();

    const {
        loading = false,
        error = null,
    } = useSelector(
        (state) => state.sellerReturn || {}
    );

    const [status, setStatus] =
        useState("approved");

    const [adminNote, setAdminNote] =
        useState("");

    const [submitError, setSubmitError] =
        useState("");

    useEffect(() => {
        if (returnRequest) {
            setStatus(
                returnRequest.status === "rejected"
                    ? "rejected"
                    : "approved"
            );

            setAdminNote(
                returnRequest.admin_note || ""
            );
        }
    }, [returnRequest]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!returnRequest) {
            return;
        }

        setSubmitError("");

        try {
            await dispatch(
                updateReturnRequest({
                    id: returnRequest.id,

                    data: {
                        status,
                        admin_note:
                            adminNote.trim() || null,
                    },
                })
            ).unwrap();

            onClose();
        } catch (error) {
            setSubmitError(
                typeof error === "string"
                    ? error
                    : "Failed to update return request."
            );
        }
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setSubmitError("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Update Return Request
            </DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <DialogContent>
                    {(error || submitError) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {submitError || error}
                        </Alert>
                    )}

                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Status
                            </InputLabel>

                            <Select
                                label="Status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                <MenuItem value="approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="rejected">
                                    Rejected
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Admin Note"
                            multiline
                            rows={4}
                            fullWidth
                            value={adminNote}
                            onChange={(event) =>
                                setAdminNote(
                                    event.target.value
                                )
                            }
                            placeholder="Write reason or additional notes..."
                            disabled={loading}
                            inputProps={{
                                maxLength: 1000,
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="inherit"
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={
                            loading ||
                            !returnRequest
                        }
                    >
                        {loading ? (
                            <CircularProgress
                                size={22}
                                color="inherit"
                            />
                        ) : (
                            "Update"
                        )}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ReturnStatusModal;
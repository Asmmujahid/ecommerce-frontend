import { useState } from "react";
import { useDispatch } from "react-redux";

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { updateVendor } from "../../../redux/admin/vendorSlice";

const VendorStatus = ({ vendor }) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

    const [status, setStatus] = useState(
        vendor.status
    );

    const [newStatus, setNewStatus] = useState(
        vendor.status
    );

    const handleOpen = (value) => {
        setNewStatus(value);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = async () => {
        try {
            await dispatch(
                updateVendor({
                    id: vendor.id,
                    vendorData: {
                        store_name: vendor.store_name,
                        description: vendor.description,
                        logo: vendor.logo,
                        banner: vendor.banner,
                        phone: vendor.phone,
                        address: vendor.address,
                        status: newStatus,
                    },
                })
            ).unwrap();

            setStatus(newStatus);
        } catch (error) {
            console.error(error);
        }

        setOpen(false);
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={1}
            >
                <Chip
                    label={
                        status
                            ? "Approved"
                            : "Pending"
                    }
                    color={
                        status
                            ? "success"
                            : "warning"
                    }
                    size="small"
                />

                {!status ? (
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={
                            <CheckCircleIcon />
                        }
                        onClick={() =>
                            handleOpen(true)
                        }
                    >
                        Approve
                    </Button>
                ) : (
                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={
                            <CancelIcon />
                        }
                        onClick={() =>
                            handleOpen(false)
                        }
                    >
                        Reject
                    </Button>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {newStatus
                        ? "Approve Vendor"
                        : "Reject Vendor"}
                </DialogTitle>

                <DialogContent>

                    <DialogContentText>
                        {newStatus
                            ? `Are you sure you want to approve "${vendor.store_name}"?`
                            : `Are you sure you want to reject "${vendor.store_name}"?`}
                    </DialogContentText>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        color={
                            newStatus
                                ? "success"
                                : "warning"
                        }
                    >
                        Confirm
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
};

export default VendorStatus;
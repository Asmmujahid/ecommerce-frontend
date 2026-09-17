import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Typography,
    Box,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
    deleteVendor,
    updateVendor,
} from "../../../redux/admin/vendorSlice";

const VendorTable = ({ vendors = [] }) => {
    const dispatch = useDispatch();

    const handleDelete = (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this vendor?"
            )
        ) {
            dispatch(deleteVendor(id));
        }
    };

    const handleStatus = (vendor, status) => {
        dispatch(
            updateVendor({
                id: vendor.id,
                vendorData: {
                    store_name: vendor.store_name,
                    description: vendor.description,
                    logo: vendor.logo,
                    banner: vendor.banner,
                    phone: vendor.phone,
                    address: vendor.address,
                    status,
                },
            })
        );
    };

    if (vendors.length === 0) {
        return (
            <Paper sx={{ p: 4 }}>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    No vendors found.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>

                <TableHead>
                    <TableRow>

                        <TableCell>ID</TableCell>

                        <TableCell>Logo</TableCell>

                        <TableCell>Store</TableCell>

                        <TableCell>Owner</TableCell>

                        <TableCell>Email</TableCell>

                        <TableCell>Phone</TableCell>

                        <TableCell>Status</TableCell>

                        <TableCell align="center">
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>

                    {vendors.map((vendor) => (

                        <TableRow
                            key={vendor.id}
                            hover
                        >

                            <TableCell>
                                {vendor.id}
                            </TableCell>

                            <TableCell>
                                <Avatar
                                    src={vendor.logo}
                                    alt={vendor.store_name}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                    }}
                                />
                            </TableCell>

                            <TableCell>
                                <Typography
                                    fontWeight={600}
                                >
                                    {vendor.store_name}
                                </Typography>
                            </TableCell>

                            <TableCell>
                                {vendor.user?.name}
                            </TableCell>

                            <TableCell>
                                {vendor.user?.email}
                            </TableCell>

                            <TableCell>
                                {vendor.phone || "-"}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={
                                        vendor.status
                                            ? "Approved"
                                            : "Pending"
                                    }
                                    color={
                                        vendor.status
                                            ? "success"
                                            : "warning"
                                    }
                                    size="small"
                                />

                            </TableCell>

                            <TableCell>

                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={1}
                                >

                                    <Tooltip title="View">

                                        <IconButton
                                            component={Link}
                                            to={`/admin/vendors/view/${vendor.id}`}
                                            color="primary"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Edit">

                                        <IconButton
                                            component={Link}
                                            to={`/admin/vendors/edit/${vendor.id}`}
                                            color="secondary"
                                        >
                                            <EditIcon />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                handleDelete(
                                                    vendor.id
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                    </Tooltip>

                                    {!vendor.status && (

                                        <Tooltip title="Approve">

                                            <IconButton
                                                color="success"
                                                onClick={() =>
                                                    handleStatus(
                                                        vendor,
                                                        true
                                                    )
                                                }
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>

                                        </Tooltip>

                                    )}

                                    {vendor.status && (

                                        <Tooltip title="Reject">

                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    handleStatus(
                                                        vendor,
                                                        false
                                                    )
                                                }
                                            >
                                                <CancelIcon />
                                            </IconButton>

                                        </Tooltip>

                                    )}

                                </Box>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default VendorTable;
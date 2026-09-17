import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Delete,
    Edit,
} from "@mui/icons-material";

const InventoryTable = ({
    inventories = [],
    onEdit,
    onDelete,
}) => {
    return (
        <TableContainer component={Paper}>
            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Product</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Variant</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Quantity</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Movement</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Note</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Created</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Actions</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {inventories.length > 0 ? (

                        inventories.map((item) => (

                            <TableRow
                                key={item.id}
                                hover
                            >

                                <TableCell>
                                    {item.id}
                                </TableCell>

                                <TableCell>
                                    {item.product?.name || "N/A"}
                                </TableCell>

                                <TableCell>

                                    {item.product_variant ? (
                                        <>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {item.product_variant.size}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {item.product_variant.color}
                                            </Typography>
                                        </>
                                    ) : (
                                        "-"
                                    )}

                                </TableCell>

                                <TableCell align="center">
                                    {item.quantity}
                                </TableCell>

                                <TableCell align="center">

                                    <Chip
                                        label={
                                            item.type === "in"
                                                ? "Stock IN"
                                                : "Stock OUT"
                                        }
                                        color={
                                            item.type === "in"
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>
                                    {item.note || "-"}
                                </TableCell>

                                <TableCell>
                                    {new Date(
                                        item.created_at
                                    ).toLocaleDateString()}
                                </TableCell>

                                <TableCell align="center">

                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onEdit(item.id)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(item.id)
                                            }
                                        >
                                            <Delete />
                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))

                    ) : (

                        <TableRow>

                            <TableCell
                                colSpan={8}
                                align="center"
                            >
                                <Typography
                                    color="text.secondary"
                                    py={3}
                                >
                                    No inventory records found.
                                </Typography>
                            </TableCell>

                        </TableRow>

                    )}

                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default InventoryTable;
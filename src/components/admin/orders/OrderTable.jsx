import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import OrderRow from "./OrderRow";

const OrderTable = ({
    orders = [],
    onDelete,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                overflow: "hidden",
            }}
        >
            <TableContainer>
                <Table>

                    <TableHead>
                        <TableRow>

                            <TableCell>
                                Order #
                            </TableCell>

                            <TableCell>
                                Customer
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell align="center">
                                Total
                            </TableCell>

                            <TableCell align="center">
                                Status
                            </TableCell>

                            <TableCell align="center">
                                Payment
                            </TableCell>

                            <TableCell>
                                Created
                            </TableCell>

                            <TableCell align="center">
                                Actions
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {orders.length > 0 ? (

                            orders.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    onDelete={onDelete}
                                />
                            ))

                        ) : (

                            <TableRow>

                                <TableCell
                                    colSpan={8}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    <Typography color="text.secondary">
                                        No orders found.
                                    </Typography>
                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrderTable;
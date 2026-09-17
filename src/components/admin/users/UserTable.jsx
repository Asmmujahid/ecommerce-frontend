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

import UserRow from "./UserRow";

const UserTable = ({ users = [], onDelete }) => {
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
                            <TableCell>Avatar</TableCell>

                            <TableCell>
                                Name
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Phone
                            </TableCell>

                            <TableCell align="center">
                                Status
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

                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    align="center"
                                    sx={{ py: 5 }}
                                >
                                    <Typography color="text.secondary">
                                        No customers found.
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

export default UserTable;
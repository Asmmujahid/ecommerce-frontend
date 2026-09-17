import {
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const UserSkeleton = ({ rows = 8 }) => {
    return (
        <Paper elevation={3}>
            <TableContainer>
                <Table>

                    {/* Table Header */}

                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={60}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={180}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={70}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={30}
                                />
                            </TableCell>

                            <TableCell align="center">
                                <Skeleton
                                    variant="text"
                                    width={80}
                                    height={30}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Skeleton Rows */}

                    <TableBody>

                        {Array.from({ length: rows }).map((_, index) => (
                            <TableRow key={index}>

                                {/* Avatar */}

                                <TableCell>
                                    <Skeleton
                                        variant="circular"
                                        width={45}
                                        height={45}
                                    />
                                </TableCell>

                                {/* Name */}

                                <TableCell>
                                    <Skeleton
                                        variant="text"
                                        width={130}
                                        height={28}
                                    />
                                </TableCell>

                                {/* Email */}

                                <TableCell>
                                    <Skeleton
                                        variant="text"
                                        width={220}
                                        height={28}
                                    />
                                </TableCell>

                                {/* Phone */}

                                <TableCell>
                                    <Skeleton
                                        variant="text"
                                        width={120}
                                        height={28}
                                    />
                                </TableCell>

                                {/* Status */}

                                <TableCell>
                                    <Skeleton
                                        variant="rounded"
                                        width={50}
                                        height={24}
                                    />
                                </TableCell>

                                {/* Created */}

                                <TableCell>
                                    <Skeleton
                                        variant="text"
                                        width={100}
                                        height={28}
                                    />
                                </TableCell>

                                {/* Actions */}

                                <TableCell align="center">
                                    <div className="flex justify-center gap-2">
                                        <Skeleton
                                            variant="circular"
                                            width={34}
                                            height={34}
                                        />

                                        <Skeleton
                                            variant="circular"
                                            width={34}
                                            height={34}
                                        />

                                        <Skeleton
                                            variant="circular"
                                            width={34}
                                            height={34}
                                        />
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
};

export default UserSkeleton;
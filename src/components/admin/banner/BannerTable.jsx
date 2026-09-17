import {
    Box,
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
    Visibility,
    Edit,
    Delete,
    Image as ImageIcon,
} from "@mui/icons-material";

const BannerTable = ({
    banners = [],
    onView = () => {},
    onEdit = () => {},
    onDelete = () => {},
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
                            <strong>Image</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Title</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Link</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Position</strong>
                        </TableCell>

                        <TableCell align="center">
                            <strong>Status</strong>
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

                    {banners.length > 0 ? (

                        banners.map((banner) => (

                            <TableRow
                                key={banner.id}
                                hover
                            >

                                <TableCell>
                                    {banner.id}
                                </TableCell>

                                <TableCell>

                                    {banner.image ? (

                                        <Box
                                            component="img"
                                            src={banner.image}
                                            alt={banner.title}
                                            sx={{
                                                width: 70,
                                                height: 45,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                                border: "1px solid #ddd",
                                            }}
                                        />

                                    ) : (

                                        <ImageIcon color="disabled" />

                                    )}

                                </TableCell>

                                <TableCell>

                                    <Typography fontWeight={600}>
                                        {banner.title || "-"}
                                    </Typography>

                                </TableCell>

                                <TableCell>

                                    {banner.link ? (

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                maxWidth: 250,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {banner.link}
                                        </Typography>

                                    ) : (

                                        "-"

                                    )}

                                </TableCell>

                                <TableCell align="center">
                                    {banner.position}
                                </TableCell>

                                <TableCell align="center">

                                    <Chip
                                        size="small"
                                        label={
                                            banner.status
                                                ? "Active"
                                                : "Inactive"
                                        }
                                        color={
                                            banner.status
                                                ? "success"
                                                : "error"
                                        }
                                    />

                                </TableCell>

                                <TableCell>

                                    {banner.created_at
                                        ? new Date(
                                              banner.created_at
                                          ).toLocaleDateString()
                                        : "-"}

                                </TableCell>

                                <TableCell align="center">

                                    <Tooltip title="View">

                                        <IconButton
                                            color="info"
                                            onClick={() =>
                                                onView(banner.id)
                                            }
                                        >
                                            <Visibility />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onEdit(banner.id)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(banner.id)
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

                                <Box py={5}>

                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No banners found
                                    </Typography>

                                </Box>

                            </TableCell>

                        </TableRow>

                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
};

export default BannerTable;
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Link as LinkIcon,
} from "@mui/icons-material";

const BannerCard = ({
    banner,
    onView = () => {},
    onEdit = () => {},
    onDelete = () => {},
}) => {
    if (!banner) return null;

    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={
                    banner.image ||
                    "https://placehold.co/600x300?text=No+Image"
                }
                alt={banner.title || "Banner"}
                sx={{
                    objectFit: "cover",
                }}
            />

            <CardContent sx={{ flexGrow: 1 }}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        noWrap
                    >
                        {banner.title || "Untitled Banner"}
                    </Typography>

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
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                >
                    <strong>ID:</strong> {banner.id}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                >
                    <strong>Position:</strong>{" "}
                    {banner.position}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                        wordBreak: "break-all",
                    }}
                >
                    <strong>Link:</strong>{" "}
                    {banner.link || "-"}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Created:
                    {" "}
                    {banner.created_at
                        ? new Date(
                              banner.created_at
                          ).toLocaleDateString()
                        : "-"}
                </Typography>

            </CardContent>

            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                }}
            >

                <Button
                    size="small"
                    color="info"
                    startIcon={<Visibility />}
                    onClick={() =>
                        onView(banner.id)
                    }
                >
                    View
                </Button>

                <Button
                    size="small"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() =>
                        onEdit(banner.id)
                    }
                >
                    Edit
                </Button>

                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() =>
                        onDelete(banner.id)
                    }
                >
                    Delete
                </Button>

            </CardActions>
        </Card>
    );
};

export default BannerCard;
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Link,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Image as ImageIcon,
    Link as LinkIcon,
} from "@mui/icons-material";

const BannerView = ({
    banner,
    onBack = () => {},
    onEdit = () => {},
}) => {
    if (!banner) return null;

    return (
        <Card>

            <CardContent>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Banner Details
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() =>
                                onEdit(banner.id)
                            }
                        >
                            Edit
                        </Button>

                    </Stack>

                </Stack>

                <Divider sx={{ mb: 4 }} />

                <Grid
                    container
                    spacing={4}
                >

                    <Grid
                        item
                        xs={12}
                        md={5}
                    >

                        <Box
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >

                            {banner.image ? (

                                <Box
                                    component="img"
                                    src={banner.image}
                                    alt={banner.title}
                                    sx={{
                                        width: "100%",
                                        height: 300,
                                        objectFit: "cover",
                                    }}
                                />

                            ) : (

                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={300}
                                >
                                    <ImageIcon
                                        sx={{
                                            fontSize: 80,
                                            color: "gray",
                                        }}
                                    />
                                </Box>

                            )}

                        </Box>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={7}
                    >

                        <Stack spacing={2}>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Banner ID
                                </Typography>

                                <Typography
                                    variant="h6"
                                >
                                    {banner.id}
                                </Typography>

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Title
                                </Typography>

                                <Typography
                                    variant="h6"
                                >
                                    {banner.title || "-"}
                                </Typography>

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Image URL
                                </Typography>

                                <Typography
                                    sx={{
                                        wordBreak:
                                            "break-all",
                                    }}
                                >
                                    {banner.image}
                                </Typography>

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Redirect Link
                                </Typography>

                                {banner.link ? (

                                    <Link
                                        href={
                                            banner.link
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="hover"
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >
                                            <LinkIcon
                                                fontSize="small"
                                            />

                                            <Typography>
                                                {
                                                    banner.link
                                                }
                                            </Typography>

                                        </Stack>

                                    </Link>

                                ) : (

                                    <Typography>
                                        -
                                    </Typography>

                                )}

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Position
                                </Typography>

                                <Typography>
                                    {banner.position}
                                </Typography>

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>

                                <Chip
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

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Created At
                                </Typography>

                                <Typography>
                                    {banner.created_at
                                        ? new Date(
                                              banner.created_at
                                          ).toLocaleString()
                                        : "-"}
                                </Typography>

                            </Box>

                            <Box>

                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Updated At
                                </Typography>

                                <Typography>
                                    {banner.updated_at
                                        ? new Date(
                                              banner.updated_at
                                          ).toLocaleString()
                                        : "-"}
                                </Typography>

                            </Box>

                        </Stack>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>
    );
};

export default BannerView;
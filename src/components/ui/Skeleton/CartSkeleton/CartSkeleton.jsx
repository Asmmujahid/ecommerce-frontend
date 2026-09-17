import {
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    Box,
    Stack,
} from "@mui/material";

const CartSkeleton = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card
                    key={index}
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    {/* Product Image */}

                    <CardMedia
                        sx={{
                            width: {
                                xs: "100%",
                                sm: 150,
                            },
                            height: 150,
                            flexShrink: 0,
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                        />
                    </CardMedia>

                    {/* Product Details */}

                    <CardContent
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width="70%"
                            height={35}
                            animation="wave"
                        />

                        <Skeleton
                            variant="text"
                            width="40%"
                            animation="wave"
                        />

                        <Skeleton
                            variant="text"
                            width="30%"
                            animation="wave"
                        />

                        <Skeleton
                            variant="text"
                            width="25%"
                            height={35}
                            sx={{ mt: 1 }}
                            animation="wave"
                        />

                        {/* Quantity */}

                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mt: 2 }}
                        >
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                                animation="wave"
                            />

                            <Skeleton
                                variant="text"
                                width={30}
                                animation="wave"
                            />

                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                                animation="wave"
                            />
                        </Stack>
                    </CardContent>

                    {/* Right Side */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: {
                                xs: "stretch",
                                sm: "flex-end",
                            },
                            gap: 2,
                            width: {
                                xs: "100%",
                                sm: 150,
                            },
                        }}
                    >
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                            animation="wave"
                        />

                        <Skeleton
                            variant="text"
                            width={80}
                            height={35}
                            animation="wave"
                        />

                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={40}
                            animation="wave"
                        />
                    </Box>
                </Card>
            ))}
        </>
    );
};

export default CartSkeleton;
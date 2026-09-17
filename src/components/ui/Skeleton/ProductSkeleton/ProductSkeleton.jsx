import {
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    Box,
} from "@mui/material";

const ProductSkeleton = () => {
    return (
        <Card
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >
            <Skeleton
                variant="rectangular"
                height={240}
            />

            <CardContent>
                <Skeleton
                    variant="text"
                    width="80%"
                    height={35}
                />

                <Skeleton
                    variant="text"
                    width="40%"
                />

                <Skeleton
                    variant="text"
                    width="60%"
                />

                <Box mt={2}>
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={35}
                    />
                </Box>

                <Box
                    display="flex"
                    gap={1}
                    mt={3}
                >
                    <Skeleton
                        variant="rounded"
                        width="50%"
                        height={40}
                    />

                    <Skeleton
                        variant="rounded"
                        width="50%"
                        height={40}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductSkeleton;
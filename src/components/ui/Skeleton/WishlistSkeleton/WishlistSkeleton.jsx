import {
    Card,
    CardContent,
    Skeleton,
    Box,
} from "@mui/material";

const WishlistSkeleton = () => {
    return (
        <Card
            sx={{
                borderRadius: 3,
            }}
        >
            <Skeleton
                variant="rectangular"
                height={230}
            />

            <CardContent>
                <Skeleton
                    width="70%"
                    height={35}
                />

                <Skeleton width="50%" />

                <Skeleton width="35%" />

                <Box mt={2}>
                    <Skeleton
                        width="30%"
                        height={35}
                    />
                </Box>

                <Box mt={3}>
                    <Skeleton
                        variant="rounded"
                        height={40}
                    />

                    <Skeleton
                        variant="rounded"
                        height={40}
                        sx={{ mt: 1 }}
                    />

                    <Skeleton
                        variant="rounded"
                        height={40}
                        sx={{ mt: 1 }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default WishlistSkeleton;
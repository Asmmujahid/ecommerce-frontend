import {
    Box,
    Paper,
    Skeleton,
} from "@mui/material";

const OrderSkeleton = () => {
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
            }}
        >
            <Skeleton
                variant="text"
                width={220}
                height={40}
            />

            <Skeleton
                variant="rectangular"
                height={50}
                sx={{ mt: 3 }}
            />

            {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} mt={2}>
                    <Skeleton
                        variant="rectangular"
                        height={65}
                    />
                </Box>
            ))}
        </Paper>
    );
};

export default OrderSkeleton;
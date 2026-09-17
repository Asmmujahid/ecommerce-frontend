import {
    Card,
    CardContent,
    Skeleton,
} from "@mui/material";

const OrderSkeleton = () => {
    return (
        <Card
            sx={{
                mb: 3,
                borderRadius: 3,
            }}
        >
            <CardContent>
                <Skeleton
                    width="40%"
                    height={35}
                />

                <Skeleton width="60%" />

                <Skeleton width="50%" />

                <Skeleton width="30%" />

                <Skeleton
                    variant="rounded"
                    height={40}
                    sx={{ mt: 2 }}
                />
            </CardContent>
        </Card>
    );
};

export default OrderSkeleton;
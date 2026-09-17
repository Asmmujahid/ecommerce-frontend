import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const BrandSkeleton = ({ count = 10 }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <Card
                    key={index}
                    className="rounded-xl shadow-md overflow-hidden"
                >
                    {/* Brand Logo */}
                    <Skeleton
                        variant="rectangular"
                        height={140}
                        animation="wave"
                    />

                    <CardContent className="flex flex-col items-center">
                        {/* Brand Name */}
                        <Skeleton
                            variant="text"
                            width="70%"
                            height={35}
                            animation="wave"
                        />

                        {/* Brand Description */}
                        <Skeleton
                            variant="text"
                            width="90%"
                            height={22}
                            animation="wave"
                        />

                        <Skeleton
                            variant="text"
                            width="60%"
                            height={22}
                            animation="wave"
                        />

                        {/* View Brand Button */}
                        <Skeleton
                            variant="rounded"
                            width="100%"
                            height={40}
                            animation="wave"
                            sx={{ mt: 2 }}
                        />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default BrandSkeleton;
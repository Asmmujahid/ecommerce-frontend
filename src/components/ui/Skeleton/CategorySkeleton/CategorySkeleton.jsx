import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const CategorySkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <Card
                    key={index}
                    className="rounded-xl shadow-md overflow-hidden"
                >
                    {/* Category Image */}
                    <Skeleton
                        variant="rectangular"
                        height={180}
                        animation="wave"
                    />

                    <CardContent className="text-center">
                        {/* Category Name */}
                        <Skeleton
                            variant="text"
                            width="70%"
                            height={35}
                            animation="wave"
                            sx={{ mx: "auto" }}
                        />

                        {/* Category Description */}
                        <Skeleton
                            variant="text"
                            width="90%"
                            height={25}
                            animation="wave"
                            sx={{ mx: "auto" }}
                        />

                        <Skeleton
                            variant="text"
                            width="60%"
                            height={25}
                            animation="wave"
                            sx={{ mx: "auto" }}
                        />

                        {/* Button */}
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

export default CategorySkeleton;
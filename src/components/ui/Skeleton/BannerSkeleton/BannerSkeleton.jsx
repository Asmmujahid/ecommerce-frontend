import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const BannerSkeleton = () => {
    return (
        <Box className="w-full">
            <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl">

                {/* Banner Image */}
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                />

                {/* Banner Content */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 space-y-4 w-1/2">

                    {/* Small Heading */}
                    <Skeleton
                        variant="text"
                        width="40%"
                        height={30}
                        animation="wave"
                    />

                    {/* Main Heading */}
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={60}
                        animation="wave"
                    />

                    <Skeleton
                        variant="text"
                        width="75%"
                        height={45}
                        animation="wave"
                    />

                    {/* Description */}
                    <Skeleton
                        variant="text"
                        width="100%"
                        height={30}
                        animation="wave"
                    />

                    <Skeleton
                        variant="text"
                        width="80%"
                        height={30}
                        animation="wave"
                    />

                    {/* Button */}
                    <Skeleton
                        variant="rounded"
                        width={180}
                        height={50}
                        animation="wave"
                    />
                </div>
            </div>
        </Box>
    );
};

export default BannerSkeleton;
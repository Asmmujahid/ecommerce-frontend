import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = ({
    size = 50,
    text = "Loading...",
    fullScreen = false,
}) => {
    if (fullScreen) {
        return (
            <Box
                className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center"
            >
                <CircularProgress size={size} />

                <p className="mt-4 text-gray-600 text-lg font-medium">
                    {text}
                </p>
            </Box>
        );
    }

    return (
        <Box
            className="flex flex-col items-center justify-center py-16"
        >
            <CircularProgress size={size} />

            <p className="mt-4 text-gray-600 text-base font-medium">
                {text}
            </p>
        </Box>
    );
};

export default Loader;
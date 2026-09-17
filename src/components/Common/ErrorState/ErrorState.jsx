import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import Button from "@mui/material/Button";


const ErrorState = ({
    title = "Something went wrong!",
    message = "Unable to load data. Please try again.",
    buttonText = "Try Again",
    onRetry,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">

            {/* Error Icon */}
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <ErrorOutlinedIcon
                    color="error"
                    sx={{ fontSize: 60 }}
                />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {title}
            </h2>

            {/* Message */}
            <p className="text-gray-500 max-w-lg mb-8">
                {message}
            </p>

            {/* Retry Button */}
            {onRetry && (
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={onRetry}
                >
                    {buttonText}
                </Button>
            )}

        </div>
    );
};

export default ErrorState;
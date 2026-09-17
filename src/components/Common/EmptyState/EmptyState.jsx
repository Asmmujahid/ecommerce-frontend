import InboxIcon from "@mui/icons-material/Inbox";
import Button from "@mui/material/Button";

const EmptyState = ({
    title = "No Data Found",
    message = "There is nothing to display right now.",
    buttonText = "Refresh",
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">

            {/* Empty Icon */}
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <InboxIcon
                    sx={{
                        fontSize: 60,
                        color: "#9CA3AF",
                    }}
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

            {/* Optional Button */}
            {onAction && (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onAction}
                >
                    {buttonText}
                </Button>
            )}

        </div>
    );
};

export default EmptyState;
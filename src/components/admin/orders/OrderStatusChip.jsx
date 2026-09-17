import { Chip } from "@mui/material";

const OrderStatusChip = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case "pending":
                return "warning";

            case "processing":
                return "info";

            case "shipped":
                return "primary";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };

    const getStatusLabel = () => {
        if (!status) return "Unknown";

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };

    return (
        <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            size="small"
            variant="filled"
            sx={{
                fontWeight: 600,
                minWidth: 90,
                textTransform: "capitalize",
            }}
        />
    );
};

export default OrderStatusChip;
import { Chip } from "@mui/material";

const OrderPaymentChip = ({ paymentStatus }) => {
    const getPaymentColor = () => {
        switch (paymentStatus) {
            case "paid":
                return "success";

            case "pending":
                return "warning";

            case "failed":
                return "error";

            default:
                return "default";
        }
    };

    const getPaymentLabel = () => {
        if (!paymentStatus) return "Unknown";

        return (
            paymentStatus.charAt(0).toUpperCase() +
            paymentStatus.slice(1)
        );
    };

    return (
        <Chip
            label={getPaymentLabel()}
            color={getPaymentColor()}
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

export default OrderPaymentChip;
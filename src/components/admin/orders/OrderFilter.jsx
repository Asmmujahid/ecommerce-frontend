import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";

const OrderFilter = ({
    status = "all",
    paymentStatus = "all",
    onStatusChange,
    onPaymentChange,
}) => {
    return (
        <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            mb={3}
        >
            {/* ORDER STATUS */}

            <FormControl
                size="small"
                sx={{
                    minWidth: {
                        xs: "100%",
                        sm: 220,
                    },
                }}
            >
                <InputLabel>
                    Order Status
                </InputLabel>

                <Select
                    label="Order Status"
                    value={status || "all"}
                    onChange={(event) =>
                        onStatusChange?.(
                            event.target.value
                        )
                    }
                >
                    <MenuItem value="all">
                        All Orders
                    </MenuItem>

                    <MenuItem value="pending">
                        Pending
                    </MenuItem>

                    <MenuItem value="processing">
                        Processing
                    </MenuItem>

                    <MenuItem value="shipped">
                        Shipped
                    </MenuItem>

                    <MenuItem value="delivered">
                        Delivered
                    </MenuItem>

                    <MenuItem value="cancelled">
                        Cancelled
                    </MenuItem>

                    <MenuItem value="refunded">
                        Refunded
                    </MenuItem>
                </Select>
            </FormControl>

            {/* PAYMENT STATUS */}

            <FormControl
                size="small"
                sx={{
                    minWidth: {
                        xs: "100%",
                        sm: 220,
                    },
                }}
            >
                <InputLabel>
                    Payment Status
                </InputLabel>

                <Select
                    label="Payment Status"
                    value={paymentStatus || "all"}
                    onChange={(event) =>
                        onPaymentChange?.(
                            event.target.value
                        )
                    }
                >
                    <MenuItem value="all">
                        All Payments
                    </MenuItem>

                    <MenuItem value="pending">
                        Pending
                    </MenuItem>

                    <MenuItem value="paid">
                        Paid
                    </MenuItem>

                    <MenuItem value="failed">
                        Failed
                    </MenuItem>

                    <MenuItem value="refunded">
                        Refunded
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default OrderFilter;

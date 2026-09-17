// src/components/common/LoadingState/LoadingState.jsx

import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingState = ({
    message = "Loading...",
}) => {
    return (
        <Box
            sx={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}
        >
            <CircularProgress />

            <Typography
                variant="body1"
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingState;
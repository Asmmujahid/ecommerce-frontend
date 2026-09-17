import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { hideSnackbar } from "../../../redux/ui/uiSlice";

const AppSnackbar = () => {
    const dispatch = useDispatch();

    const { open, message, severity } = useSelector(
        (state) => state.ui
    );

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;

        dispatch(hideSnackbar());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: "100%",
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;
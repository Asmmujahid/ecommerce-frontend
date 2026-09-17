// src/components/customer/review/ReviewDialog.jsx

import PropTypes from "prop-types";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import ReviewForm from "./ReviewForm";

// =====================================================
// COMPONENT
// =====================================================

const ReviewDialog = ({
    open,
    onClose,
    productId,
    productName = "",
}) => {
    const handleSuccess = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="review-dialog-title"
        >
            {/* =================================================
                DIALOG TITLE

                IMPORTANT:
                DialogTitle renders as <h2>.

                Therefore we must NOT put <div>, <h6>, etc.
                directly inside it.

                We use Typography with component="span".
            ================================================= */}

            <DialogTitle
                id="review-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 1,
                }}
            >
                {/* =================================================
                    TITLE CONTENT

                    component="span" prevents invalid nesting
                    inside DialogTitle's <h2>.
                ================================================= */}

                <Typography
                    component="span"
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        display: "block",
                        flex: 1,
                    }}
                >
                    Write a Review
                </Typography>

                {/* =================================================
                    CLOSE BUTTON
                ================================================= */}

                <IconButton
                    onClick={onClose}
                    size="small"
                    aria-label="Close review dialog"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>
                <ReviewForm
                    productId={productId}
                    productName={productName}
                    onSuccess={handleSuccess}
                    onCancel={onClose}
                />
            </DialogContent>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// =====================================================
// PROP TYPES
// =====================================================

ReviewDialog.propTypes = {
    open: PropTypes.bool.isRequired,

    onClose: PropTypes.func.isRequired,

    productId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,

    productName: PropTypes.string,
};

// =====================================================
// EXPORT
// =====================================================

export default ReviewDialog;
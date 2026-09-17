import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import ProductForm from "./ProductForm";


const ProductModal = ({
    open,
    onClose,
    product = null,
    isEdit = false,
}) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >

            {/* ======================================== */}
            {/* Header */}
            {/* ======================================== */}

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                }}
            >

                {isEdit
                    ? "Edit Product"
                    : "Add Product"}


                <IconButton
                    onClick={onClose}
                    aria-label="Close"
                >
                    <CloseIcon />
                </IconButton>

            </DialogTitle>


            {/* ======================================== */}
            {/* Body */}
            {/* ======================================== */}

            <DialogContent dividers>

                <ProductForm
                    product={product}
                    isEdit={isEdit}
                    onSuccess={onClose}
                />

            </DialogContent>


            {/* ======================================== */}
            {/* Footer */}
            {/* ======================================== */}

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                    variant="outlined"
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default ProductModal;

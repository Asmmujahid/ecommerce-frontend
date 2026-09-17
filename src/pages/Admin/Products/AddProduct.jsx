import {
    Paper,
    Typography,
} from "@mui/material";

import ProductForm from "../../../components/admin/products/ProductForm";

const AddProduct = () => {
    return (
        <div className="p-6">

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Add Product
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                    }}
                >
                    Create a new product and assign
                    it to a Vendor Store.
                </Typography>

                <ProductForm
                    isEdit={false}
                />

            </Paper>

        </div>
    );
};

export default AddProduct;


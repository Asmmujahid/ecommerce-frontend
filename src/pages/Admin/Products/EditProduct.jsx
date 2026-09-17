import {
    useEffect,
} from "react";

import {
    useParams,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Paper,
    Typography,
    CircularProgress,
    Alert,
} from "@mui/material";

import {
    getProduct,
} from "../../../redux/admin/productSlice";

import ProductForm from "../../../components/admin/products/ProductForm";

const EditProduct = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const {
        product,
        loading,
        error,
    } = useSelector(
        (state) => state.adminProduct
    );

    useEffect(() => {
        dispatch(
            getProduct(id)
        );
    }, [
        dispatch,
        id,
    ]);

    if (loading) {
        return (
            <div
                className="
                    flex
                    justify-center
                    items-center
                    py-20
                "
            >
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">

                <Alert severity="error">
                    {error}
                </Alert>

            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-6">

                <Alert severity="warning">
                    Product not found.
                </Alert>

            </div>
        );
    }

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
                    Edit Product
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        mb: 4,
                    }}
                >
                    Update product information.
                    Product ownership cannot be changed.
                </Typography>

                <ProductForm
                    product={product}
                    isEdit={true}
                />

            </Paper>

        </div>
    );
};

export default EditProduct;


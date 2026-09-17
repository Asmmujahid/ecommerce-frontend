
// src/components/customer/brands/BrandList.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import BrandCard from "./BrandCard";

import {
    fetchBrands,
    selectBrands,
    selectBrandLoading,
    selectBrandError,
} from "../../../redux/customer/brandSlice";

/*
|--------------------------------------------------------------------------
| Brand List Component
|--------------------------------------------------------------------------
*/

const BrandList = () => {
    const dispatch = useDispatch();

    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const brands = useSelector(selectBrands);
    const loading = useSelector(selectBrandLoading);
    const error = useSelector(selectBrandError);

    /*
    |--------------------------------------------------------------------------
    | Fetch Brands
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <Box
                sx={{
                    py: 8,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    color="error"
                    fontWeight={600}
                >
                    Unable to load brands
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                    }}
                >
                    {error}
                </Typography>
            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Empty State
    |--------------------------------------------------------------------------
    */

    if (!brands || brands.length === 0) {
        return (
            <Box
                sx={{
                    py: 8,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    No Brands Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                    }}
                >
                    There are currently no active brands available.
                </Typography>
            </Box>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Brands
    |--------------------------------------------------------------------------
    */

    return (
        <Grid
            container
            spacing={3}
        >
            {brands.map((brand) => (
                <Grid
                    item
                    key={brand.id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                >
                    <BrandCard brand={brand} />
                </Grid>
            ))}
        </Grid>
    );
};

export default BrandList;


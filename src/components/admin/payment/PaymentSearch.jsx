// ============================================================
// FILE:
// src/components/admin/payment/PaymentSearch.jsx
// ============================================================

import React from "react";

import {
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const PaymentSearch = ({
    value = "",
    onSearch,
    disabled = false,
}) => {
    const handleChange = (event) => {
        const searchValue = event.target.value;

        if (typeof onSearch === "function") {
            onSearch(searchValue);
        }
    };

    return (
        <TextField
            fullWidth
            value={value}
            onChange={handleChange}
            label="Search Payments"
            placeholder="Search by payment ID, order number, customer, transaction ID..."
            variant="outlined"
            disabled={disabled}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default PaymentSearch;
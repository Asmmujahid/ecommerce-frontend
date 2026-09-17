import { useState, useEffect } from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const VendorSearch = ({
    vendors = [],
    onSearch,
}) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!onSearch) return;

        if (!search.trim()) {
            onSearch(vendors);
            return;
        }

        const keyword = search.toLowerCase();

        const filtered = vendors.filter((vendor) => {
            return (
                vendor.store_name
                    ?.toLowerCase()
                    .includes(keyword) ||

                vendor.user?.name
                    ?.toLowerCase()
                    .includes(keyword) ||

                vendor.user?.email
                    ?.toLowerCase()
                    .includes(keyword) ||

                vendor.phone
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });

        onSearch(filtered);

    }, [search, vendors, onSearch]);

    const handleClear = () => {
        setSearch("");

        if (onSearch) {
            onSearch(vendors);
        }
    };

    return (
        <Box mb={3}>
            <TextField
                fullWidth
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Search by Store Name, Owner, Email or Phone..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),

                    endAdornment: search && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClear}
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default VendorSearch;
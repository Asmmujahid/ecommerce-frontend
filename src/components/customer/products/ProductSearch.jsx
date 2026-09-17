
import { useState } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const ProductSearch = ({
    value = "",
    onChange,
    onSearch,
    onClear,
    placeholder = "Search products...",
    loading = false,
}) => {
    const [keyword, setKeyword] = useState(value);

    /*
    |--------------------------------------------------------------------------
    | Handle Input Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {
        const newValue = event.target.value;

        setKeyword(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const handleSearch = () => {
        const searchValue = keyword.trim();

        if (onSearch) {
            onSearch(searchValue);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Enter Key
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Search
    |--------------------------------------------------------------------------
    */

    const handleClear = () => {
        setKeyword("");

        if (onChange) {
            onChange("");
        }

        if (onClear) {
            onClear();
        } else if (onSearch) {
            onSearch("");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
            }}
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <TextField
                fullWidth
                value={keyword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                size="small"
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),

                    endAdornment: keyword && (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClear}
                                size="small"
                                disabled={loading}
                                aria-label="Clear search"
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={loading}
                sx={{
                    minWidth: 110,
                    height: 40,
                    textTransform: "none",
                }}
            >
                {loading ? "Searching..." : "Search"}
            </Button>
        </Box>
    );
};

export default ProductSearch;


import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const ReturnRequestSearch = ({
    value,
    onSearch,
}) => {
    const handleChange = (e) => {
        onSearch(e.target.value);
    };

    const handleClear = () => {
        onSearch("");
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <TextField
                    fullWidth
                    placeholder="Search by ID, customer, order, product, reason or status..."
                    value={value}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: value ? (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />
            </CardContent>
        </Card>
    );
};

ReturnRequestSearch.propTypes = {
    value: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default ReturnRequestSearch;
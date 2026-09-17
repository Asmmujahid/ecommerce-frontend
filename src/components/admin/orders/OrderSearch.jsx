import {
    Box,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const OrderSearch = ({
    search,
    setSearch,
}) => {
    return (
        <Box mb={3}>
            <TextField
                fullWidth
                placeholder="Search by Order #, Customer, Email..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),

                    endAdornment: search ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    );
};

export default OrderSearch;
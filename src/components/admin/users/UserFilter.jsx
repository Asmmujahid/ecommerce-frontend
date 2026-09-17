import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const UserFilter = ({ value = "all", onChange }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>

                <Select
                    value={value}
                    label="Status"
                    onChange={(e) => onChange(e.target.value)}
                >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default UserFilter;
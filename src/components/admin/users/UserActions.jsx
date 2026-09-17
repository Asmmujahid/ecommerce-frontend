import PropTypes from "prop-types";

import {
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UserActions = ({
    user,
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
        >
            {/* View */}

            <Tooltip title="View Customer">
                <IconButton
                    color="primary"
                    onClick={() => onView(user)}
                >
                    <VisibilityIcon />
                </IconButton>
            </Tooltip>

            {/* Edit */}

            <Tooltip title="Edit Customer">
                <IconButton
                    color="warning"
                    onClick={() => onEdit(user)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            {/* Delete */}

            <Tooltip title="Delete Customer">
                <IconButton
                    color="error"
                    onClick={() => onDelete(user)}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

UserActions.propTypes = {
    user: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

UserActions.defaultProps = {
    onView: () => {},
    onEdit: () => {},
    onDelete: () => {},
};

export default UserActions;
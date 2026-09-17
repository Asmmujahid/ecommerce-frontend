import { useNavigate } from "react-router-dom";

import {
    TableRow,
    TableCell,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import UserStatusSwitch from "./UserStatusSwitch";

const UserRow = ({ user, onDelete }) => {
    const navigate = useNavigate();

    // ==========================================
    // View User
    // ==========================================

    const handleView = () => {
        navigate(`/admin/users/view/${user.id}`);
    };

    const handleEdit = () => {
    navigate(`/admin/users/edit/${user.id}`);
};

    // ==========================================
    // UI
    // ==========================================

    return (
        <TableRow hover>

            <TableCell>
                <Avatar
                    src={user.avatar || ""}
                    alt={user.name || "Customer"}
                    sx={{
                        width: 45,
                        height: 45,
                    }}
                >
                    {user.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                </Avatar>
            </TableCell>

            <TableCell>
                <span className="font-medium">
                    {user.name || "-"}
                </span>
            </TableCell>

            <TableCell>
                {user.email || "-"}
            </TableCell>

            <TableCell>
                {user.phone || "-"}
            </TableCell>

            <TableCell align="center">
                <UserStatusSwitch user={user} />
            </TableCell>

            <TableCell>
                {user.created_at
                    ? new Date(
                          user.created_at
                      ).toLocaleDateString()
                    : "-"}
            </TableCell>

            <TableCell align="center">

                <div className="flex justify-center gap-2">

                    <Tooltip title="View Customer">
                        <IconButton
                            color="primary"
                            onClick={handleView}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                   <Tooltip title="Edit Customer">
    <IconButton
        color="warning"
        onClick={handleEdit}
    >
        <EditIcon />
    </IconButton>
</Tooltip>

<Tooltip title="Delete Customer">
    <IconButton
        color="error"
        onClick={() => onDelete?.(user)}
    >
        <DeleteIcon />
    </IconButton>
</Tooltip>

                </div>

            </TableCell>

        </TableRow>
    );
};

export default UserRow;
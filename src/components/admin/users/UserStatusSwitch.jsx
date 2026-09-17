import { useState } from "react";
import { useDispatch } from "react-redux";

import {
    Switch,
    CircularProgress,
    Tooltip,
} from "@mui/material";

import { updateUser } from "../../../redux/admin/userSlice";

const UserStatusSwitch = ({ user }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (event) => {
        const status = event.target.checked;

        setLoading(true);

        try {
            await dispatch(
                updateUser({
                    id: user.id,
                    userData: {
                        status,
                    },
                })
            ).unwrap();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">

            {loading ? (
                <CircularProgress size={22} />
            ) : (
                <Tooltip
                    title={
                        user.status
                            ? "Deactivate User"
                            : "Activate User"
                    }
                >
                    <Switch
                        checked={Boolean(user.status)}
                        onChange={handleStatusChange}
                        color="success"
                    />
                </Tooltip>
            )}

        </div>
    );
};

export default UserStatusSwitch;
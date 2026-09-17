import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../redux/authSlice";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
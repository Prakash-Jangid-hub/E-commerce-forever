import { useContext, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/authContext.jsx";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const {token, logout, BACKEND_URL} = useContext(AuthContext)

    useEffect(() => {
        const verifyAdmin = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_URL}/user/adminverify`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.admin.role !== "admin") {
                    logout()
                    navigate("/login")
                }

            } catch (error) {
                logout()
                navigate("/login");
            }
        };

        verifyAdmin();
    }, [token, navigate]);

    return children;
};

export default ProtectedRoute

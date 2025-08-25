import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()



export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("Token"))
    const navigate = useNavigate()
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const currency = "$"

    useEffect(() => {
        if (token) {
            localStorage.setItem("Token", token)
        } else {
            localStorage.removeItem("Token")
            navigate("/login")
        }
    }, [token, navigate])

    const login = (newToken) => {
        setToken(newToken)
    }

    const logout = () => {
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, currency, login, logout, BACKEND_URL }}>
            {children}
        </AuthContext.Provider>
    )

}
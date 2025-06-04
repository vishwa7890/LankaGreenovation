import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        axios.get('http://localhost:5000/user/dashboard', { withCredentials: true })
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null));
    }, []);

    
    const logout = async () => {
        await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

import { createContext, useContext, useMemo, useState, useEffect} from "react";
import loginService from "../services/login";
import type { User } from "../types/user";

interface AuthContext {
    user: User | null;
    login: (u: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const user = await loginService.restoreLogin();
            setUser(user);
        };
        init();
    }, []);

    const login = (u: User) => {
        setUser(u);
    }

    const logout = () => {
        setUser(null);
    }

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }

    return context;
}
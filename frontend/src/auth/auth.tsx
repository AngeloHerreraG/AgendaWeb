import { createContext, useContext, useMemo, useState, useEffect} from "react";
import loginService from "../services/login";
import type { User } from "../types/user";

interface AuthContext {
    user: User | null;
    login: (u: User) => void;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await loginService.restoreLogin();
                setUser(user);
            } catch {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const login = (u: User) => {
        setUser(u);
    }

    const logout = () => {
        setUser(null);
    }

    const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

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
import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage("abga_token", null);
  const [user, setUser] = useLocalStorage("abga_user", null);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}


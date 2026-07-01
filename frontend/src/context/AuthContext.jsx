import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authApi.getStoredUser());
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  const register = async (payload) => {
    const result = await authApi.register(payload);
    if (result.success) setUser(result.user);
    return result;
  };

  const forgotPassword = async (email) => authApi.forgotPassword(email);

  const googleLogin = async (payload) => {
    const result = await authApi.googleLogin(payload);
    if (result.success) setUser(result.user);
    return result;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, forgotPassword, googleLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

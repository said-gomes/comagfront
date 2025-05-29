import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token); // Decode and validate the token
      setUser(decoded);
      localStorage.setItem("token", token); // Store the token
    } catch {
      logout(); // If token is invalid, log out
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const storedToken = () => localStorage.getItem("pgfinder_token");
const storedUser = () => {
  const raw = localStorage.getItem("pgfinder_user");
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storedToken());
  const [user, setUser] = useState(storedUser());

  const login = (nextToken, nextUser) => {
    localStorage.setItem("pgfinder_token", nextToken);
    localStorage.setItem("pgfinder_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("pgfinder_token");
    localStorage.removeItem("pgfinder_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

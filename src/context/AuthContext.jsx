import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "agrilink_auth_user";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadUser());

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const login = (userData) => {
    let role = userData.role || "buyer";
    const email = (userData.email || "").toLowerCase();
    if (email === "admin@agrilink.et") role = "admin";
    setUser({ ...userData, role });
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

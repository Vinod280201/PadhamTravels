import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously initialize state from localStorage if available
  const [user, setUserState] = useState(() => {
    try {
      const savedUser = localStorage.getItem("authUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Centralized setter that keeps localStorage & React state in sync
  const setUser = useCallback((userData) => {
    if (userData) {
      localStorage.setItem("authUser", JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem("authUser");
      sessionStorage.clear();
      localStorage.removeItem("user_flight_search_pref");
      setUserState(null);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/get-user`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setUser(null);
        return;
      }

      const data = await res.json();

      if (data.status && data.user) {
        setUser(data.user);
      } else if (!data.status && !localStorage.getItem("authUser")) {
        setUser(null);
      }
    } catch (err) {
      console.warn("Auth status check fallback:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Sync across tabs and storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "authUser" || e.key === null) {
        try {
          const savedUser = localStorage.getItem("authUser");
          setUserState(savedUser ? JSON.parse(savedUser) : null);
        } catch {
          setUserState(null);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = useCallback(async (navigate) => {
    try {
      if (typeof navigate === "function") {
        navigate("/", { replace: true });
      }

      localStorage.removeItem("authUser");
      localStorage.removeItem("user_flight_search_pref");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("flightSearch_")) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();

      setUserState(null);

      await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } catch (err) {
      console.error("Logout error:", err);
      setUserState(null);
      if (typeof navigate === "function") {
        navigate("/", { replace: true });
      }
    }
  }, [baseUrl]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthUser must be used within an AuthProvider");
  }
  return context;
}

export const useAuth = useAuthUser;
export default useAuthUser;

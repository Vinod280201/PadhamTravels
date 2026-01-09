import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/get-user`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          if (!cancelled) setUser(null);
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          if (data.status) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return { user, loading, setUser };
}

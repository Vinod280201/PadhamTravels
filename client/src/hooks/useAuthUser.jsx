import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // 1. Import useLocation

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // 2. Get current location
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // 3. Define Public Pages where you DON'T want to check auth
    // Add any other public paths here if needed
    const publicPages = ["/"];

    // If we are on the landing page, skip the fetch entirely
    if (publicPages.includes(location.pathname)) {
      setLoading(false);
      return; // STOP HERE
    }

    // --- Standard Fetch Logic Below ---
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/auth/get-user`, {
          method: "GET",
          credentials: "include",
          signal: signal,
        });

        if (res.status === 401 || res.status === 403) {
          setUser(null);
          localStorage.removeItem("authUser");
          sessionStorage.clear();
          localStorage.removeItem("user_flight_search_pref");
          return;
        }

        const data = await res.json();

        if (data.status) {
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem("authUser");
          sessionStorage.clear();
          localStorage.removeItem("user_flight_search_pref");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setUser(null);
          localStorage.removeItem("authUser");
          sessionStorage.clear();
          localStorage.removeItem("user_flight_search_pref");
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, []); // Run once on mount

  return { user, loading, setUser };
}

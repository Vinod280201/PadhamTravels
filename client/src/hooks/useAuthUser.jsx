import { useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState(null); // { name, email, role } or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/get-user", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.status) {
          setUser(data.user);
          console.log("useAuthUser data.user =", data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // return state and setter so you can update after login/logout
  return { user, loading, setUser };
}

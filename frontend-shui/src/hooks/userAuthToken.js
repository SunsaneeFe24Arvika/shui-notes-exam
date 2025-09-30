import { useState, useEffect } from "react";

export const useAuthToken = (key = "authToken") => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem(key) || "";
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem(key, token);
        } else {
            localStorage.removeItem(key);
        }
    }, [token, key]);

    return { token, setToken };
};
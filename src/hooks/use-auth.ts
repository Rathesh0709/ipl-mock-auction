import { useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userData = localStorage.getItem("userData");
    
    if (userEmail && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userData");
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string) => {
    const userData: User = { email, name: email.split("@")[0] || email };
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
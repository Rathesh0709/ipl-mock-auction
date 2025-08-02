import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useState } from "react";

interface User {
  email: string;
  name: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Get the current user from localStorage or session
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userData = localStorage.getItem("userData");
    
    if (userEmail && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
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
    // Store user data in localStorage
    const userData: User = { email, name: email.split("@")[0] || email };
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userData", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return {
    isLoading,
    isAuthenticated,
    user: currentUser,
    signIn,
    signOut,
  };
}
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";

interface User {
  email: string;
  name: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const createUser = useMutation(api.users.createUser);
  
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
    try {
      // Create user in database
      const userName = email.split("@")[0] || email;
      await createUser({ email, name: userName });
      
      // Store in localStorage
      const userData: User = { email, name: userName };
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    // Navigate to landing page after sign out
    navigate("/");
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
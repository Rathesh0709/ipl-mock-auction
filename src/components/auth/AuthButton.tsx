import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { AuthCard } from "./AuthCard";

interface AuthButtonProps {
  trigger?: React.ReactNode;
  dashboardTrigger?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  useModal?: boolean;
}

export function AuthButton({
  trigger,
  dashboardTrigger,
  defaultOpen = false,
  onOpenChange,
  useModal = true,
}: AuthButtonProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(defaultOpen);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    if (dashboardTrigger) {
      return <>{dashboardTrigger}</>;
    }
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button asChild>
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </motion.div>
    );
  }

  const defaultTrigger = (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button>Get Started</Button>
    </motion.div>
  );

  if (!useModal) {
    return (
      <Button asChild>
        <Link to="/auth">{trigger || "Get Started"}</Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">Sign in to your account</DialogDescription>
        <AuthCard />
      </DialogContent>
    </Dialog>
  );
}
import { Button } from "@/components/ui/button";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export function UsernameSetupDialog() {
const { user } = useAuth();
const [name, setName] = useState("");
const [isOpen, setIsOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const updateUserName = useMutation(api.users.updateUserName);
useEffect(() => {
if (user && !user.name) {
setIsOpen(true);
}
}, [user]);
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!name.trim()) return;
setIsSubmitting(true);
try {
await updateUserName({ name: name.trim() });
setIsOpen(false);
toast.success("Welcome! Your profile has been set up.");
} catch (error) {
toast.error("Failed to update your name. Please try again.");
} finally {
setIsSubmitting(false);
}
};
if (!user || user.name) {
return null;
}
return (
<Dialog open={isOpen} onOpenChange={() => {}}>
<DialogContent className="sm:max-w-[425px]" hideClose>
<DialogHeader>
<DialogTitle>Welcome to IPL Auction!</DialogTitle>
<DialogDescription>
Please enter your name to complete your profile setup.
</DialogDescription>
</DialogHeader>
<form onSubmit={handleSubmit}>
<div className="grid gap-4 py-4">
<div className="grid gap-2">
<Label htmlFor="name">Your Name</Label>
<Input
id="name"
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="Enter your full name"
required
disabled={isSubmitting}
/>
</div>
</div>
<DialogFooter>
<Button type="submit" disabled={isSubmitting || !name.trim()}>
{isSubmitting ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Setting up...
</>
) : (
"Continue"
)}
</Button>
</DialogFooter>
</form>
</DialogContent>
</Dialog>
);
}   
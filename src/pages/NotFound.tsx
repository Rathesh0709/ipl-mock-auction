import { Button } from "@/components/ui/button";
import { Link } from "react-router";
export default function NotFound() {
return (
<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
<h1 className="text-9xl font-bold text-primary">404</h1>
<h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
<p className="text-muted-foreground mt-2">
Sorry, the page you are looking for does not exist.
</p>
<Button asChild className="mt-6">
<Link to="/">Go to Homepage</Link>
</Button>
</div>
);
}
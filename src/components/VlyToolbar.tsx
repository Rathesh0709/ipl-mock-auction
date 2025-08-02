import { useEffect } from "react";
export function VlyToolbar() {
useEffect(() => {
// Send initial route to parent
window.parent.postMessage(
{ type: "iframe-route-change", path: window.location.pathname },
"*",
);
}, []);
return null;
}
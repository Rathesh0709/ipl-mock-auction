import { ReactNode } from "react";
interface InstrumentationProviderProps {
children: ReactNode;
}
export function InstrumentationProvider({ children }: InstrumentationProviderProps) {
return <>{children}</>;
}
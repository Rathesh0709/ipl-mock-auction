import React from "react";

interface InstrumentationProviderProps {
  children: React.ReactNode;
}

export function InstrumentationProvider({ children }: InstrumentationProviderProps) {
  return <>{children}</>;
}
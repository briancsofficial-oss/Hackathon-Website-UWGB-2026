"use client";
import { createContext, useContext } from "react";
import { useStatements } from "./use-statements";

type Ctx = ReturnType<typeof useStatements>;
const StatementsContext = createContext<Ctx | null>(null);

export function StatementsProvider({ children }: { children: React.ReactNode }) {
  const value = useStatements();
  return <StatementsContext.Provider value={value}>{children}</StatementsContext.Provider>;
}
export function useData() {
  const ctx = useContext(StatementsContext);
  if (!ctx) throw new Error("useData must be used inside StatementsProvider");
  return ctx;
}

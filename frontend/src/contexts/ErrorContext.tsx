// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ErrorContextType {
  errors: string[];
  setErrors: (errors: string[]) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrorsState] = useState<string[]>([]);

  const setErrors = (errs: string[]) => setErrorsState(errs);
  const clearErrors = () => setErrorsState([]);

  return (
    <ErrorContext.Provider value={{ errors, setErrors, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error("useError must be used inside ErrorProvider");
  }
  return ctx;
};

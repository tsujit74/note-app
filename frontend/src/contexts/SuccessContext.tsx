// src/contexts/SuccessContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type SuccessContextType = {
  successMessages: string[];
  setSuccessMessages: (messages: string[]) => void;
  addSuccess: (message: string) => void;
  clearSuccess: () => void; // ✅ add this
};

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export const SuccessProvider = ({ children }: { children: ReactNode }) => {
  const [successMessages, setSuccessMessages] = useState<string[]>([]);

  const addSuccess = (message: string) => {
    setSuccessMessages((prev) => [...prev, message]);
  };

  const clearSuccess = () => {
    setSuccessMessages([]);
  };

  return (
    <SuccessContext.Provider
      value={{ successMessages, setSuccessMessages, addSuccess, clearSuccess }}
    >
      {children}
    </SuccessContext.Provider>
  );
};

export const useSuccess = () => {
  const context = useContext(SuccessContext);
  if (!context) {
    throw new Error("useSuccess must be used within SuccessProvider");
  }
  return context;
};

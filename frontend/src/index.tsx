import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ErrorProvider } from "./contexts/ErrorContext";
import { SuccessProvider } from "./contexts/SuccessContext";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorProvider>
      <SuccessProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SuccessProvider>
    </ErrorProvider>
  </React.StrictMode>
);

reportWebVitals();

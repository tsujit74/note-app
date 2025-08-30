import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ErrorProvider } from "./contexts/ErrorContext";
import { SuccessProvider } from "./contexts/SuccessContext";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <ErrorProvider>
        <SuccessProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SuccessProvider>
      </ErrorProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
